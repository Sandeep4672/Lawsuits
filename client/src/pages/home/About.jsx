import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  User,
  Search,
  Headset,
  ShieldCheck,
  GaugeCircle,
  Bot,
} from "lucide-react";

export default function LearnMore() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className=" pt-30 bg-slate-800 text-white py-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-6">
            Learn More About <span className="text-green-400">Law</span>
            <span className="text-blue-400">Suits</span>
          </h1>
          <p className="text-lg text-slate-300">
            Empowering people with verified legal help, smart tools, and seamless digital consultations.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
          <p className="text-lg text-slate-300 mb-12">
            To make legal services accessible, transparent, and efficient for everyone — using trusted professionals and smart tools.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-slate-900 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl text-green-400 font-semibold mb-2">
                Vision
              </h3>
              <p className="text-slate-300">
                A world where legal barriers are removed through accessible digital solutions — where everyone can seek justice without hassle.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-slate-900 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl text-blue-400 font-semibold mb-2">
                Core Values
              </h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Accessibility</li>
                <li>Trust & Transparency</li>
                <li>Efficiency & Innovation</li>
                <li>Client Empowerment</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-slate-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Sign Up",
              desc: "Create your account in minutes",
              icon: User,
            },
            {
              title: "Find a Lawyer",
              desc: "Browse verified legal experts for your case",
              icon: Search,
            },
            {
              title: "Connect & Consult",
              desc: "Chat, schedule, and consult securely online",
              icon: Headset,
            },
          ].map((item, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={index}
              className="bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-green-400 transition-all duration-300"
            >
              <item.icon className="text-green-400 w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-20 px-6 bg-slate-800 text-white text-center">
        <h2 className="text-3xl font-bold mb-10">Why Trust Us?</h2>
        <div className="flex flex-wrap justify-center gap-10 text-white">
          <div>
            <p className="text-4xl font-bold text-green-400">10K+</p>
            <p className="text-slate-300">Users Helped</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-400">500+</p>
            <p className="text-slate-300">Verified Lawyers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-400">4.9⭐</p>
            <p className="text-slate-300">Average Rating</p>
          </div>
        </div>
      </section>

   

      {/* Call to Action */}
      <section className="py-20 px-6 bg-slate-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to take control of your legal journey?
        </h2>
        <p className="text-slate-400 mb-6">
          Join LawSuits and get connected with the right lawyer instantly.
        </p>
        <Link to="/signup">
          <button className="cursor-pointer bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-semibold rounded-md transition-all duration-300">
            Get Started Now
          </button>
        </Link>
      </section>

      <Footer />
    </>
  );
}
