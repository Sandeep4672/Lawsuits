import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserThreads() {
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/threads", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setThreads(res.data.data || []);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to fetch conversations.");
      }
    };
    fetchThreads();
  }, []);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-green-200 to-green-100">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          💬 Your Conversations
        </h2>
        {message && (
          <div className="text-center text-red-600">{message}</div>
        )}
        {threads.length === 0 && !message ? (
          <div className="text-center text-gray-600">No conversations found.</div>
        ) : (
          <ul className="divide-y divide-green-100">
            {threads.map(thread => (
              <li
                key={thread._id}
                onClick={() => navigate(`/chat/thread/${thread._id}`)}
                className="cursor-pointer bg-blue-100 px-4 py-4 hover:bg-blue-200 rounded-lg flex items-center justify-between transition"
              >
                <span className="font-medium text-green-900">
                  {thread.client._id === userId
                    ? thread.lawyer.fullName
                    : thread.client.fullName}
                </span>
                <span className="text-xs text-gray-500">
                  {thread.lastMessage
                    ? new Date(thread.lastMessage.createdAt).toLocaleString()
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}