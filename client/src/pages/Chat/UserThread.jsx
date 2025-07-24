import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowLeftCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const threadData=(res.data.data||[]).filter(thread=>thread.lawyer!==null);
        setThreads(threadData);
      } catch (err) {
        setMessage(
          err.response?.data?.message || "Failed to fetch conversations."
        );
      }
    };
    fetchThreads();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 px-4 sm:px-8 bg-[#1e1e2f] text-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-400 hover:text-green-200 transition mb-4"
        >
          <ArrowLeftCircle className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="max-w-2xl mx-auto bg-[#2a2a3d] rounded-2xl shadow-lg p-6 sm:p-8 border border-green-900">
          <h2 className="text-2xl font-bold text-green-400 mb-6 text-center flex items-center justify-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Your Conversations
          </h2>

          {message && (
            <div className="text-center text-red-400 font-semibold mb-4">
              {message}
            </div>
          )}

          {threads.length === 0 && !message ? (
            <div className="text-center text-gray-400">
              No conversations found.
            </div>
          ) : (
            <ul className="space-y-3">
              {threads.map((thread) => {
                const partner = thread?.lawyer;

                return (
                  <li
                    key={thread._id}
                    onClick={() =>
                      navigate(`/chat/thread/${thread._id}`, {
                        state: { fullName: partner.fullName },
                      })
                    }
                    className="flex items-center justify-between p-4 bg-[#34344a] hover:bg-green-800/30 rounded-lg transition cursor-pointer border border-transparent hover:border-green-500"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${partner.fullName}&background=random&color=fff`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border border-green-300"
                      />
                      <div>
                        <p className="font-semibold text-green-300">
                          {partner.fullName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {thread.lastMessage
                            ? thread.lastMessage.message.slice(0, 40) + "..."
                            : "No messages yet"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {thread.lastMessage
                        ? new Date(thread.lastMessage.createdAt).toLocaleTimeString()
                        : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}
