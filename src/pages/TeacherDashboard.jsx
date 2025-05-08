import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function TeacherDashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // To navigate on a particular page..
  const handleNavigate = (path) => {
    navigate(`/teacher-dashboard/${path}`);
  };

  // Get current user's username
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const teachersDoc = await getDoc(doc(db, "users", "teachers"));
        if (teachersDoc.exists()) {
          const teachers = teachersDoc.data().teachers || [];
          const currentUser = teachers.find((t) => t.uid === user.uid);
          if (currentUser) {
            setUsername(currentUser.username);
          }
        }
      }
    };
    fetchUser();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#dbd8e3", minHeight: "100vh" }}>
      {/* Navbar/Header */}
      <nav
        className="d-flex justify-content-between align-items-center p-3"
        style={{ backgroundColor: "#352f44", color: "white" }}
      >
        <h4 className="m-0">Welcome, {username}</h4>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Dashboard body  */}
      <div className="container mt-4">
        <div className="row g-4">
          {/* Box 1 */}
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              // Navigate to upload-assignment inside teacher-dashboard
              onClick={() => navigate("/teacher-dashboard/upload-assignment")}
            >
              <h5>Upload Assignment</h5>
            </div>
          </div>

          {/* Box 2 */}
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "var(--dark-color)", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/teacher-dashboard/view-assignments")}
            >
              <h5>View All Assignments</h5>
            </div>
          </div>

          {/* Box 3 */}
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              // Navigate to view-submissions inside teacher-dashboard
              onClick={() => navigate("/teacher-dashboard/view-submissions")}
            >
              <h5>View Submissions</h5>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/teacher-dashboard/view-notices")}
            >
              <h5>View Notices</h5>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/teacher-dashboard/mark-attendance")}
            >
              <h5>Attendance</h5>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/teacher-dashboard/upload-notes")}
            >
              <h5>Upload Notes</h5>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}