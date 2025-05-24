import React from "react";
import { UseChatGPT } from "./UseChatGPT";
import ChatInput from "./ChatInput";
import ChatButton from "./ChatButton";
import ChatResponse from "./ChatResponse";

const ChatWidget = () => {
  const { input, setInput, response, loading, handleGenerate } = useChatGPT();

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md w-full max-w-3xl mx-auto mt-10 border">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">AI 챗봇에게 꽃을 추천받아보세요!</h2>

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