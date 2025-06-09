# 🌷BlossomPick🌷
 
Dankook University Software Major Capstone Design with 김민성, 이용민, 위다연

## 👪팀원 소개
### AI
🤗 김민성
- 상황에 알맞는 꽃을 추천해주는 챗봇 시스템
- Locall LLM(Ollama)와 VectorDB(chormaDB)를 연동한 RAG 시스템


### Backend
🤭 이용민


### Frontend
🤭 위다연
- Tailwind CSS 기반 UI 컴포넌트 설계 및 반응형 레이아웃 구현
- 컴포넌트 구조 최적화를 통한 웹 성능 최적화
- 웹 접근성과 사용자 경험을 고려한 UX/UI 디자인 개선
- React Router를 활용한 페이지 전환 구조 구성 및 사용자 흐름 설계
- 백엔드와 유저 사이에서 효율적인 서버 데이터의 전달 도움


## 📌프로젝트 배경
사람들이 기념일이나 사랑하는 사람을 위해 선물을 줄 때 꽃을 선물해 주는 경우가 많다.   
이때 꽃의 꽃말을 바탕으로 더 의미 있는 꽃 선물을 줄 수 있다면 어떨지 생각해 봤다.   
하지만 꽃과 해당 꽃말을 검색하기 위해 인터넷을 뒤적이면서 선물해 줄 상황에 알맞은 꽃을 선물해 주기는 매우 번거롭다.   
이를 기반으로 본 프로젝트에서는 특정 상황에 알맞은 꽃을 추천해주는 챗봇 시스템을 구현한다.     
또한 이에 그치지 않고 꽃집 운영자와 일반 회원이 서로 꽃을 쉽게 등록하고 주문하고 팔 수 있는 홈페이지를 구축하여 판매까지 유도한다.   


## 🧑‍💻구현 기능 
1) 사용자의 현재 상황을 input으로 받고 해당 상황을 인지 후 알맞은 꽃과 꽃말 output을 출력해주는 챗봇
  - Local LLM(Ollama)와 VectorDB(chormaDB)를 연동한 RAG 시스템
  - Local LLM에게 적절한 Prompt를 주어, input으로 들어온 상황에 알맞는 꽃과 꽃말을 출력하고 해당 이유를 input과 연관지어 간단하게 서술함
2) 꽃말 사전
  - CRUD 기능을 통해 사전에 꽃과 꽃말을 추가/삭제 가능
  - 검색 기능을 통해 원하는 꽃과 꽃말을 빠르게 얻을 수 있음
3) 꽃집을 직접 등록하고 온라인에서 꽃집의 꽃을 보고 주문할 수 있는 기능
  - 회원가입 시, 꽃집 운영진과 일반 사용자로 나누어 가입
  - 꽃집 운영진으로 가입 시, 사업자등록증을 업로드하여 꽃집을 등록하여 꽃을 판매할 수 있음
  - 꽃집에 업로드된 꽃들에 해당하는 꽃말을 같이 띄워주어 사용자가 본인의 상황에 맞는 꽃을 구매하는 데 도움이 됨
4) 꽃집들을 표시하는 지도
  - 꽃집 운영진들이 웹 사이트에 가입한 후 등록한 꽃집들을 지도에 표시함
  - 사용자의 현재 위치와 가까운 곳에 위치하는 꽃집을 한 눈에 볼 수 있음
5) 꽃BTI (꽃 MBTI: 약 10~12개의 질문으로 E/I, N/S, T/F, P/J를 파악한 후 그에 알맞은 꽃을 알려줌)
  - 처음 우리의 BlossomPick 웹사이트에 진입하는 데 진입 장벽을 낮춰줌
  - SNS(ex.인스타그램,유튜브)에서 알고리즘을 타서 꽃BTI 테스트가 꽤 유행하게 된다면, 우리 웹사이트를 홍보하는 데 도움이 됨


