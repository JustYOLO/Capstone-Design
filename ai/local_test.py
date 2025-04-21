import httpx
import chromadb
import ollama
import ast


client_en = chromadb.PersistentClient(path="./chromadb_storage_en")
collection_en = client_en.get_or_create_collection(name="flowers_en")

client_ko = chromadb.PersistentClient(path="./chromadb_storage_ko")
collection_ko = client_ko.get_or_create_collection(name="flowers_ko")

# 상황에 맞는 꽃 추천 함수
def search_flower_en(situation):
    # 사용자가 입력한 상황을 벡터 임베딩
    query_embedding = ollama.embeddings(model="llama3:latest", prompt=situation)["embedding"]
    
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
    query_embedding = ollama.embeddings(model="llama3-ko:latest", prompt=situation)["embedding"]
    
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
    output = ollama.generate(model="llama3:latest", prompt=prompt_text)
    return output["response"]


def generate_flower_recommendation_ko(situation, recommended_flowers):
    """추천된 꽃 목록을 바탕으로 Ollama를 이용해 자연스러운 추천 문장 생성"""
    if not recommended_flowers:
        return "죄송합니다. 적절한 꽃을 찾을 수 없습니다."

    flowers_info = ", ".join([f"{f}({m})" for f, m in recommended_flowers])
    #print(flowers_info)
    # prompt_text = f"""
    #     You are a flower expert. Recommend a flower that suits the user's situation and logically explain its meaning and the reason for your recommendation.
    #     The user has requested a flower recommendation for the following situation:

    #     Situation: {situation}

    #     Recommended flowers and their meanings: {flowers_info}

    #     Please provide a kind yet logical response following the format below.
    #     And you must use Korean language.

    #     ## Output Format (Explain logically why you recommended these flowers)
    #     - Reason for Recommendation: [Logically explain how the flower meaning connects to the user's situation]
    # """
    prompt_text = f"""
        You are a flower expert. The user has requested a flower recommendation for the following situation:
        Situation: {situation}

        Here are the recommended flowers and their meanings:
        {flowers_info}

        Please write a kind, heartfelt, and logically clear recommendation that explains how the meanings of these flowers relate to the user's situation.

        ## Output Format
        
        - 종합 추천 이유:
        [Explain logically and kindly how the combined meanings of the recommended flowers connect specifically to the user's situation]

        Important Instructions:
        - Provide ONLY the '종합 추천 이유' section.
        - Do NOT include any other sections or titles.
        - Respond strictly in Korean.
    """
    
    # 응답 생성
    output = ollama.generate(model="gemma3:4b", prompt=prompt_text)
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
    output = ollama.generate(model="gemma:latest", prompt=prompt_text)
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


# def translate_ko_to_en(text):
#     response = httpx.post("http://translate:5000/translate", json={"text": text, "target_language": "en"})
#     return response.json()["translated_text"]

# def translate_en_to_ko(text):
#     response = httpx.post("http://translate:5000/translate", json={"text": text, "target_language": "ko"})
#     return response.json()["translated_text"]



# 테스트: 특정 상황에 어울리는 꽃 추천
if __name__ == "__main__":
    # 한국어 입력 받기
    query_text_ko = input("현재 어떤 상태에서 꽃을 선물해주고 싶나요? : ")
    print("")

    # 한국어 입력에 대해 꽃 검색
    recommended_flowers_ko = search_flower_ko(query_text_ko)

    formatted_result = format_recommended_flowers(recommended_flowers_ko)
    print(formatted_result)
    
    print("")
    
    print(generate_flower_recommendation_ko(query_text_ko, recommended_flowers_ko))





    #recommended_flowers_ko_to_en = get_flower_translation(recommended_flowers_ko)

    # 입력을 영어로 번역 
    #query_text_en = translate_ko_to_en(query_text_ko)

    # 꽃 추천 -> 이거는 위에서 만든 recommended_flowers_ko_to_en 사용용
    #recommended_flowers_en = search_flower_en(query_text_en)
    
    # 응답 생성
    #response_text_en = generate_flower_recommendation(query_text_en, recommended_flowers_ko_to_en)

    #print(response_text_en)
    
    
    #이제 이 영어로 나온 답변을 한국어로 자연스럽게 만들어주는 llama 사용

    # print("")
    # print("")

    # # 응답을 한국어로 번역
    # response_text_ko = translate_en_to_ko(response_text_en)

    # # 최종 결과 출력
    # print(response_text_ko)
    
    # 응답을 더 자연스러운 한국어로 출력
    # re_response_text_ko = generate_flower_recommendation_en_to_ko(response_text_ko, recommended_flowers_ko)

    # 최종 결과 출력
    # print(re_response_text_ko)

# 꽃은 한국어 prompt에서 임베딩 비슷한 걸로 가져오고 
# 그 꽃들에 대해서 Text DB에서 같은 Index를 가지는 꽃들을 가져와서서
# 영어로 추천 이유를 논리적으로 설명 후
# 최종적으로 다시 llama 사용해 한국어로 자연스럽게 포현

# 다음에 할 때: Gemma:latest로 한번에 한국어로 출력되게 해보자

