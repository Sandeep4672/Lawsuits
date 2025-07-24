import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftCircle, Trash2, Trash2Icon } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { io } from "socket.io-client";
import {
  generateRSAKeyPair,
  importPublicKey,
  importPrivateKey,
  generateAESKey,
  encryptWithAESKey,
  encryptAESKeyWithRSA,
  decryptAESKeyWithRSA,
  decryptWithAESKey
} from "../../utils/cryptoUtils.js";

const socket = io("https://lawsuits.onrender.com", {
  transports: ["websocket"],
  secure: true
});

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
  const [privateKey, setPrivateKey] = useState(null);
  const [bufferedMessages, setBufferedMessages] = useState([]);

  
  useEffect(() => {
  const loadDecryptedPrivateKey = async () => {
    const pem = sessionStorage.getItem("decryptedPrivateKey");
    if (!pem) {
      console.error("No decrypted RSA private key found in sessionStorage");
      return;
    }

    try {
      const key = await importPrivateKey(pem);
      setPrivateKey(key);
    } catch (err) {
      console.error("Failed to import private key from PEM:", err);
    }
  };

  loadDecryptedPrivateKey();
}, []);



  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  setUserId(user?._id);

  const handleConnect = () => {
    if (user?._id) {
      socket.emit("joinRoom", id);
    }
  };

  socket.on("connect", handleConnect);

  return () => {
    socket.off("connect", handleConnect);
    socket.emit("leaveRoom", id);
  };
}, [id]);


  const fetchMessages = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const isLawyer = localStorage.getItem("lawyerId");
    const user = JSON.parse(localStorage.getItem("user"));

    // Ensure privateKey is ready
    

    const url = isLawyer
      ? `https://lawsuits.onrender.com/lawyer/threads/${id}/messages`
      : `https://lawsuits.onrender.com/threads/${id}/messages`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawMessages = res.data.data || [];
    console.log(rawMessages);
    const decryptedMessages = await Promise.all(
  rawMessages.map(async (msg) => {
    try {
      console.log("Decrypting message:", msg._id);
      const encryptedKey = msg.senderId === user._id
  ? msg.encryptedAESKeyForSender
  : msg.encryptedAESKeyForRecipient;

console.log("Using encrypted key for:", 
  msg.senderId === user._id ? "sender" : "recipient");
      
      console.log("Encrypted AES key length:", encryptedKey.length);
      
      const aesKey = await decryptAESKeyWithRSA(privateKey, encryptedKey);
      console.log("AES key successfully decrypted");
      
      const decryptedText = await decryptWithAESKey(aesKey, {
        ciphertext: msg.encryptedMessage,
        iv: msg.iv,
      });
      
      console.log("Message successfully decrypted");
      return { ...msg, decryptedText };
    } catch (err) {
      console.error("Full decryption error:", err);
      return { ...msg, decryptedText: "[Decryption failed]" };
    }
  })
);

    setMessages(decryptedMessages);

    const otherPerson =
      location.state?.fullName ||
      location.state?.chatWith?.fullLawyerName ||
      "Chat Partner";
    setChatWith(otherPerson);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    setMessages([]);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (privateKey) {
    fetchMessages();
  }
}, [id, location.state, privateKey]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
  if (!userId) return;

  const handleReceive = async (msg) => {
    console.log("Handle recieve triggered",msg);
  if (msg.threadId === id) {
    if (!privateKey) {
      setBufferedMessages(prev => [...prev, msg]); // buffer it
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      const encryptedKey =
        msg.senderId === user._id
          ? msg.encryptedAESKeyForSender
          : msg.encryptedAESKeyForRecipient;

      const aesKey = await decryptAESKeyWithRSA(privateKey, encryptedKey);
      const decryptedText = await decryptWithAESKey(aesKey, {
        ciphertext: msg.encryptedMessage,
        iv: msg.iv,
      });

      msg.decryptedText = decryptedText;
setMessages((prev) => {
  const exists = prev.some((m) => m._id === msg._id);
  if (exists) return prev;
  return [...prev, msg];
});
    } catch (err) {
      console.error("Decryption failed", err);
    }
  }
};

  
  socket.on("receiveMessage", handleReceive);
  return () => socket.off("receiveMessage", handleReceive);
}, [id, userId, privateKey]);

