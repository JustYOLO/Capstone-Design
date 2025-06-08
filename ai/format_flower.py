def format_flower_data(input_file, output_file):
    """꽃 데이터를 한 줄씩 보여주는 텍스트 파일로 변환합니다."""
    try:
        with open(input_file, 'r', encoding='utf-8') as infile, \
             open(output_file, 'w', encoding='utf-8') as outfile:
            
            content = infile.read()
            # 튜플 리스트 형태로 되어있는 문자열을 파싱합니다.
            flower_list = eval(content)  # ast.literal_eval을 사용하는 것이 더 안전합니다.

            for flower, meaning in flower_list:
                outfile.write(f"{flower}: {meaning}\n")
        
        print(f"성공적으로 {output_file} 파일에 저장했습니다.")

    except FileNotFoundError:
        print(f"오류: {input_file} 파일을 찾을 수 없습니다.")
    except Exception as e:
        print(f"오류: 파일 처리 중 오류가 발생했습니다: {e}")

# 사용 예시
input_file = "/home/wlk/capstone/Capstone-Design/ai/flower_directory/flowers_ko.txt"
output_file = "/home/wlk/capstone/Capstone-Design/ai/flower_directory/flowers_ko_formatted.txt"
format_flower_data(input_file, output_file)
