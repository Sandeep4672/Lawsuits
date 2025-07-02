import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function ViewPdf() {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfUrl = location.state?.pdfUrl;

  if (!pdfUrl) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white px-4">
          <h2 className="text-2xl text-red-400 font-semibold mb-4">No PDF Found</h2>
          <p className="text-gray-400 text-center mb-6">
            No PDF is available for this case. Please go back and try another one.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
          >
            ⬅ Go Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 bg-[#0f172a] text-white px-6 pb-12">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-8">
          Case PDF Document
        </h2>

        <div className="w-full max-w-5xl h-[80vh] mx-auto bg-[#1e293b] rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <iframe
            src={pdfUrl}
            title="Case PDF"
            className="w-full h-full rounded"
            frameBorder="0"
          />
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <a
            href={pdfUrl}
            download
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow font-medium transition"
          >
            📥 Download PDF
          </a>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded shadow font-medium transition"
          >
            ⬅ Back to Case
          </button>
        </div>
      </div>
    </>
  );
}
