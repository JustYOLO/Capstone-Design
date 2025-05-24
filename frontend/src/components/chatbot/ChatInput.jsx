const ChatInput = ({ input, setInput }) => (
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="질문을 입력하세요"
    className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-4 py-2 w-full text-lg"
  />
);

export default ChatInput;