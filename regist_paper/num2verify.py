import requests
import json

# JSON 파일에서 사업자등록번호 읽기
with open("사업자정보.json", "r", encoding="utf-8") as f:
    business_info = json.load(f)
    b_no = business_info.get("사업자등록번호")  # "사업자등록번호" 키를 사용

# 발급받은 serviceKey 입력
service_key = "1Lg%2FSxEhGQ335UV3npo8pdNJqTdu6rbBSXMmfSPL2LilPhfDHRzQQvzGCfrFwxweu8aSmnPqNWhT%2BPye7EHVOQ%3D%3D"

# 요청 URL
url = f"https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey={service_key}"

# 요청 데이터
data = {
    "b_no": [b_no]
}

# 요청 전송
response = requests.post(
    url,
    headers={"Content-Type": "application/json"},
    data=json.dumps(data)
)

# 응답 출력
if response.status_code == 200:
    result = response.json()
    print(json.dumps(result, indent=2, ensure_ascii=False))
else:
    print("API 요청 실패:", response.status_code)
    print(response.text)