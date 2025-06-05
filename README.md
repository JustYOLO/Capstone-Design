# Capstone-Design Project
Dankook University software major Capstone Design with 김민성, 이용민, 위다연

ms 디렉토리에서는 ai,
dy 디렉토리에서는 frontend,
nginx와 webserver 디렉토리는 backend를 다루고 있습니다.



아래 설명을 따라 설치하고 실행할 수 있습니다.


# AI run
올라마 설치
```
curl -fsSL https://ollama.com/install.sh | sh
```



## 모든 인터페이스에서 리스닝하도록 실행

```
OLLAMA_HOST=0.0.0.0 ollama serve
```
</br>

## 연결 확인
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


## Docker compose build
```
docker-compose down --remove-orphans
docker-compose up --build
```




# Backend Run

### Run using docker


Django의 docker image는 docker hub에서 가져오실 수 있습니다. (.env 파일이 필요합니다.)
아래의 명령어를 사용하세요:

```bash

docker network create your_network_name

sudo docker run --name django_container --env-file .env --network your_network_name justyolo912/django-docker
```

Django container로 직접 접근하시려면 port forwading을 사용하셔야 합니다. (e.g., -p8011:8000)

.env 파일의 예시

```bash
SECRET_KEY=1111
DEBUG=1
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
```

### MySQL container (UserDB)

MySQL conatiner는 Django와 연결되어 사용자 정보를 저장합니다. 아래의 명령어를 사용하세요:

```bash
sudo docker run --name user_db --network your_network_name -v /path/to/db:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=yourpw -d mysql:latest
```


### Nginx container

저희는 Nginx를 HTTPS endpoint로 사용합니다. 코드 그대로 사용하시려면 SSL 인증서가 필요합니다.
아래의 명령어로 container를 build 및 실행하실 수 있습니다.

```bash
docker build -f Dockerfile.nginx -t my_nginx .

docker run -d --name nginx_container --network your_network_name -p 80:80 -p 443:443 my_nginx
```


# Frontend
아래 설명을 따라 설치하고 실행할 수 있습니다.
해당 프로젝트는 **React + TailwindCSS**를 사용하여 개발되었습니다.

---
## 1. 프로젝트 다운로드
```sh
git clone https://github.com/day-e0n/capstone.git
cd capstone
```


## 2. Node.js 및 npm 설치
```sh
node -v
npm -v
```

이 명령어를 실행 했을 때 버전이 출력되면 이미 설치된 것이므로 다음 단계로 이동

node version: v18.20.6 <br/>
npm version: v10.8.2

(만약 버전 문제가 있다면 맨 아래 오류 해결 방법을 참고)


## 3. 의존성 패키지 설치
```sh
npm install
or
yarn install
```

## 4. 프로젝트 실행
```sh
npm start
or
yarn start
```
---

## 서버에서 실행하는 경우
package.json 파일 내의 scripts 부분을 수정해야 함
```
"scripts": {
    <u> "start": "HOST=0.0.0.0 react-scripts start", </u>
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```
```
http://서버IP:3000
```
위와 같이 서버에 접속

---

## 에러 해결 방법
### 1. npm ERR! Error: EACCES: permission denied
```
sudo chown -R $USER:$USER .
npm install
```

### 2. SyntaxError: Unexpected token '.'
이 에러는 보통 Node.js 버전이 너무 낮거나, tailwind.config.js 파일에 문제가 있을 때 발생

기존 npm 지워줘야 함
```
sudo apt remove -y nodejs npm
sudo apt autoremove -y

node -v
```

호환되는 v18로 다시 다운
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v
```
