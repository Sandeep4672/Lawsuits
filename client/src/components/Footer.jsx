import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h4 className="text-lg font-semibold">LawSuits</h4>
          <p className="text-sm text-green-200">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4 text-green-200">
          <a
            href="mailto:contact@legalsuite.ai"
            className="hover:text-white transition"
          >
            <FaEnvelope size={20} />
          </a>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
