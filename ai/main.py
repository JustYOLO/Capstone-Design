import httpx
import chromadb
import ollama
import ast
import os
from flask import Flask, request, Response, jsonify
import json
import redis

app = Flask(__name__)

rd = redis.StrictRedis(host='chat_log', port=6666, db=0)

# client = ollama.Client(host='http://172.17.0.1:11434')

client = ollama.Client(host='http://host.docker.internal:11434')

#client_en = chromadb.PersistentClient(path="./chromadb_storage_en")
#collection_en = client_en.get_or_create_collection(name="flowers_en")

client_ko = chromadb.PersistentClient(path="/app/chromadb_storage_ko")
collection_ko = client_ko.get_or_create_collection(name="flowers_ko")


def search_flower_ko(situation):
    # 사용자가 입력한 상황을 벡터 임베딩
    query_embedding = client.embeddings(model="llama3-ko:latest", prompt=situation)["embedding"]
    
    # 가장 유사한 꽃말을 가진 꽃 검색
    results = collection_ko.query(
        query_embeddings=[query_embedding],
        n_results=3  # 검색할 결과 개수 (최대 3개 추천)
    )

    recommended_flowers = []
    if results["documents"]:
        for doc in results["documents"][0]:
            if ": " in doc:
                flower, meaning = doc.split(": ", 1)
                recommended_flowers.append((flower.strip(), meaning.strip()))

    if not recommended_flowers:
        return "검색 결과가 없습니다."

    return recommended_flowers



def generate_flower_recommendation_ko(situation, recommended_flowers):
    """추천된 꽃 목록을 바탕으로 Ollama를 이용해 자연스러운 추천 문장 생성"""
    if not recommended_flowers:
        return "죄송합니다. 적절한 꽃을 찾을 수 없습니다."
    
    flowers_info = ", ".join([f"{f}({m})" for f, m in recommended_flowers])
    #print(flowers_info)
    prompt_text = f"""
        You are a flower expert. The user has requested a flower recommendation for the following situation:
        Situation: {situation}

        Here are the recommended flowers and their meanings:
        {flowers_info}

        Please write a kind, heartfelt, and logically clear recommendation that explains how the meanings of these flowers relate to the user's situation.

        ## Output Format
        
        - 종합 추천 이유:
        [Explain logically and kindly how the combined meanings of the recommended flowers connect specifically to the user's situation. And there should be a new line between flower descriptions.]

        Important Instructions:
        - Provide ONLY the '종합 추천 이유' section.
        - Do NOT include any other sections or titles.
        - Respond strictly in Korean.
    """
    
    # 응답 생성
    output = client.generate(model="gemma3:4b", prompt=prompt_text)
    return output["response"]






def format_recommended_flowers(recommended_flowers_ko):
    """주어진 recommended_flowers_ko 데이터를 원하는 형식으로 변환"""
    formatted_lines = ["추천하는 꽃과 꽃말:"]
    for flower, reason in recommended_flowers_ko:
        formatted_lines.append(f"{flower}: {reason}")
    return "\n\n".join(formatted_lines)




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
    
    print("DEBUG:", flowers)

    result = generate_flower_recommendation_ko(situation, flowers)
    flowers = format_recommended_flowers(flowers)
    return Response(
        json.dumps({
            "recommendation": result,
            "flowers": flowers
        }, ensure_ascii=False),
        content_type='application/json'
    ), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8111)
