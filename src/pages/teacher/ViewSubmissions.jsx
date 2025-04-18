import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export default function ViewSubmissions() {
  const [username, setUsername] = useState("");
  const [standards, setStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [submissions, setSubmissions] = useState([]);
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
            setStandards(currentUser.standards || []);
            setSubjects(currentUser.subjects || []);
            if (currentUser.standards.length > 0) {
              setSelectedStandard(currentUser.standards[0]); // Default to first standard
              fetchSubmissions(currentUser.standards[0], currentUser.subjects[0]); // Default to first subject
            }
          }
        }
      }
    };

    fetchTeacherData();
  }, []);

  const fetchSubmissions = async (standard, subject) => {
    setSelectedStandard(standard);
    setSelectedSubject(subject);
    const submissionDocRef = doc(db, "submissions", standard.toString());
    const submissionDoc = await getDoc(submissionDocRef);
    if (submissionDoc.exists()) {
      const subjectsData = submissionDoc.data().subjects || [];
      const subjectData = subjectsData.find((s) => s.subject === subject);
      if (subjectData) {
        setSubmissions(subjectData.assignments || []);
      } else {
        setSubmissions([]);
      }
    } else {
      setSubmissions([]);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "var(--light-color)", minHeight: "100vh", display: "flex" }}>
      {/* Navbar/Header */}
      <nav
        className="d-flex justify-content-between align-items-center p-3 w-100"
        style={{ backgroundColor: "var(--dark-color)", color: "white", position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
      >
        <h4 className="m-0">Welcome, {username}</h4>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ display: "flex", marginTop: "60px", width: "100%" }}>
        {/* Left Sidebar for Standards and Subjects */}
        <div
          style={{
            width: "250px",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
            position: "fixed",
          }}
        >
          <h5 style={{ color: "var(--dark-color)", marginBottom: "15px" }}>Filters</h5>
          <div>
            <label style={{ fontWeight: "bold", color: "var(--dark-color)" }}>Standards:</label>
            {standards.map((std, i) => (
              <div key={i}>
                <input
                  type="radio"
                  id={`std-${i}`}
                  name="standard"
                  value={std}
                  checked={selectedStandard === std}
                  onChange={() => fetchSubmissions(std, selectedSubject || subjects[0])}
                  style={{ marginRight: "5px" }}
                />
                <label htmlFor={`std-${i}`} style={{ color: "var(--dark-color)" }}>
                  {std}
                </label>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "15px" }}>
            <label style={{ fontWeight: "bold", color: "var(--dark-color)" }}>Subjects:</label>
            {subjects.map((subj, i) => (
              <div key={i}>
                <input
                  type="radio"
                  id={`subj-${i}`}
                  name="subject"
                  value={subj}
                  checked={selectedSubject === subj}
                  onChange={() => fetchSubmissions(selectedStandard || standards[0], subj)}
                  style={{ marginRight: "5px" }}
                />
                <label htmlFor={`subj-${i}`} style={{ color: "var(--dark-color)" }}>
                  {subj}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content for Submissions */}
        <div style={{ marginLeft: "270px", padding: "20px", width: "calc(100% - 270px)" }}>
          <h2 style={{ color: "var(--dark-color)", marginBottom: "20px" }}>
            Submissions for Standard {selectedStandard} - Subject {selectedSubject}
          </h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover shadow">
              <thead style={{ backgroundColor: "var(--dark-color)", color: "white" }}>
                <tr>
                  <th>Student Name</th>
                  <th>Submission Date</th>
                  <th>File</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? (
                  submissions.map((submission, index) => (
                    <tr key={index}>
                      <td>{submission.studentName}</td>
                      <td>{submission["submission date"]}</td>
                      <td>
                        <a
                          href={submission["submission file"]}
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
                    <td colSpan="3" className="text-center">
                      No submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}