## 📁아키텍처 
![image](https://github.com/user-attachments/assets/c5d6e985-a303-41b2-b4ec-b95afff15a52)



## 📄사용 기술 스택 

### AI

|category|version|
|------|---|
|React|19.0.0|
|Tailwind CSS|3.4.17|
|Axios|1.8.4|

### Backend

|category|version|
|------|---|
|React|19.0.0|
|Tailwind CSS|3.4.17|
|Axios|1.8.4|

### Frontend
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=black">


|category|version|
|------|---|
|React|19.0.0|
|Tailwind CSS|3.4.17|
|Axios|1.8.4|


## Directory 구조 

📦Capstone-Design
 ┣ 📂ai 
 ┃ ┣ 📂chromadb_storage_ko
 ┃ ┃ ┣ 📂8be9cc09-4636-4b3d-bff8-a44226777b2f
 ┃ ┃ ┃ ┣ 📜data_level0.bin
 ┃ ┃ ┃ ┣ 📜header.bin
 ┃ ┃ ┃ ┣ 📜length.bin
 ┃ ┃ ┃ ┗ 📜link_lists.bin
 ┃ ┃ ┗ 📜chroma.sqlite3
 ┃ ┣ 📂flower_directory
 ┃ ┃ ┣ 📜flowers_en.txt
 ┃ ┃ ┣ 📜flowers_ko.txt
 ┃ ┃ ┗ 📜flowers_ko_formatted.txt
 ┃ ┣ 📜Dockerfile
 ┃ ┣ 📜README.md
 ┃ ┣ 📜docker-compose.yml
 ┃ ┣ 📜format_flower.py
 ┃ ┣ 📜main.py
 ┃ ┗ 📜makeVectorDB_flowers_ko.py
 ┣ 📂frontend
 ┃ ┣ 📂ad_image
 ┃ ┃ ┣ 📜IMG_4330.JPG
 ┃ ┃ ┣ 📜IMG_4331.JPG
 ┃ ┃ ┣ 📜IMG_4332.JPG
 ┃ ┃ ┣ 📜IMG_4333.JPG
 ┃ ┃ ┗ 📜IMG_4334.JPG
 ┃ ┃ ┗ 📂css
 ┃ ┃ ┃ ┗ 📜tailwindcss.css
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂chatbot
 ┃ ┃ ┃ ┃ ┣ 📜ChatButton.jsx
 ┃ ┃ ┃ ┃ ┣ 📜ChatInput.jsx
 ┃ ┃ ┃ ┃ ┣ 📜ChatResponse.jsx
 ┃ ┃ ┃ ┃ ┣ 📜ChatWidget.jsx
 ┃ ┃ ┃ ┃ ┗ 📜UseChat.js
 ┃ ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┃ ┣ 📜Footer.js
 ┃ ┃ ┃ ┃ ┣ 📜HeroSection.js
 ┃ ┃ ┃ ┃ ┗ 📜Navbar.js
 ┃ ┃ ┃ ┣ 📂effects
 ┃ ┃ ┃ ┣ 📂map
 ┃ ┃ ┃ ┃ ┣ 📜FlowerShopMarker.js
 ┃ ┃ ┃ ┃ ┣ 📜Map.js
 ┃ ┃ ┃ ┃ ┣ 📜NaverMapLoader.js
 ┃ ┃ ┃ ┃ ┗ 📜UserLocationMap.js
 ┃ ┃ ┃ ┗ 📜AddressInput.js
 ┃ ┃ ┣ 📂pages
 ┃ ┃ ┃ ┣ 📜AdCarousel.js
 ┃ ┃ ┃ ┣ 📜Admin.js
 ┃ ┃ ┃ ┣ 📜AfterLoginFlorist.js
 ┃ ┃ ┃ ┣ 📜AfterSignup.js
 ┃ ┃ ┃ ┣ 📜FlowerDictionary.js
 ┃ ┃ ┃ ┣ 📜FlowerHouse.js
 ┃ ┃ ┃ ┣ 📜FlowerHouseAddFlower.js
 ┃ ┃ ┃ ┣ 📜FlowerHouseView.js
 ┃ ┃ ┃ ┣ 📜FlowerMBTI.js
 ┃ ┃ ┃ ┣ 📜Login.js
 ┃ ┃ ┃ ┣ 📜Order.js
 ┃ ┃ ┃ ┣ 📜OrderHistoryPage.js
 ┃ ┃ ┃ ┣ 📜OrderPage.js
 ┃ ┃ ┃ ┣ 📜Profile.js
 ┃ ┃ ┃ ┣ 📜ResetPassword.js
 ┃ ┃ ┃ ┣ 📜Search_Where.js
 ┃ ┃ ┃ ┣ 📜Signup.js
 ┃ ┃ ┃ ┣ 📜SignupCustomer.js
 ┃ ┃ ┃ ┗ 📜SignupFlorist.js
 ┃ ┃ ┣ 📜App.css
 ┃ ┃ ┣ 📜App.js
 ┃ ┃ ┣ 📜App.test.js
 ┃ ┃ ┣ 📜index.css
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜logo.svg
 ┃ ┃ ┣ 📜reportWebVitals.js
 ┃ ┃ ┗ 📜setupTests.js
 ┃ ┣ 📜package-lock.json
 ┃ ┣ 📜package.json
 ┃ ┣ 📜postcss.config.js
 ┃ ┗ 📜tailwind.config.js
 ┣ 📂nginx
 ┃ ┣ 📜Dockerfile.nginx
 ┃ ┗ 📜default.conf
 ┣ 📂regist_paper
 ┃ ┣ 📂__pycache__
 ┃ ┃ ┣ 📜num2verify.cpython-310.pyc
 ┃ ┃ ┗ 📜pdf2json.cpython-310.pyc
 ┃ ┣ 📜verify.py
 ┃ ┣ 📜사업자정보.json
 ┃ ┗ 📜산학협력단_사업자등록증.pdf
 ┣ 📂webserver
 ┃ ┣ 📂accounts
 ┃ ┃ ┣ 📂migrations
 ┃ ┃ ┃ ┣ 📜0001_initial.py
 ┃ ┃ ┃ ┗ 📜__init__.py
 ┃ ┃ ┣ 📜__init__.py
 ┃ ┃ ┣ 📜admin.py
 ┃ ┃ ┣ 📜apps.py
 ┃ ┃ ┣ 📜models.py
 ┃ ┃ ┣ 📜serializers.py
 ┃ ┃ ┣ 📜tests.py
 ┃ ┃ ┣ 📜verify.py
 ┃ ┃ ┗ 📜views.py
 ┃ ┣ 📂frontend
 ┃ ┃ ┣ 📂__pycache__
 ┃ ┃ ┃ ┣ 📜__init__.cpython-310.pyc
 ┃ ┃ ┃ ┣ 📜admin.cpython-310.pyc
 ┃ ┃ ┃ ┣ 📜apps.cpython-310.pyc
 ┃ ┃ ┃ ┣ 📜models.cpython-310.pyc
 ┃ ┃ ┃ ┗ 📜urls.cpython-310.pyc
 ┃ ┃ ┣ 📂migrations
 ┃ ┃ ┃ ┣ 📂__pycache__
 ┃ ┃ ┃ ┃ ┗ 📜__init__.cpython-310.pyc
 ┃ ┃ ┃ ┗ 📜__init__.py
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┗ 📜index.html
 ┃ ┃ ┣ 📜__init__.py
 ┃ ┃ ┣ 📜admin.py
 ┃ ┃ ┣ 📜apps.py
 ┃ ┃ ┣ 📜models.py
 ┃ ┃ ┣ 📜tests.py
 ┃ ┃ ┣ 📜urls.py
 ┃ ┃ ┗ 📜views.py
 ┃ ┣ 📂templates
 ┃ ┃ ┗ 📂account
 ┃ ┃ ┃ ┗ 📂email
 ┃ ┃ ┃ ┃ ┣ 📜email_confirmation_signup_message.html
 ┃ ┃ ┃ ┃ ┣ 📜email_confirmation_signup_message.txt
 ┃ ┃ ┃ ┃ ┗ 📜email_confirmation_signup_subject.txt
 ┃ ┣ 📂webserver
 ┃ ┃ ┣ 📂__pycache__
 ┃ ┃ ┃ ┣ 📜__init__.cpython-310.pyc
 ┃ ┃ ┃ ┣ 📜settings.cpython-310.pyc
 ┃ ┃ ┃ ┣ 📜urls.cpython-310.pyc
 ┃ ┃ ┃ ┗ 📜wsgi.cpython-310.pyc
 ┃ ┃ ┣ 📂static
 ┃ ┃ ┃ ┗ 📂build
 ┃ ┃ ┃ ┃ ┗ 📜build
 ┃ ┃ ┣ 📜__init__.py
 ┃ ┃ ┣ 📜asgi.py
 ┃ ┃ ┣ 📜settings.py
 ┃ ┃ ┣ 📜urls.py
 ┃ ┃ ┗ 📜wsgi.py
 ┃ ┣ 📜Dockerfile
 ┃ ┣ 📜entrypoint.sh
 ┃ ┣ 📜manage.py
 ┃ ┗ 📜requirements.txt

## 실행 방법



## 시연






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

## 로컬에서 실행하는 경우
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
http://localhost:3000
```
위와 같이 접속

---

## 서버에 올려 실행하는 경우
github에 업로드 하면, CI/CD를 통하여 자동으로 build 됨
기존 코드로 그대로 실행을 한다면,
```
https://blossompick.duckdns.org
```
로 접속을 하면 Blossompick의 메인 페이지에 들어갈 수 있음

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
