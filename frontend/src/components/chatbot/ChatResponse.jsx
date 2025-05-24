const ChatResponse = ({ response }) => {
  if (!response) return null;

  return (
    <div className="mt-6 w-full bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
      {response.split("\n").map((line, idx) =>
        line.trim() === "" ? (
          <br key={idx} />
        ) : (
          <p key={idx} className="text-gray-800">{line}</p>
        )
      )}
    </div>
  );
};

export default ChatResponse;