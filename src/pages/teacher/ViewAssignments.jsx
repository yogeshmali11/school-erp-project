// pages/teacher/ViewAssignments.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export default function ViewAssignments() {
  const [username, setUsername] = useState("");
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      const user = auth.currentUser;
      if (user) {
        const teachersDoc = await getDoc(doc(db, "users", "teachers"));
        if (teachersDoc.exists()) {
          const teachers = teachersDoc.data().teachers || [];
          const currentUser = teachers.find((t) => t.uid === user.uid);
          if (currentUser) {
            setUsername(currentUser.username);
            fetchAssignments(currentUser.username, currentUser.standards);
          }
        }
      }
    };

    const fetchAssignments = async (teacherName, standards) => {
      const allAssignments = [];
      // Fetch assignments from all standards the teacher is associated with
      for (const standard of standards) {
        const assignmentDocRef = doc(db, "assignments", standard.toString());
        const assignmentDoc = await getDoc(assignmentDocRef);
        if (assignmentDoc.exists()) {
          const teacherAssignments = assignmentDoc.data()[teacherName] || [];
          teacherAssignments.forEach((assignment) => {
            allAssignments.push({
              standard: standard,
              subject: assignment.subject,
              fileURL: assignment.fileURL,
              uploadDate: assignment.uploadDate,
              dueDate: assignment.dueDate,
            });
          });
        }
      }
      setAssignments(allAssignments);
    };

    fetchTeacherData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "var(--light-color)", minHeight: "100vh" }}>
      {/* Navbar/Header */}
      <nav
        className="d-flex justify-content-between align-items-center p-3"
        style={{ backgroundColor: "var(--dark-color)", color: "white" }}
      >
        <h4 className="m-0">Welcome, {username}</h4>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Assignments Table */}
      <div className="container mt-4">
        <h2 className="text-center mb-4" style={{ color: "var(--dark-color)" }}>
          View Assignments
        </h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow">
            <thead style={{ backgroundColor: "var(--dark-color)", color: "white" }}>
              <tr>
                <th>Standard</th>
                <th>Subject</th>
                <th>Upload Date</th>
                <th>Due Date</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <tr key={index}>
                    <td>{assignment.standard}</td>
                    <td>{assignment.subject}</td>
                    <td>{assignment.uploadDate}</td>
                    <td>{assignment.dueDate}</td>
                    <td>
                      <a
                        href={assignment.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                        style={{ backgroundColor: "var(--dark-color)", color: "white" }}
                      >
                        View File
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}