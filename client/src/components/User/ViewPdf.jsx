import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function ViewPdf() {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfUrl = location.state?.pdfUrl;

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Navbar />
        <p className="text-red-600 text-lg mt-10">No PDF found for this case.</p>
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer mt-4 px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-900"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-24">
        <h2 className="text-2xl font-bold text-cyan-800 mb-6">Case PDF Document</h2>
        <div className="w-full max-w-4xl h-[80vh] bg-white rounded shadow-lg flex flex-col items-center justify-center">
          <iframe
            src={pdfUrl}
            title="Case PDF"
            className="w-full h-full rounded"
            frameBorder="0"
          />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer mt-6 px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-900"
        >
          Back to Case Details
        </button>
      </div>
    </>
  );
}