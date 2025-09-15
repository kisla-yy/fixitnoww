import React, { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://fixitnoww-production.up.railway.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botReply = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Something went wrong." }]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-600 text-white p-2 rounded-t-lg">AI Chatbot</div>

      {/* Messages */}
      <div className="flex-1 p-2 overflow-y-auto h-64">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-2 py-1 rounded-lg ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Bot is typing...</p>}
      </div>

      {/* Input box */}
      <div className="flex border-t">
        <input
          className="flex-1 p-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 text-white px-4"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
