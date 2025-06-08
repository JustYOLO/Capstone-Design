import httpx
import chromadb
import ollama
import ast
import re


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



def extract_keywords(situation: str) -> list:
    prompt = f"""
    다음 문장에서 핵심 의미를 담은 단어(예: 감정, 목적, 관계 등)를 3개 추출해줘. 꼭 문장 내 단어가 존재하지 않아도 괜찮다. 
    너가 상황을 유추하여 꽃 추천에 중심이 되는 단어만 뽑아줘. 이때 '선물' 같은 일반 단어는 제외해.

    문장: "{situation}"

    ## 출력 예시
    - 키워드: ["존경", "교수님", "감사"]
    - 키워드: ["감사", "어버이", "부모님"]
    - 키워드: ["사랑", "기념일", "연인"]

    반드시 Python 리스트 형식으로 출력해.
    """
    output = ollama.generate(model="gemma3:4b", prompt=prompt)["response"]
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
    query_text = ", ".join(keywords) if keywords else situation
    print(f"[검색 기준 키워드]: {query_text}")

    query_embedding = ollama.embeddings(model="llama3-ko:latest", prompt=query_text)["embedding"]
    
    results = collection_ko.query(query_embeddings=[query_embedding], n_results=10)
    candidates = results["documents"][0]
    
    print(candidates)
    
    # 최종 추천 3개를 LLM으로 재정렬
    prompt = f"""
    상황: "{situation}"
    
    당신은 꽃 전문가입니다. 사용자가 요청한 상황에 가장 잘 어울리는 꽃을 감정적으로 잘 추천해주세요.
    아래는 추천 후보 꽃과 그 꽃말입니다.
    상황에 가장 잘 어울리는 꽃 3개를 선택해주세요.

    {chr(10).join(candidates)}

    ## 출력 형식: (이유는 추천하지 않습니다)
    - 꽃: 꽃말
    
    ## 예시 출력:
    - 붉은 동백꽃: 나는 당신이 누구보다도 아름답다고 생각합니다.
    - 흰 장미: 당신의 순수함과 진실함을 존경합니다.
    - 노란 해바라기: 당신의 밝은 에너지가 주변을 환하게 만듭니다.
    """

    response = ollama.generate(model="gemma3:4b", prompt=prompt)["response"]

    final_result = []
    for line in response.strip().split("\n"):
        if ":" in line:
            name, reason = line.split(":", 1)
            final_result.append((name.strip(), reason.strip()))
    return final_result


# def search_flower_ko(situation):
#     query_embedding = ollama.embeddings(model="llama-ko-bllossom-8B:latest", prompt=situation)["embedding"]
    
#     # 상위 10개 검색 후 의미 필터링
#     results = collection_ko.query(
#         query_embeddings=[query_embedding],
#         n_results=20
#     )

#     candidate_docs = results["documents"][0]
#     if not candidate_docs:
#         return []
    
#     print(candidate_docs)

#     # LLM 재정렬
#     flowers_info = "\n".join(candidate_docs)
#     rerank_prompt = f"""
#     상황: "{situation}"
    
#     당신은 꽃 전문가입니다. 사용자가 요청한 상황에 가장 잘 어울리는 꽃을 감정적으로 잘 추천해주세요.
#     아래는 꽃과 그 꽃말입니다.
#     상황에 가장 잘 어울리는 꽃 3개를 선택해주세요.

#     {flowers_info}

#     ## 출력 형식: (이유는 추천하지 않습니다)
#     - 꽃: 꽃말
    
#     ## 예시 출력:
#     - 붉은 동백꽃: 나는 당신이 누구보다도 아름답다고 생각합니다.
#     - 흰 장미: 당신의 순수함과 진실함을 존경합니다.
#     - 노란 해바라기: 당신의 밝은 에너지가 주변을 환하게 만듭니다.
#     """
#     output = ollama.generate(model="gemma3:4b", prompt=rerank_prompt)["response"]

#     # print(output)
#     # 결과 파싱
#     recommended_flowers = []
#     for line in output.strip().split("\n"):
#         if line.startswith("- "):  # 리스트 형식의 라인
#             try:
#                 flower, flower_mean = line[2:].strip().split(":", 1)
#                 recommended_flowers.append((flower.strip(), flower_mean.strip()))
#             except:
#                 continue
#     return recommended_flowers




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