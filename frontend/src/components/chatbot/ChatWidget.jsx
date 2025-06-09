import React from "react";
import { UseChatGPT } from "./UseChat";
import ChatInput from "./ChatInput";
import ChatButton from "./ChatButton";
import ChatResponse from "./ChatResponse";
import { useNavigate } from "react-router-dom";

const ChatWidget = () => {
  const { input, setInput, response, loading, handleGenerate } = UseChatGPT();
  const navigate = useNavigate();

  return (
    <div className="chat-container">
      <h2 className="chat-title">
        AI 챗봇에게 꽃을 추천받아보세요!
      </h2>

      <ChatInput input={input} setInput={setInput} />
      <ChatButton loading={loading} onClick={handleGenerate} />

      {loading && (
        <div className="mt-6 flex justify-center items-center">
          <div className="border-4 border-blue-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin" />
        </div>
      )}

      {!loading && <ChatResponse response={response} />}
      {!loading && response && (
       <>
         <ChatResponse response={response} />
         <div className="flex justify-center mt-4">
           <button
             onClick={() => navigate("/order", { state: { recommended: true } })}
             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
           >
             추천 꽃집 보기
           </button>
         </div>
       </>
     )}
    </div>
  );
};

export default ChatWidget;