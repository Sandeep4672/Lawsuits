import Navbar from "../../components/Navbar";
import DashboardTools from "../../components/DashboardTools";
import Footer from "../../components/Footer";
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-100 text-white">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">LawSuits</h1>
        <p className="text-center text-gray-700 mb-8">
          Choose a tool to begin your legal task. Analyze, draft, ask, extract, or translate.
        </p>

        
        <DashboardTools />
      </div>
      <Footer/>
    </div>
  );
}
