import {
  FaFileAlt,
  FaFileSignature,
  FaRobot,
  FaLanguage,
  FaComments,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const tools = [
  {
    title: "Document Summarization",
    description: "Process 1000+ page documents with AI-powered summaries.",
    icon: <FaFileAlt size={32} />,
    path: "get-document-summary",
  },
  {
    title: "Find a Lawyer",
    description: "Connect with qualified lawyers for your legal needs.",
    icon: <FaFileSignature size={32} />,
    path: "/find-lawyers",
  },
  {
    title: "Messages with Lawyer",
    description: "Check your chat with lawyers.",
    icon: <FaComments size={32} />,
    path: "/chat/threads",
  },
  {
    title: "Document OCR",
    description: "High-volume text extraction with multi-language support.",
    icon: <FaLanguage size={32} />,
    path: "/dashboard",
    comingSoon: true,
  },
  {
    title: "Document Translation",
    description: "Legally-aware translation with dialect mapping.",
    icon: <FaLanguage size={32} />,
    path: "/dashboard",
    comingSoon: true,
  },
  {
    title: "Default Mode",
    description: "General-purpose AI chat interface.",
    icon: <FaRobot size={32} />,
    path: "/dashboard",
    comingSoon: true,
  },
];

export default function DashboardTools() {
  return (
    <div className="pt-12 pb-12 px-6 min-h-screen bg-transparent">
      <h2 className="text-3xl font-bold text-center text-white mb-10 tracking-tight drop-shadow-lg">
        ⚙️ Choose a Legal Tool
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <Link to={tool.path} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="group hover:scale-[1.03] bg-[#1e1e1e] p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500 hover:shadow-green-800 transition-all duration-300 cursor-pointer h-full relative"
            >
              {tool.comingSoon && (
                <div className="absolute top-2 right-2 bg-yellow-600 text-xs text-white font-semibold px-2 py-1 rounded-md shadow">
                  Coming Soon
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="text-green-400 group-hover:text-green-500 transition">
                  {tool.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-green-400">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
