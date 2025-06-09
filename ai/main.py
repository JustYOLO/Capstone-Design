import httpx
import chromadb
import ollama
import ast
import os
from flask import Flask, request, Response, jsonify
import json
import redis
import re

app = Flask(__name__)

rd = redis.StrictRedis(host='chat_log', port=6666, db=0)

client = ollama.Client(host='http://host.docker.internal:11434')

client_ko = chromadb.PersistentClient(path="/app/chromadb_storage_ko")
collection_ko = client_ko.get_or_create_collection(name="flowers_ko")


def extract_keywords(situation: str) -> list:
    prompt = f"""
    다음 문장에서 핵심 의미를 담은 단어(예: 감정, 목적, 관계 등)를 3개 추출해줘. 꼭 문장 내 단어가 존재하지 않아도 괜찮다. 
    너가 상황을 유추하여 꽃 추천에 중심이 되는 단어만 뽑아줘. 
    절대 '선물', '꽃' 단어는 뽑지마.

    문장: "{situation}"

    ## 출력 예시
    - 키워드: ["존경", "교수님", "감사"]
    - 키워드: ["감사", "어버이", "부모님"]
    - 키워드: ["사랑", "기념일", "연인"]
    
    절대 '선물', '꽃' 단어는 뽑지마.

    반드시 Python 리스트 형식으로 출력해.
    """
    output = client.generate(model="gemma3:12b", prompt=prompt)["response"]
    print(f"[키워드 추출 결과]: {output.strip()}")

    try:
        # 리스트 안의 문자열만 추출
        matches = re.findall(r'"(.*?)"', output)
        return matches
    except Exception as e:
        print(f"[keyword parse error] {e}")
        return []



def search_flower_ko(situation: str) -> list:
    keywords = extract_keywords(situation)
    print(f"[추출된 키워드]: {keywords}")

    all_candidates = []
    for keyword in keywords:
        print(f"[🔍 검색 기준 키워드]: {keyword}")
        query_embedding = client.embeddings(model="llama3-ko:latest", prompt=keyword)["embedding"]
        results = collection_ko.query(
            query_embeddings=[query_embedding],
            n_results=10  
        )
        docs = results["documents"][0]
        print(f"[{keyword} 후보]: {docs}")
        all_candidates.extend(docs)

    # 중복 제거
    all_candidates = list(dict.fromkeys(all_candidates))

    flowers_info = "\n".join(all_candidates)
    
    # 최종 추천 3개를 LLM으로 재정렬
    prompt = f"""
    상황: "{situation}"
    
    당신은 꽃 전문가입니다. 사용자가 요청한 상황에 가장 잘 어울리는 꽃을 감정적으로 잘 추천해주세요.
    아래는 추천 후보 꽃과 그 꽃말입니다.

    {flowers_info}
    
    이 중에서 상황에 가장 잘 어울리면서 꽃집에서 구할 수 있는 꽃 3개를 선택해주세요.

    ## 출력 형식: (이유는 절대 추천하지 않습니다)
    - 꽃: 꽃말
    
    ## 예시 출력: (아래 예시처럼 출력해주세요)
    - 클로버: 약속, 행운, 평화
    - 물망초: 나를 잊지 마세요, 진실한 사랑, 우정
    - 설강화: 희망
    """
    
    response = client.generate(model="gemma3:12b", prompt=prompt)["response"]

    print(f"[추천된 꽃 목록]: {response.strip()}")

    final_result = []
    for line in response.strip().split("\n"):
        if ":" in line:
            name, reason = line.split(":", 1)
            final_result.append((name.strip(), reason.strip()))
    return final_result



def generate_flower_recommendation_ko(situation, recommended_flowers):
    """추천된 꽃 목록을 바탕으로 Ollama를 이용해 자연스러운 추천 문장 생성"""
    if not recommended_flowers:
        return "죄송합니다. 적절한 꽃을 찾을 수 없습니다."
    
    flowers_info = ", ".join([f"{f}({m})" for f, m in recommended_flowers])
    
    prompt_text = f"""
        You are a flower expert. The user has requested a flower recommendation for the following situation:
        Situation: {situation}

        Here are the recommended flowers and their meanings:
        {flowers_info}

        Please write a kind, heartfelt, and logically clear recommendation that explains how the meanings of these flowers relate to the user's situation.

        ## Output Format
        
        - 종합 추천 이유:
        [Explain logically and kindly how the combined meanings of the recommended flowers connect specifically to the user's situation.]

        Important Instructions:
        - Provide ONLY the '종합 추천 이유' section.
        - Do NOT include any other sections or titles.
        - Respond strictly in Korean.
        - And there must be a new line between each flower descriptions.
    """
    
    # 응답 생성
    output = client.generate(model="gemma3:12b", prompt=prompt_text)
    return output["response"]






def format_recommended_flowers(recommended_flowers_ko):
    """주어진 recommended_flowers_ko 데이터를 원하는 형식으로 변환"""
    formatted_lines = ["추천하는 꽃과 꽃말:"]
    for flower, reason in recommended_flowers_ko:
        formatted_lines.append(f"{flower}: {reason}")
    return "\n\n".join(formatted_lines)



def extract_flower_names(flowers):
    """꽃 목록에서 꽃 이름만 추출하여 리스트로 반환합니다."""
    flower_names = [flower[0].replace('- ', '') for flower in flowers]
    return flower_names


@app.route("/api/generate", methods=["POST"])
def recommend():
    data = request.get_json()
    situation = data.get("prompt")

    if not situation:
        return Response(
            json.dumps({"error": "situation is required"}, ensure_ascii=False),
            content_type='application/json'
        ), 400

    print("DEBUG:", situation)
    
    flowers = search_flower_ko(situation)
    
    print("DEBUG: 꽃과 꽃말 \n", flowers)
    
    flower_names = extract_flower_names(flowers)
    print("DEBUG: 꽃 이름들 \n", flower_names)

    result = generate_flower_recommendation_ko(situation, flowers)
    # print("DEBUG:", result)
    format_flowers = format_recommended_flowers(flowers)
    # print("DEBUG: 꽃 형식 \n", format_flowers)

    flowers_result = format_flowers + "\n" + "\n" + result 
    print("DEBUG: 최종 출력 \n", flowers_result)
    return Response(
        flowers_result,
        content_type='text/plain'
    ), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8111)