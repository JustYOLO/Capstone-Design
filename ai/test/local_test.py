import httpx
import chromadb
import ollama
import ast


client_ko = chromadb.PersistentClient(path="./chromadb_storage_ko")
collection_ko = client_ko.get_or_create_collection(name="flowers_ko")


# def search_flower_ko(situation):
#     # 사용자가 입력한 상황을 벡터 임베딩
#     query_embedding = ollama.embeddings(model="llama3-ko:latest", prompt=situation)["embedding"]
    
#     # 가장 유사한 꽃말을 가진 꽃 검색
#     results = collection_ko.query(
#         query_embeddings=[query_embedding],
#         n_results=3  # 검색할 결과 개수 (최대 3개 추천)
#     )
    

#     recommended_flowers = []
#     if results["documents"]:
#         for doc in results["documents"][0]:
#             if ": " in doc:
#                 flower, meaning = doc.split(": ", 1)
#                 recommended_flowers.append((flower.strip(), meaning.strip()))

#     if not recommended_flowers:
#         return "검색 결과가 없습니다."

#     return recommended_flowers


def search_flower_ko(situation):
    query_embedding = ollama.embeddings(model="llama3-ko:latest", prompt=situation)["embedding"]
    
    # 상위 10개 검색 후 의미 필터링
    results = collection_ko.query(
        query_embeddings=[query_embedding],
        n_results=20
    )

    candidate_docs = results["documents"][0]
    if not candidate_docs:
        return []

    # LLM 재정렬
    flowers_info = "\n".join(candidate_docs)
    rerank_prompt = f"""
    상황: "{situation}"
    
    당신은 꽃 전문가입니다. 사용자가 요청한 상황에 가장 잘 어울리는 꽃을 감정적으로 잘 추천해주세요.
    아래는 꽃과 그 꽃말입니다.
    상황에 가장 잘 어울리는 꽃 3개를 선택해주세요.

    {flowers_info}

    ## 출력 형식:
    - 꽃: 꽃말
    
    ## 예시 출력:
    - 붉은 동백꽃: 나는 당신이 누구보다도 아름답다고 생각합니다.
    - 흰 장미: 당신의 순수함과 진실함을 존경합니다.
    - 노란 해바라기: 당신의 밝은 에너지가 주변을 환하게 만듭니다.
    """
    output = ollama.generate(model="gemma3:4b", prompt=rerank_prompt)["response"]

    print(output)
    # 결과 파싱
    recommended_flowers = []
    for line in output.strip().split("\n"):
        if "꽃:" in line:
            try:
                flower, flower_mean = line.replace("꽃:", "").strip().split(":", 1)
                recommended_flowers.append((flower.strip(), flower_mean.strip()))
            except:
                continue
    return recommended_flowers



def generate_flower_recommendation(situation, recommended_flowers):
    """추천된 꽃 목록을 바탕으로 Ollama를 이용해 자연스러운 추천 문장 생성"""
    if not recommended_flowers:
        return "죄송합니다. 적절한 꽃을 찾을 수 없습니다."

    flowers_info = ", ".join([f"{f}({m})" for f, m in recommended_flowers])
    # print(flowers_info)
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
    output = ollama.generate(model="llama3:latest", prompt=prompt_text)
    return output["response"]


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
        [Explain logically and kindly how the combined meanings of the recommended flowers connect specifically to the user's situation.]

        Important Instructions:
        - Provide ONLY the '종합 추천 이유' section.
        - Do NOT include any other sections or titles.
        - Respond strictly in Korean.
        - And there must be a new line between flower descriptions.
    """
    
    # 응답 생성
    output = ollama.generate(model="gemma3:4b", prompt=prompt_text)
    return output["response"]



def format_recommended_flowers(recommended_flowers_ko):
    """주어진 recommended_flowers_ko 데이터를 원하는 형식으로 변환"""
    formatted_flowers = []
    print(recommended_flowers_ko)
    for flower, reason in recommended_flowers_ko:
        formatted_flowers.append(f"추천하는 꽃: {flower}\n추천하는 이유: {reason}\n")
    return "\n".join(formatted_flowers)



# 테스트: 특정 상황에 어울리는 꽃 추천
if __name__ == "__main__":
    # 한국어 입력 받기
    query_text_ko = input("현재 어떤 상태에서 꽃을 선물해주고 싶나요? : ")
    print("")

    recommended_flowers_ko = search_flower_ko(query_text_ko)

    formatted_result = format_recommended_flowers(recommended_flowers_ko)
    print(formatted_result)
    
    # print("")
    
    # print(generate_flower_recommendation_ko(query_text_ko, recommended_flowers_ko))