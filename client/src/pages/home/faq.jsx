import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {motion} from "framer-motion";
export default function FrequentlyAskedQn() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/faq");
        setFaqs(res.data.data || []);
      } catch (err) {
        setFaqs([
          {
            question: "How can I reset my password?",
            answer:
              "You can reset it from the login page using 'Forgot Password'.",
          },
          {
            question: "Is my legal information secure?",
            answer: "Yes, we use end-to-end encryption for all data.",
          },
        ]);
        console.error("Failed to fetch FAQs:", err);
      }
    };
    fetchFAQs();
  }, []);

  return(
  <div className="mt-12 px-4 max-w-4xl mx-auto mb-10" >
    <h2 className="text-2xl font-bold text-gray-400 text-center mb-6">
      Frequently Asked Questions
    </h2>
    <div className="space-y-6">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/10 backdrop-blur-md border border-gray-600 rounded-xl p-4 min-w-140 cursor-pointer"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <h3 className="text-lg font-semibold text-green-400 flex justify-between items-center">
              {faq.question}
              <span className="text-white">
                {openIndex === index ? "−" : "+"}
              </span>
            </h3>
            {openIndex === index && (
              <p className="text-gray-300 mt-2">{faq.answer}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
  );
}
