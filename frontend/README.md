# Capstone Project
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
