import axios from "axios";

export const saveCase = async (caseId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to save cases.");
    return;
  }

  try {
    await axios.post(
      "https://lawsuits.onrender.com/user/save-case",
      { caseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
  } catch (err) {
    console.error("Failed to save case", err);
    alert("Failed to save case");
  }
};
