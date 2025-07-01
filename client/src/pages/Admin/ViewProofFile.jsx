import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function ViewProofile() {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfUrl = location.state?.pdfUrl;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-24">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Proof Document</h2>
        {!pdfUrl ? (
          <div className="text-red-600 text-lg">No proof file found.</div>
        ) : (
          <div className="w-full max-w-3xl h-[80vh] bg-white rounded shadow-lg flex flex-col items-center justify-center">
            <iframe
              src={pdfUrl}
              title="Proof PDF"
              className="w-full h-full rounded"
              frameBorder="0"
            />
          </div>
        )}
       <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
        >
          Back
        </button>
      </div>
    </>
  );
}