import sys
import json
import requests
import fitz  # PyMuPDF
import re

# -------- [1] PDF에서 사업자 정보 추출 --------
def extract_business_info_from_pdf(pdf_path):
    import fitz
    import re

    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()

    corp_name = re.search(r"법인명\(단체명\)\s*:\s*(.+)", text)
    reg_num = re.search(r"등록번호\s*:\s*([\d\-]+)", text)
    ceo = re.search(r"대\s*표\s*자\s*:\s*(.+)", text)
    address = re.search(r"사업장\s*소재지\s*:\s*(.+)", text)
    start_date = re.search(r"개\s*업\s*연\s*월\s*일\s*:\s*(\d{4}\s*년\s*\d{2}\s*월\s*\d{2}\s*일)", text)
    category = re.search(r"종\s*목\s*[:：]?\s*([^\n]+)", text)


    result = {
        "법인명": corp_name.group(1).strip() if corp_name else None,
        "사업자등록번호": reg_num.group(1).replace("-", "").strip() if reg_num else None,
        "대표자": ceo.group(1).strip() if ceo else None,
        "사업장소재지": address.group(1).strip() if address else None,
        "개업연월일": start_date.group(1).strip() if start_date else None,
        "종목": category.group(1).strip() if category else None
    }

    return result


# -------- [2] API 검증 요청 함수 --------
def verify_business_number(b_no: str):
    service_key = "1Lg%2FSxEhGQ335UV3npo8pdNJqTdu6rbBSXMmfSPL2LilPhfDHRzQQvzGCfrFwxweu8aSmnPqNWhT%2BPye7EHVOQ%3D%3D"
    url = f"https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey={service_key}"
    data = {"b_no": [b_no]}

    response = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        data=json.dumps(data)
    )

    if response.status_code == 200:
        return response.json()
    else:
        return {
            "error": f"API 요청 실패: {response.status_code}",
            "detail": response.text
        }

# -------- [3] 정상 영업 여부 판단 함수 --------
def is_business_active(api_response: dict, extracted_info: dict) -> bool:
    """
    사업자 상태 코드가 '01'이고 종목이 허용된 항목에 포함되어 있으면 True.
    """
    allowed_categories = {
        "화초 및 식물 소매업",
        "종자 및 묘목 도매업",
        "화훼류 및 식물 도매업",
        "산학협력단"
    }

    try:
        data = api_response.get("data", [])
        if not data or "b_stt_cd" not in data[0]:
            return False
        status_ok = data[0]["b_stt_cd"] == "01"
        

        category = extracted_info.get("종목", "").strip()
        
        category_ok = category in allowed_categories
        

        return status_ok and category_ok
    except (KeyError, IndexError, TypeError):
        return False


# -------- [4] 메인 실행 함수 --------
def main(pdf_path):
    info = extract_business_info_from_pdf(pdf_path)
    print("📄 추출된 사업자 정보:")
    host_json = json.dumps(info, ensure_ascii=False, indent=2)
    print(host_json)
    # print(json.dumps(info, ensure_ascii=False, indent=2))

    b_no = info.get("사업자등록번호")
    if not b_no:
        print("사업자등록번호를 찾을 수 없습니다.")
        return

    result = verify_business_number(b_no)
    # print("\n🔍 검증 결과:")
    # print(json.dumps(result, ensure_ascii=False, indent=2))

    if is_business_active(result, info):
        print("\n✅ 정상적으로 영업 중이며 허용된 종목입니다.")
    else:
        print("\n⚠️ 폐업(혹은 휴업) 상태이거나 허용되지 않은 종목입니다.")


# -------- [5] CLI 진입점 --------
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("사용법: python verify.py <PDF_파일_경로>")
    else:
        main(sys.argv[1])
