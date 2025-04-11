import React, { useState } from "react";

const OllamaChat = () => {
  const [response, setResponse] = useState("");

  const askOllama = async () => {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama2", // 사용하는 모델 이름
        prompt: "기념일에 어울리는 꽃은?", // 입력 프롬프트
        stream: false,
      }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="p-6">
      <button onClick={askOllama} className="px-4 py-2 bg-purple-600 text-white rounded">
        질문하기
      </button>
      <p className="mt-4">{response}</p>
    </div>
  );
};

export default OllamaChat;