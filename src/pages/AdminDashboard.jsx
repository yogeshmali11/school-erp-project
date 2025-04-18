import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function AdminDashboard() {
  const [username] = useState("Admin");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#dbd8e3", minHeight: "100vh" }}>
      <nav className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: "#352f44", color: "white" }}>
        <h4 className="m-0">Welcome, {username}</h4>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="container mt-4">
        <div className="row g-4">
          {/* Manage Users */}
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/admin-dashboard/manage-users")}
            >
              <h5>Manage Users</h5>
            </div>
          </div>

          {/* Notices/Announcements */}
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/admin-dashboard/add-notice")}
            >
              <h5>Notices</h5>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
