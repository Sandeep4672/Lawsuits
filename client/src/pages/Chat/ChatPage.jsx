import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:7000"); // Change if needed

export default function ChatPage() {
  const { id } = useParams(); // thread ID
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [chatWith, setChatWith] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user?._id);
    if (user?._id) {
      socket.emit("joinRoom", id);
    }
  }, [id]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let res;
      try {
        res = await axios.get(`http://localhost:8000/threads/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        res = await axios.get(
          `http://localhost:8000/lawyer/threads/${id}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setMessages(res.data.data || []);
      const otherPerson =
        location.state?.chatWith?.fullName ||
        location.state?.chatWith?.fullLawyerName ||
        "Chat Partner";
      setChatWith(otherPerson);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id, location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.threadId === id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveRoom", id);
    };
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) return;

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      let res;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("message", text || selectedFile.name);

        res = await axios.post(
          `http://localhost:8000/threads/${id}/upload`,
          formData,
          { headers }
        );
      } else {
        res = await axios.post(
          `http://localhost:8000/threads/${id}/send`,
          { content: text },
          { headers }
        );
      }

      const sentMessage = res.data.data;
      socket.emit("sendMessage", { ...sentMessage, threadId: id });

      setText("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Sending failed", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-blue-100">
      <div className="max-w-2xl mx-auto w-full p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between bg-white shadow-md p-4 rounded-t-xl mb-2">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center text-green-700 hover:text-green-900"
          >
            <ArrowLeftCircle className="w-6 h-6 mr-1" />
            <span className="font-medium">Back</span>
          </button>
          <h2 className="text-xl font-semibold text-green-700 truncate">
            {chatWith}
          </h2>
          <div className="w-10"></div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white rounded-b-xl shadow-inner p-4 mb-3 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-gray-100">
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400">No messages yet.</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex mb-3 ${
                  msg.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 max-w-xs rounded-xl shadow-sm break-words text-sm ${
                    msg.senderId === userId
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message && <div>{msg.message}</div>}

                  {msg.attachment?.secure_url && (
                    <div className="mt-2">
                      {msg.attachment.secure_url.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                        <img
                          src={msg.attachment.secure_url}
                          alt={msg.attachment.original_filename}
                          className="max-w-full h-auto rounded-md"
                        />
                      ) : (
                        <a
                          href={msg.attachment.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-500"
                        >
                          📎 {msg.attachment.original_filename || "Download File"}
                        </a>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-right mt-1 text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Send Box */}
        <form onSubmit={handleSend} className="flex gap-3 items-center mt-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
          />
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-green-600 font-semibold"
          >
            📎
          </label>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            Send
          </button>
        </form>

        {selectedFile && (
          <div className="text-sm text-gray-600 mt-1 italic">
            📎 {selectedFile.name}
          </div>
        )}
      </div>
    </div>
  );
}
