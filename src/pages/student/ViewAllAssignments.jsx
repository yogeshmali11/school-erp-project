import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export default function ViewAllAssignments() {
  const [username, setUsername] = useState("");
  const [standard, setStandard] = useState("");
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      const user = auth.currentUser;
      if (user) {
        const studentsDoc = await getDoc(doc(db, "users", "students"));
        if (studentsDoc.exists()) {
          const students = studentsDoc.data().students || [];
          const currentUser = students.find((s) => s.uid === user.uid);
          if (currentUser) {
            setUsername(currentUser.username);
            setStandard(currentUser.standard);
            fetchAssignments(currentUser.standard);
          }
        }
      }
    };

    const fetchAssignments = async (studentStandard) => {
      const allAssignments = [];
      const assignmentDocRef = doc(db, "assignments", studentStandard.toString());
      const assignmentDoc = await getDoc(assignmentDocRef);
      if (assignmentDoc.exists()) {
        for (const teacherName in assignmentDoc.data()) {
          const teacherAssignments = assignmentDoc.data()[teacherName] || [];
          teacherAssignments.forEach((assignment) => {
            allAssignments.push({
              standard: studentStandard,
              subject: assignment.subject,
              fileURL: assignment.fileURL,
              uploadDate: assignment.uploadDate,
              dueDate: assignment.dueDate,
              teacherName: teacherName,
            });
          });
        }
      }
      setAssignments(allAssignments);
    };

    fetchStudentData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSubmitClick = (assignment) => {
    navigate("/student-dashboard/assignment-submission", { state: assignment });
  };

  return (
    <div style={{ backgroundColor: "var(--light-color)", minHeight: "100vh" }}>
      <nav
        className="d-flex justify-content-between align-items-center p-3"
        style={{ backgroundColor: "var(--dark-color)", color: "white" }}
      >
        <h4 className="m-0">Welcome, {username}</h4>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="container mt-4">
        <h2 className="text-center mb-4" style={{ color: "var(--dark-color)" }}>
          View All Assignments (Standard {standard})
        </h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow">
            <thead style={{ backgroundColor: "var(--dark-color)", color: "white" }}>
              <tr>
                <th>Standard</th>
                <th>Subject</th>
                <th>Upload Date</th>
                <th>Due Date</th>
                <th>Teacher Name</th>
                <th>File</th>
                <th>Submit</th>
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
                    <td>{assignment.teacherName}</td>
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
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSubmitClick(assignment)}
                        style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
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