import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatGPTWidget = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:4b",
          prompt: input,
          stream: false,
        }),
      });

      const data = await res.json();
      if (data.recommendation && data.flowers) {
        setResponse(`${data.recommendation}\n\n추천된 꽃들:\n${data.flowers.join(", ")}`);
      } else {
        setResponse("응답 없음");
      }
    } catch (err) {
      console.error("통신 오류:", err);
      setResponse("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md w-full max-w-3xl mx-auto mt-10 border">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🌸 AI 꽃 추천 챗봇</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="질문을 입력하세요"
        className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-4 py-2 w-full text-lg"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-4 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        {loading ? "응답 생성 중..." : "AI 추천 받기"}
      </button>

      {response && (
        <div className="mt-6 w-full bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm prose">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ChatGPTWidget;