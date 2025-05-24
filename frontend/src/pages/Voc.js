import React, { useState } from "react";

const Voc = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, email, message };

    try {
      setLoading(true); 
      const response = await fetch("https://blossompick.duckdns.org:8011/api/v1/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert("문의사항 제출에 실패했습니다.");
      }
    } catch (error) {
      alert("서버 오류 발생!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">🌸 문의사항</h2>

        {submitted ? (
          <p className="text-green-600 font-semibold text-center">문의사항이 성공적으로 접수되었습니다!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              placeholder="문의 내용을 작성해주세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition"
            >
              {loading ? "제출 중..." : "문의사항 보내기"}
            </button>

            {/* 로딩 스피너 */}
            {loading && (
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Voc;