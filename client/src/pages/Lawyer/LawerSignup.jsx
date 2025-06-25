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
        value.forEach((file) => data.append("files", file));
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
        "✅ Signup successful! Your status is pending. We'll email you once verified. You'll be able to login then."
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

      <div className=" pt-30 min-h-screen bg-gradient-to-br from-blue-200 to-blue-100 px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            🧑‍⚖️ Lawyer Signup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Full Name (As on Certificate)"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <InputField
              label="Bar Council Registration Number"
              name="barId"
              value={formData.barId}
              onChange={handleChange}
              required
            />
            <InputField
              label="Practice Areas (e.g., Criminal, Civil)"
              name="practiceAreas"
              value={formData.practiceAreas}
              onChange={handleChange}
              required
            />
            <InputField
              label="Years of Experience"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Upload Lawyer Certificate / Valid ID
              </label>
              <input
                type="file"
                name="proofFile"
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Statement of Purpose (Optional)
              </label>
              <textarea
                name="sop"
                rows="4"
                value={formData.sop}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {successMsg && (
              <p className="text-green-600 text-center font-medium">
                {successMsg}
              </p>
            )}
            {errorMsg && (
              <p className="text-red-600 text-center font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg text-lg font-medium"
            >
              Signup as Lawyer
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
