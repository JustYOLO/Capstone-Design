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

# client_ko = chromadb.PersistentClient(path="./chromadb_storage_ko")
client_ko = chromadb.PersistentClient(path="/app/chromadb_storage_ko")
collection_ko = client_ko.get_or_create_collection(name="flowers_ko")

# 상황에 맞는 꽃 추천 함수
def search_flower_en(situation):
    # 사용자가 입력한 상황을 벡터 임베딩
    query_embedding = client.embeddings(model="llama3:latest", prompt=situation)["embedding"]
    
    # 가장 유사한 꽃말을 가진 꽃 검색
    results = collection_en.query(
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


def search_flower_ko(situation):
    # 사용자가 입력한 상황을 벡터 임베딩
    # query_embedding = ollama.embeddings(model="llama3-ko:latest", prompt=situation)["embedding"]
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




def generate_flower_recommendation(situation, recommended_flowers):
    """추천된 꽃 목록을 바탕으로 Ollama를 이용해 자연스러운 추천 문장 생성"""
    if not recommended_flowers:
        return "죄송합니다. 적절한 꽃을 찾을 수 없습니다."

    flowers_info = ", ".join([f"{f}({m})" for f, m in recommended_flowers])
    print(flowers_info)
    prompt_text = f"""
        You are a flower expert. Recommend a flower that suits the user's situation and logically explain its meaning and the reason for your recommendation.
        The user has requested a flower recommendation for the following situation:

        Situation: {situation}

        Recommended flowers and their meanings: {flowers_info}

        Please provide a kind yet logical response following the format below.

        ## Output Format (Explain logically why you recommended these flowers)
        - Reason for Recommendation: [Logically explain how the flower meaning connects to the user's situation]
    """
    
    # 응답 생성
    output = client.generate(model="llama3:latest", prompt=prompt_text)
    return output["response"]


def generate_flower_recommendation_ko(situation, recommended_flowers):
    """추천된 꽃 목록을 바탕으로 Ollama를 이용해 자연스러운 추천 문장 생성"""
    if not recommended_flowers:
        return "죄송합니다. 적절한 꽃을 찾을 수 없습니다."
    
    flowers_info = ", ".join([f"{f}({m})" for f, m in recommended_flowers])
    #print(flowers_info)
    prompt_text = f"""
        You are a flower expert. Recommend a flower that suits the user's situation and logically explain its meaning and the reason for your recommendation.
        The user has requested a flower recommendation for the following situation:

        Situation: {situation}

        Recommended flowers and their meanings: {flowers_info}

        Please provide a kind yet logical response following the format below.
        And you must use Korean language.

        ## Output Format (Explain logically why you recommended these flowers)
        - Reason for Recommendation: [Logically explain how the flower meaning connects to the user's situation]
    """
    
    # 응답 생성
    output = client.generate(model="gemma3:4b", prompt=prompt_text)
    return output["response"]



def generate_flower_recommendation_en_to_ko(situation, recommended_flowers):
    """한국어 문장을 더 자연스럽고 논리적인 문장 생성"""
    if not recommended_flowers:
        return "죄송합니다. 적절한 꽃을 찾을 수 없습니다."

    flowers_info = ", ".join([f"{f}({m})" for f, m in recommended_flowers])
    print(flowers_info)
    prompt_text = f"""
        You are a flower expert. Recommend a flower that suits the user's situation and logically explain its meaning and the reason for your recommendation.
        The user has requested a flower recommendation for the following situation:

        Situation: {situation}

        Recommended flowers and their meanings: {flowers_info}

        Please provide a kind yet logical response following the format below.

        ## Output Format (Explain logically why you recommended these flowers)
        - Reason for Recommendation: [Logically explain how the flower meaning connects to the user's situation]
    """
    
    # 응답 생성
    output = client.generate(model="gemma:latest", prompt=prompt_text)
    return output["response"]



def get_flower_translation(recommended_flowers_ko):
    # 한국어 꽃 데이터 로드
    with open("flowers_ko.txt", "r", encoding="utf-8") as f:
        flowers_ko = ast.literal_eval(f.read())  # JSON 대신 Python 튜플로 파싱
    
    # 영어 꽃 데이터 로드
    with open("flowers_en.txt", "r", encoding="utf-8") as f:
        flowers_en = ast.literal_eval(f.read())  # JSON 대신 Python 튜플로 파싱
    
    # 결과 저장
    translated_flowers = []

    for flower_ko, meaning_ko in recommended_flowers_ko:
        # 한국어 꽃 이름의 인덱스 찾기
        index = next((i for i, (name, _) in enumerate(flowers_ko) if name == flower_ko), None)
        if index is not None:
            # 영어 데이터에서 동일한 인덱스의 꽃 정보 가져오기
            flower_en, meaning_en = flowers_en[index]
            translated_flowers.append((flower_en, meaning_en))
    
    return translated_flowers


def format_recommended_flowers(recommended_flowers_ko):
    """주어진 recommended_flowers_ko 데이터를 원하는 형식으로 변환"""
    formatted_flowers = []
    for flower, reason in recommended_flowers_ko:
        formatted_flowers.append(f"추천하는 꽃: {flower}\n추천하는 이유: {reason}\n")
    return "\n".join(formatted_flowers)





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

    return Response(
        json.dumps({
            "recommendation": result,
            "flowers": flowers
        }, ensure_ascii=False),
        content_type='application/json'
    ), 200

    # try:
    #     dataDict={
    #         # "id": ,
    #         # "date": ,
    #         "situation": situation,
    #         "recommendation": result,
    #         "flowers": flowers
    #     }
    #     jsonDataDict = json.dumps(dataDict, ensure_ascii=False).encode('utf-8')
    #     rd.set("dict", jsonDataDict)
        
    # except Exception as e:
    #     print(f"Failed to send data to DB container: {e}")


    # return Response(
    #     json.dumps({
    #         "recommendation": result,
    #         "flowers": flowers
    #     }, ensure_ascii=False),
    #     content_type='application/json'
    # ), 200




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8111)
