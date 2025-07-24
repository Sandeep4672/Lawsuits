import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ArrowUpCircle, MessageCircle } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about the platform." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:8000/search/chatbotfaq", { question: input });
      const botReply = res.data.reply;
      setMessages(prev => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Something went wrong. Please try again later." }
      ]);
    }
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-full cursor-pointer bg-gradient-to-tr from-blue-500 to-blue-700 hover:scale-105 transition shadow-xl text-white"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold tracking-wide">💬 LawSuits Chatbot</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-red-200 text-lg font-bold transition"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 h-80 bg-gray-50 space-y-2 scrollbar-thin scrollbar-thumb-blue-300">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
                  msg.from === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t bg-white flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 text-sm px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your question..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
            >
              <ArrowUpCircle size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}