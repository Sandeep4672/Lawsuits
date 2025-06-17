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
    title: "Ved AI Legal Counsel",
    description: "SOTA Indian AI with multi-stage reasoning.",
    icon: <FaRobot size={32} />,
    path: "/dashboard",
  },
  {
    title: "Document OCR",
    description: "High-volume text extraction with multi-language support.",
    icon: <FaLanguage size={32} />,
    path: "/dashboard",
  },
  {
    title: "Document Translation",
    description: "Legally-aware translation with dialect mapping.",
    icon: <FaLanguage size={32} />,
    path: "/dashboard",
  },
  {
    title: "Default Mode",
    description: "General-purpose AI chat interface.",
    icon: <FaComments size={32} />,
    path: "/dashboard",
  },
];

export default function DashboardTools() {
  return (
    <div className="pt-16 pb-12 px-6 bg-gradient-to-br from-green-100 to-white min-h-screen">
      <h2 className="text-3xl font-bold text-center text-green-900 mb-10 tracking-tight">
        Choose a Legal Tool
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {tools.map((tool, index) => (
          <Link to={tool.path} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="group bg-white p-6 rounded-2xl shadow-xl border hover:shadow-2xl hover:border-green-500 transition-all duration-300 cursor-pointer relative h-full "
            >
              <div className="flex items-center justify-between mb-4 ">
                <div className="text-green-700 group-hover:text-green-900 transition">{tool.icon}</div>
                {tool.tag && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full shadow">
                    {tool.tag}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-800">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
