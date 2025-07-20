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
      const res = await axios.post("https://lawsuits.onrender.com/search/chatbotfaq", { question: input });
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
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="w-80 bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">LawSuits Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-sm">✖</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 h-80 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 text-sm ${
                  msg.from === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.from === "user"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 text-sm px-3 py-2 border rounded-lg outline-none"
              placeholder="Type your question..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
            >
              <ArrowUpCircle size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
