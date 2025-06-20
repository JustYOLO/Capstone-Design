import { useState } from "react";

export const UseChatGPT = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const isLoggedIn = !!localStorage.getItem("user");
    const today = new Date().toISOString().split("T")[0];

    if (!isLoggedIn) {
      const lastUse = localStorage.getItem("lastGuestUsage");
      if (lastUse === today) {
        setResponse("⚠️ 비회원은 하루 1번만 사용할 수 있어요.\n로그인 후 무제한으로 이용해보세요!");
        return;
      } else {
        localStorage.setItem("lastGuestUsage", today);
      }
    }

    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gemma3:12b", prompt: input, stream: false }),
      });

      const text = await res.text();
      const { flowers_result, flower_names } = JSON.parse(text);

      localStorage.setItem("flowerNames", JSON.stringify(flower_names));
      
      console.log("받아온 꽃 이름들:", flower_names);
      setResponse(flowers_result || "응답 없음");
    } catch (err) {
      console.error("통신 오류:", err);
      setResponse("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return { input, setInput, response, loading, handleGenerate };
};