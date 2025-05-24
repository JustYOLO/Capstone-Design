const ChatButton = ({ loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="mt-4 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
  >
    {loading ? "응답 생성 중..." : "AI 추천 받기"}
  </button>
);

export default ChatButton;