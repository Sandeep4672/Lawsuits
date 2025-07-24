import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import Navbar from "../Lawyer/LawyerNavbar";
import Footer from "../../components/Footer";
export default function LawyerThreads() {
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const lawyerId = localStorage.getItem("lawyerId");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://lawsuits.onrender.com/lawyer/threads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setThreads(res.data.data || []);
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
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gray-900 text-white transition-all duration-300">
      

      <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Your Conversations
        </h2>

        {message && (
          <div className="text-center text-red-400 font-medium">{message}</div>
        )}

        {threads.length === 0 && !message ? (
          <div className="text-center text-gray-400">
            No conversations found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {threads.map((thread) => {
              const user = thread.client;
              return (
                <li
                  key={thread._id}
                  onClick={() =>
                    navigate(`/chat/thread/${thread._id}`, {
                      state: { fullName: user.fullName },
                    })
                  }
                  className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 mb-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border border-green-500"
                    />
                    <div>
                      <p className="font-semibold text-green-300">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {thread.lastMessage
                          ? thread.lastMessage.message.slice(0, 30) + "..."
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {thread.lastMessage
                      ? new Date(
                          thread.lastMessage.createdAt
                        ).toLocaleTimeString()
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
