# Capstone Project

dy 디렉토리에서는 frontend,
ms 디렉토리에서는 ai 를 다루고 있습니다.



아래 설명을 따라 설치하고 실행할 수 있습니다.


# Ollama part
올라마 설치
```
curl -fsSL https://ollama.com/install.sh | sh
```





## 모든 인터페이스에서 리스닝하도록 실행

```
OLLAMA_HOST=0.0.0.0 ollama serve
```
</br>

# 연결 확인
```
curl http://localhost:11434/api/tags
```

ollama model 설치

```
ollama run gemma3
ollama run llama3
```
</br>

한글 임베딩 가능한 llama 설치
https://huggingface.co/teddylee777/Llama-3-Open-Ko-8B-gguf/tree/main    
위 사이트에서 Llama-3-Open-Ko-8B-Q5_K_M.gguf 파일을 다운 받은 후(wget)    
파일의 같은 경로의 Modelfile을 생성하고 아래 내용을 입력한다.


```
FROM Llama-3-Open-Ko-8B-Q5_K_M.gguf

TEMPLATE """{{- if .System }}
<s>{{ .System }}</s>
{{- end }}
<s>Human:
{{ .Prompt }}</s>
<s>Assistant:
"""

SYSTEM """A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions. 모든 대답은 한국어(Korean)으로 대답해줘."""

PARAMETER temperature 0
PARAMETER num_predict 3000
PARAMETER num_ctx 4096
PARAMETER stop <s>
PARAMETER stop </s>

```

그 후 아래 명령어를 입력하면 


# Docker compose build
```
docker-compose down --remove-orphans
docker-compose up --build
```

