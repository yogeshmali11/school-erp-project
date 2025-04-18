import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { format } from "date-fns";

export default function AddNotice() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please enter notice content.");
      return;
    }

    try {
      const formattedTimestamp = format(new Date(), "dd/MM/yyyy");
      await addDoc(collection(db, "notices"), {
        host: "Admin",
        content,
        timestamp: formattedTimestamp,
      });
      alert("Notice added successfully!");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error adding notice: ", error);
      alert("Failed to add notice.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4" style={{ color: "#352f44" }}>Add New Notice</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#352f44" }}>Host</label>
                <input
                  type="text"
                  className="form-control"
                  value="Admin"
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#352f44" }}>Notice Content</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter notice details here..."
                  required
                />
              </div>

              <button type="submit" className="btn w-100" style={{ backgroundColor: "#28a745", color: "white" }}>
                Submit Notice
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}