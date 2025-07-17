import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputFIeld";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {motion} from "framer-motion";
import { generateRSAKeyPair, encryptWithPassword } from "../../utils/cryptoUtils"; // ⬅️ you'll create this

export default function LawyerSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    barId: "",
    practiceAreas: "",
    experience: "",
    password: "",
    proofFile: null,
    sop: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? Array.from(files) : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMsg("");
  setErrorMsg("");

  try {
    // Step 1: Generate RSA key pair
    const { publicKey, privateKey } = await generateRSAKeyPair();

    // Step 2: Encrypt private key with password
    const { encrypted, salt, iv } = await encryptWithPassword(privateKey, formData.password);

    // Step 3: Prepare multipart form data
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "proofFile" && Array.isArray(value)) {
        value.forEach((file) => data.append("proofFile", file));
      } else {
        data.append(key, value);
      }
    });

    // Step 4: Append RSA-related fields (no plaintext private key)
    data.append("rsaPublicKey", publicKey);
    data.append("encryptedPrivateKey", encrypted);
    data.append("salt", salt);
    data.append("iv", iv);

    // Step 5: Submit to backend
    await axios.post("http://localhost:8000/lawyer/signup", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setSuccessMsg("✅ Signup successful! Your status is pending.");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      barId: "",
      practiceAreas: "",
      experience: "",
      password: "",
      proofFile: [],
      sop: "",
    });
  } catch (err) {
    console.error(err);
    setErrorMsg("❌ Signup failed. Please try again.");
  }
};

  return (
    <>
      <Navbar />

      <div className="pt-24 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-16 text-white">
        <motion.div
        initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto shadow-2xl shadow-blue-400 bg-gray-900 border border-blue-700 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
            🧑‍⚖️ Lawyer Signup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Full Name (As on Certificate)"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white border-gray-600"
              labelClass="text-white"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white border-gray-600"
              labelClass="text-white"
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white border-gray-600"
              labelClass="text-white"
            />
            <InputField
              label="Bar Council Registration Number"
              name="barId"
              value={formData.barId}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white border-gray-600"
              labelClass="text-white"
            />
            <InputField
              label="Practice Areas (e.g., Criminal, Civil)"
              name="practiceAreas"
              value={formData.practiceAreas}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white border-gray-600"
              labelClass="text-white"
            />
            <InputField
              label="Years of Experience"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white border-gray-600"
              labelClass="text-white"
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white border-gray-600"
              labelClass="text-white"
            />

            <div>
              <label className="block mb-1 font-medium text-white">
                Upload Lawyer Certificate / Valid ID
              </label>
              <input
                type="file"
                name="proofFile"
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-white">
                Statement of Purpose (Optional)
              </label>
              <textarea
                name="sop"
                rows="4"
                value={formData.sop}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {successMsg && (
              <p className="text-green-400 text-center font-medium">
                {successMsg}
              </p>
            )}
            {errorMsg && (
              <p className="text-red-400 text-center font-medium">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-medium transition"
            >
              Signup as Lawyer
            </button>
          </form>
        </motion.div>
      </div>
      <Footer/>
    </>
  );
}
