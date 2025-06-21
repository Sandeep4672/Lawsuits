import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
export default function ApplyLawyer() {
  const [formData, setFormData] = useState({
    fullLawyerName: "",
    professionalEmail: "",
    phone: "",
    barId: "",
    practiceAreas: "",
    experience: "",
    proofFile: null,
    sop: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
   const navigate=useNavigate();
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const token=localStorage.getItem("token");
      await axios.post("http://localhost:8000/lawyer/apply", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:`Bearer ${token}`,
        },
      });
      
      navigate("/profile",{ state: { lawyerStatusUpdated: "pending" } });
      
      // setSuccessMsg("Application submitted successfully! We’ll review and contact you soon.");
      // setFormData({
      //   fullLawyerName: "",
      //   professionalEmail: "",
      //   phone: "",
      //   barId: "",
      //   practiceAreas: "",
      //   experience: "",
      //   proofFile: null,
      //   sop: "",
      // });
    } catch (err) {
      setErrorMsg("Failed to submit application. Please check details and try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen  pt-28 bg-gradient-to-br from-green-100 to-white px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            🧑‍⚖️ Apply to be a Verified Lawyer
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Full Name As In Lawyer Certificate</label>
              <input
                type="text"
                name="fullLawyerName"
                value={formData.fullLawyerName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="professionalEmail"
                value={formData.professionalEmail}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Bar Council ID */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Bar Council Registration Number
              </label>
              <input
                type="text"
                name="barId"
                value={formData.barId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Practice Areas */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Practice Areas</label>
              <input
                type="text"
                name="practiceAreas"
                placeholder="e.g., Criminal, Civil, Corporate"
                value={formData.practiceAreas}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Proof Upload */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Upload Valid ID / Lawyer Certificate
              </label>
              <input
                type="file"
                name="proofFile"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              />
            </div>

            {/* SOP */}
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

            {/* Message */}
            {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}
            {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg text-lg font-medium"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
