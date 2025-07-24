import axios from "axios";

export const removeCase = async (saveId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  try {
    await axios.delete(
      `https://lawsuits.onrender.com/user/saved-cases/${saveId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
  } catch (err) {
    console.error("Failed to delete case", err);
    alert("Failed delete save case");
  }
};