useEffect(() => {
  const processBuffered = async () => {
    if (!privateKey || bufferedMessages.length === 0) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const processed = await Promise.all(
      bufferedMessages.map(async (msg) => {
        try {
          const encryptedKey =
            msg.senderId === user._id
              ? msg.encryptedAESKeyForSender
              : msg.encryptedAESKeyForRecipient;

          const aesKey = await decryptAESKeyWithRSA(privateKey, encryptedKey);
          const decryptedText = await decryptWithAESKey(aesKey, {
            ciphertext: msg.encryptedMessage,
            iv: msg.iv,
          });

          msg.decryptedText = decryptedText;
          return msg;
        } catch (err) {
          console.error("Buffered decryption failed:", err);
          msg.decryptedText = "[Decryption failed]";
          return msg;
        }
      })
    );

    setMessages((prev) => [...prev, ...processed]);
    setBufferedMessages([]); // clear buffer
  };

  processBuffered();
}, [privateKey, bufferedMessages]);



useEffect(() => {
  const handleDeleted = ({ messageId }) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  socket.on("messageDeleted", handleDeleted);

  return () => {
    socket.off("messageDeleted", handleDeleted);
  };
}, []);

  

const handleSend = async (e) => {
  e.preventDefault();
  if (!text.trim() || !privateKey) return;

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const isLawyer = localStorage.getItem("lawyerId");
  const user = JSON.parse(localStorage.getItem("user"));

  let threadData;
  try {
    const threadUrl = isLawyer
      ? `https://lawsuits.onrender.com/lawyer/threads/${id}`
      : `https://lawsuits.onrender.com/threads/${id}`;

    const res = await axios.get(threadUrl, { headers });
    threadData = res.data.data;
  } catch (err) {
    console.error("❌ Failed to get thread info:", err);
    return;
  }

  const recipientId =
    threadData.lawyer._id === userId
      ? threadData.client._id
      : threadData.lawyer._id;

  try {
    // Fetch public keys
    const [pubRecipientRes, pubSenderRes] = await Promise.all([
      axios.get(`https://lawsuits.onrender.com/encrypt/user-public/${recipientId}`, { headers }),
      axios.get(`https://lawsuits.onrender.com/encrypt/user-public/${userId}`, { headers }),
    ]);

    const recipientPubKey = await importPublicKey(pubRecipientRes.data.data);
    const senderPubKey = await importPublicKey(pubSenderRes.data.data);
    console.log(recipientPubKey,senderPubKey);
    // Generate AES key and encrypt message
    const aesKey = await generateAESKey();
    const { ciphertext, iv } = await encryptWithAESKey(aesKey, text);

    // Encrypt AES key with RSA public keys
    const encryptedAESKeyForRecipient = await encryptAESKeyWithRSA(recipientPubKey, aesKey);
    const encryptedAESKeyForSender = await encryptAESKeyWithRSA(senderPubKey, aesKey);

    const sendUrl = isLawyer
      ? `https://lawsuits.onrender.com/lawyer/threads/${id}/send`
      : `https://lawsuits.onrender.com/threads/${id}/send`;

    const res = await axios.post(
      sendUrl,
      {
        encryptedMessage: ciphertext,
        encryptedAESKeyForRecipient,
        encryptedAESKeyForSender,
        iv,
      },
      { headers }
    );

    const sentMessage = res.data.data;
    console.log("Sent Message is",sentMessage);
    socket.emit("sendMessage", { ...sentMessage, threadId: id });

// Decrypt it for immediate display
try {
  const aesKey = await decryptAESKeyWithRSA(privateKey, sentMessage.encryptedAESKeyForSender);
  const decryptedText = await decryptWithAESKey(aesKey, {
    ciphertext: sentMessage.encryptedMessage,
    iv: sentMessage.iv,
  });

setMessages((prev) => {
  const exists = prev.some((m) => m._id === sentMessage._id);
  if (exists) return prev;
  return [...prev, { ...sentMessage, decryptedText }];
});
} catch (err) {
  console.error("Failed to decrypt just-sent message:", err);
  setMessages((prev) => [...prev, { ...sentMessage, decryptedText: "[Decryption failed]" }]);
}
    setText("");
  } catch (err) {
    console.error("❌ Failed to send encrypted message:", err);
  }
};


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDelete = async (messageId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const isLawyer = localStorage.getItem("lawyerId");
      const url = isLawyer
        ? `https://lawsuits.onrender.com/lawyer/threads/${id}/messages/${messageId}`
        : `https://lawsuits.onrender.com/threads/${id}/messages/${messageId}`;

      await axios.delete(url, { headers });

      socket.emit("deleteMessage", { messageId, threadId: id });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  


  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e2f] text-white">
  <div className="max-w-2xl mx-auto w-full p-4 flex flex-col flex-1">
    {/* Header */}
    <div className="flex items-center justify-between bg-[#2a2a3d] shadow-md p-4 rounded-t-xl mb-2 border border-green-800">
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer flex items-center text-green-400 hover:text-green-300 transition"
      >
        <ArrowLeftCircle className="w-6 h-6 mr-1" />
        <span className="font-medium">Back</span>
      </button>
      <h2 className="text-xl font-semibold text-green-300 truncate">{chatWith}</h2>
      <div className="w-10" /> {/* Placeholder */}
    </div>

    {/* Messages */}
    <div
      className="flex-1 bg-[#2a2a3d] rounded-b-xl border border-green-900 shadow-inner p-4 mb-3 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600/40 scrollbar-track-green-100/10"
      style={{ maxHeight: "calc(110vh - 260px)" }}
    >
      {loading ? (
        <div className="text-center text-gray-400">Loading messages...</div>
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
              className={`relative px-4 py-2 max-w-xs rounded-xl shadow-sm break-words text-sm group transition duration-300 ${
                msg.senderId === userId
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-slate-700 text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.senderId === userId &&
                new Date() - new Date(msg.createdAt) < 5 * 60 * 1000 && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="cursor-pointer absolute top-1 right-1 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                    title="Delete message"
                  >
                    <Trash2Icon size={16} />
                  </button>
                )}
              {msg.decryptedText && <div>{msg.decryptedText}</div>}

              {/* Attachments */}
              {msg.attachment?.secure_url && (
                <div className="mt-2 space-y-1">
                  {msg.attachment.secure_url.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                    <a
                      href={msg.attachment.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={msg.attachment.secure_url}
                        alt={msg.attachment.original_filename}
                        className="max-w-xs h-auto rounded-md hover:opacity-90 transition"
                      />
                    </a>
                  ) : (
                    <>
                      <a
                        href={msg.attachment.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 underline"
                      >
                        📄 {msg.attachment.original_filename || "View Document"}
                      </a>
                      <a
                        href={msg.attachment.secure_url}
                        download
                        className="block text-sm text-green-300 underline hover:text-green-500"
                      >
                        ⬇️ Download
                      </a>
                    </>
                  )}
                </div>
              )}

              <div className="text-xs text-right mt-1 text-gray-300">
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
        className="flex-1 bg-[#2a2a3d] text-white border border-green-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
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
        className="cursor-pointer text-green-400 hover:text-green-300 font-semibold"
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
      <div className="text-sm text-gray-400 mt-1 italic">
        📎 {selectedFile.name}
      </div>
    )}
  </div>
</div>

  );
}