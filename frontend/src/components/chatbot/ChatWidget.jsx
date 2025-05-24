import React from "react";
import { UseChatGPT } from "./UseChat";
import ChatInput from "./ChatInput";
import ChatButton from "./ChatButton";
import ChatResponse from "./ChatResponse";

const ChatWidget = () => {
  const { input, setInput, response, loading, handleGenerate } = UseChatGPT();

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
    </div>
  );
};

export default ChatWidget;