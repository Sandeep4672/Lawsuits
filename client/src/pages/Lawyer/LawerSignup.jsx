import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputFIeld";
import Navbar from "../../components/Navbar";

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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "proofFile" && Array.isArray(value)) {
        value.forEach((file) => data.append("proofFile", file));
      } else {
        data.append(key, value);
      }
    });

    try {
      await axios.post("http://localhost:8000/lawyer/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(
        "✅ Signup successful! Your status is pending. You'll be notified after verification."
      );
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
      setErrorMsg("❌ Signup failed. Please try again with valid details.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-24 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-16 text-white">
        <div className="max-w-3xl mx-auto bg-gray-900 border border-blue-700 shadow-xl rounded-2xl p-8">
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
        </div>
      </div>
    </>
  );
}
