import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export default function ViewNotes() {
  const [username, setUsername] = useState("");
  const [standard, setStandard] = useState("");
  const [notes, setNotes] = useState([]);
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
            fetchNotes(currentUser.standard);
          }
        }
      }
    };

    const fetchNotes = async (studentStandard) => {
      const allNotes = [];
      const notesDocRef = doc(db, "notes", studentStandard.toString());
      const notesDoc = await getDoc(notesDocRef);
      if (notesDoc.exists()) {
        const data = notesDoc.data();
        for (const teacherName in data) {
          const teacherNotes = data[teacherName] || [];
          teacherNotes.forEach((note) => {
            allNotes.push({
              standard: studentStandard,
              subject: note.subject,
              uploadDate: note.uploadDate,
              teacherName: teacherName,
              fileURL: note.fileURL,
            });
          });
        }
      }
      setNotes(allNotes);
    };

    fetchStudentData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
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
          View Notes (Standard {standard})
        </h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow">
            <thead style={{ backgroundColor: "var(--dark-color)", color: "white" }}>
              <tr>
                <th>Standard</th>
                <th>Subject</th>
                <th>Upload Date</th>
                <th>Teacher Name</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {notes.length > 0 ? (
                notes.map((note, index) => (
                  <tr key={index}>
                    <td>{note.standard}</td>
                    <td>{note.subject}</td>
                    <td>{note.uploadDate}</td>
                    <td>{note.teacherName}</td>
                    <td>
                      <a
                        href={note.fileURL}
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
                    No notes found.
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
