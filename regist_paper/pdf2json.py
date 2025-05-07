import fitz  # PyMuPDF
import re
import json

def extract_business_info_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    # 정규표현식을 통해 정보 추출
    corp_name = re.search(r"법인명\(단체명\)\s*:\s*(.+)", text)
    reg_num = re.search(r"등록번호\s*:\s*([\d\-]+)", text)
    ceo = re.search(r"대\s*표\s*자\s*:\s*(.+)", text)
    address = re.search(r"사업장\s*소재지\s*:\s*(.+)", text)
    start_date = re.search(r"개\s*업\s*연\s*월\s*일\s*:\s*(\d{4}\s*년\s*\d{2}\s*월\s*\d{2}\s*일)", text)

    result = {
        "법인명": corp_name.group(1).strip() if corp_name else None,
        "사업자등록번호": reg_num.group(1).replace("-", "").strip() if reg_num else None,
        "대표자": ceo.group(1).strip() if ceo else None,
        "사업장소재지": address.group(1).strip() if address else None,
        "개업연월일": start_date.group(1).strip() if start_date else None
    }

    return result

# 실행
pdf_path = "산학협력단_사업자등록증.pdf"
info = extract_business_info_from_pdf(pdf_path)

# JSON 저장
with open("사업자정보.json", "w", encoding="utf-8") as f:
    json.dump(info, f, ensure_ascii=False, indent=4)

print(info)