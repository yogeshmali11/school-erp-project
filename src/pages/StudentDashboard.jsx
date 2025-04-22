import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function StudentDashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const studentsDoc = await getDoc(doc(db, "users", "students"));
        if (studentsDoc.exists()) {
          const students = studentsDoc.data().students || [];
          const currentUser = students.find((s) => s.uid === user.uid);
          if (currentUser) {
            setUsername(currentUser.username);
          }
        }
      }
    };
    fetchUser();
  }, []);

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
          <div className="col-md-4">
            <div className="p-4 text-center shadow rounded" style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }} onClick={() => navigate("/student-dashboard/view-all-assignments")}>
              <h5>View Assignments</h5>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/student-dashboard/view-notices")}
            >
              <h5>View Notices</h5>
            </div>
          </div>   

          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer" }}
              onClick={() => navigate("/student-dashboard/mark-attendance")}
            >
              <h5>Attendance</h5>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}