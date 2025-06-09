import re
import fitz  # PyMuPDF
import requests
import json
import sys

# -------- [1] PDF에서 사업자 정보 추출 --------
def extract_business_info_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "".join(page.get_text() for page in doc)

    corp_name = re.search(r"법인명\(단체명\)\s*:\s*(.+)", text)
    reg_num  = re.search(r"등록번호\s*:\s*([\d\-]+)", text)
    ceo      = re.search(r"대\s*표\s*자\s*:\s*(.+)", text)
    address  = re.search(r"사업장\s*소재지\s*:\s*(.+)", text)
    start    = re.search(r"개\s*업\s*연\s*월\s*일\s*:\s*(\d{4}\s*년\s*\d{2}\s*월\s*\d{2}\s*일)", text)

    # 종목 다중 추출
    lines = text.splitlines()
    categories = []
    for idx, line in enumerate(lines):
        if re.search(r"종\s*목", line):
            # 첫 번째 종목
            parts = re.split(r"종\s*목[:：]?", line)
            if len(parts) > 1 and parts[1].strip():
                categories.append(parts[1].strip())
            # 다음 줄들 수집 (콜론 있는 새 필드 나오기 전까지)
            for sub in lines[idx+1:]:
                sub = sub.strip()
                if not sub or re.search(r".+[:：]", sub):
                    break
                categories.append(sub)
            break

    return {
        "법인명":          corp_name.group(1).strip() if corp_name else None,
        "사업자등록번호":  reg_num.group(1).replace("-", "").strip() if reg_num else None,
        "대표자":          ceo.group(1).strip() if ceo else None,
        "사업장소재지":    address.group(1).strip() if address else None,
        "개업연월일":      start.group(1).strip() if start else None,
        "종목":            categories
    }

# -------- [2] API 검증 요청 함수 --------
def verify_business_number(b_no: str):
    service_key = ""  # 본인 서비스키 입력
    url = f"https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey={service_key}"
    data = {"b_no": [b_no]}
    resp = requests.post(url,
                         headers={"Content-Type": "application/json"},
                         data=json.dumps(data))
    if resp.status_code == 200:
        return resp.json()
    return {"error": f"API 요청 실패: {resp.status_code}", "detail": resp.text}

# -------- [3] 정상 영업 여부 판단 함수 --------
def is_business_active(api_response: dict, info: dict) -> bool:
    allowed = {
        "화초 및 식물 소매업",
        "종자 및 묘목 도매업",
        "화훼류 및 식물 도매업",
        "산학협력단"
    }
    try:
        data = api_response.get("data", [])
        if not data or "b_stt_cd" not in data[0]:
            return False
        status_ok = (data[0]["b_stt_cd"] == "01")

        categories = info.get("종목", [])
        category_ok = any(cat in allowed for cat in categories)

        return status_ok and category_ok
    except Exception:
        return False

# -------- [4] 메인 실행 함수 --------
def main(pdf_path):
    info = extract_business_info_from_pdf(pdf_path)
    print("추출된 사업자 정보:", json.dumps(info, ensure_ascii=False, indent=2))

    b_no = info.get("사업자등록번호")
    if not b_no:
        print("사업자등록번호를 찾을 수 없습니다.")
        return

    result = verify_business_number(b_no)
    if is_business_active(result, info):
        print("✅ 정상적으로 영업 중이며 허용된 종목입니다.")
    else:
        print("⚠️ 폐업(혹은 휴업) 상태이거나 허용되지 않은 종목입니다.")

# -------- [5] CLI 진입점 --------
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("사용법: python verify.py <PDF_파일_경로>")
    else:
        main(sys.argv[1])
