import ollama
import chromadb
import ast  # 문자열을 파이썬 리스트로 변환하기 위해 import

# ChromaDB 클라이언트 생성 (데이터 저장 폴더 설정)
client = chromadb.PersistentClient(path="./chromadb_storage_ko")
collection = client.get_or_create_collection(name="flowers_ko")

# flowers_ko.txt 파일에서 꽃과 꽃말 데이터 불러오기
def load_flower_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = f.read()
    return ast.literal_eval(data)  # 문자열 형태의 리스트를 파이썬 리스트로 변환

doc_flowers = load_flower_data("/home/wlk/capstone/Capstone-Design/ai/flower_directory/flowers_ko.txt")

# 변환된 문서 리스트
documents_ko = [f"{flower}: {meaning}" for flower, meaning in doc_flowers]

# 기존 데이터가 있는지 확인 (중복 저장 방지)
if collection.count() == 0:
    print("ChromaDB에 꽃 데이터를 처음 저장합니다...")
    
    for i, d in enumerate(documents_ko):
        response = ollama.embeddings(model="llama3-ko:latest", prompt=d)  # 한국어 모델 사용
        embedding = response["embedding"]
        collection.add(
            ids=[str(i)],
            embeddings=[embedding],
            documents=[d]
        )

    print(f"✅ {len(documents_ko)}개 꽃 데이터를 ChromaDB에 저장 완료!")
else:
    print(f"✅ ChromaDB에 이미 {collection.count()}개의 데이터가 존재합니다. 추가 저장 안 함.")
