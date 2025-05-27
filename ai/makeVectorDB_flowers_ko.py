import ollama
import chromadb
import ast
import json  # json 모듈 추가

# ChromaDB 클라이언트 생성 (데이터 저장 폴더 설정)
client = chromadb.PersistentClient(path="./chromadb_storage_ko")
collection = client.get_or_create_collection(name="flowers_ko")

file_path = "/home/wlk/capstone/Capstone-Design/ai/flower_directory/flowers_ko.txt"
json_file_path = "/home/wlk/capstone/Capstone-Design/frontend/public/flowers.json"  # json 파일 경로

def load_flower_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = f.read()
    return ast.literal_eval(data)

def save_flower_data(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(data))

def add_or_update_flower(flower, meaning):
    doc_flowers = load_flower_data(file_path)
    
    # Check if the flower already exists
    for i, (existing_flower, _) in enumerate(doc_flowers):
        if existing_flower == flower:
            # Update the meaning if the flower exists
            doc_flowers[i] = (flower, meaning)
            print(f"✅ Updated meaning for {flower}")
            break
    else:
        # Add the new flower if it doesn't exist
        doc_flowers.append((flower, meaning))
        print(f"✅ Added new flower: {flower}")
    
    # Sort the flowers by Korean alphabetical order
    doc_flowers.sort(key=lambda x: x[0])
    
    save_flower_data(file_path, doc_flowers)

def delete_flower(flower):
    doc_flowers = load_flower_data(file_path)
    
    # Find the index of the flower to delete
    for i, (existing_flower, _) in enumerate(doc_flowers):
        if existing_flower == flower:
            del doc_flowers[i]
            print(f"✅ Deleted flower: {flower}")
            break
    else:
        print(f"❌ Flower not found: {flower}")
    
    save_flower_data(file_path, doc_flowers)

def save_to_chromadb(documents_ko):
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

def read_flower(flower):
    doc_flowers = load_flower_data(file_path)
    
    # Find the meaning of the flower
    for existing_flower, meaning in doc_flowers:
        if existing_flower == flower:
            print(f"🌸 {flower}: {meaning}")
            return
    
    print(f"❌ Flower not found: {flower}")

def save_to_json(file_path, json_file_path):
    doc_flowers = load_flower_data(file_path)
    
    # flowers.json 형태에 맞춰 데이터 변환
    flower_list = [{"name": flower, "meaning": meaning} for flower, meaning in doc_flowers]
    
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(flower_list, f, indent=4, ensure_ascii=False)  # ensure_ascii=False 추가
    print(f"✅ txt 내용을 {json_file_path}에 JSON 형태로 저장 완료!")

while True:
    print("\n기능을 선택하세요:")
    print("1. txt 내용을 vector DB로 저장")
    print("2. txt 파일에 꽃말 검색")
    print("3. txt 파일에 내용 추가/수정")
    print("4. txt 파일에 내용 삭제")
    print("5. 종료")

    choice = input("선택: ")

    if choice == '1':
        doc_flowers = load_flower_data(file_path)
        documents_ko = [f"{flower}: {meaning}" for flower, meaning in doc_flowers]
        save_to_chromadb(documents_ko)
    elif choice == '2':
        flower = input("검색할 꽃 이름: ")
        read_flower(flower)
    elif choice == '3':
        flower = input("꽃 이름: ")
        meaning = input("꽃말: ")
        add_or_update_flower(flower, meaning)
    elif choice == '4':
        flower = input("삭제할 꽃 이름: ")
        delete_flower(flower)
    elif choice == '5':
        save_to_json(file_path, json_file_path)  # 종료 전에 JSON 파일로 저장
        print("프로그램을 종료합니다.")
        break
    else:
        print("잘못된 선택입니다. 다시 선택하세요.")