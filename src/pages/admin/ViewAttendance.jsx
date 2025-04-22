import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { format } from "date-fns";

export default function ViewAttendance() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd")); // Format for <input type="date">
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAttendance = async () => {
    setLoading(true);
    setTeacherAttendance([]); // Clear previous data
    setStudentAttendance([]); // Clear previous data
    try {
      const formattedDate = format(new Date(selectedDate), "dd-MM-yyyy"); // Convert to match Firestore format
      const teacherDocRef = doc(db, "teacherAttendance", formattedDate);
      const studentDocRef = doc(db, "studentAttendance", formattedDate);
      const [teacherDoc, studentDoc] = await Promise.all([
        getDoc(teacherDocRef),
        getDoc(studentDocRef),
      ]);

      const teacherAttendees = teacherDoc.exists() ? teacherDoc.data().attendees || [] : [];
      const studentAttendees = studentDoc.exists() ? studentDoc.data().attendees || [] : [];

      setTeacherAttendance(teacherAttendees);
      setStudentAttendance(studentAttendees);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "var(--light-color)", minHeight: "100vh" }}>
      <nav className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: "var(--dark-color)", color: "white" }}>
        <h4 className="m-0">Admin Dashboard - View Attendance</h4>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="container mt-5 p-4 rounded shadow" style={{ backgroundColor: "#fff", maxWidth: "800px" }}>
        <h2 className="text-center mb-4" style={{ color: "var(--dark-color)" }}>View Attendance</h2>
        <div className="mb-3">
          <label className="form-label" style={{ color: "var(--dark-color)" }}>Select Date</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>
        <button
          className="btn w-100 mb-4"
          style={{ backgroundColor: "#007bff", color: "white" }}
          onClick={fetchAttendance}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Attendance"}
        </button>

        <div className="row">
          <div className="col-md-6">
            <h4>Teachers</h4>
            {loading ? (
              <p>Loading...</p>
            ) : teacherAttendance.length > 0 ? (
              <ul className="list-group">
                {teacherAttendance.map((attendee, index) => (
                  <li key={index} className="list-group-item">{attendee.name}</li>
                ))}
              </ul>
            ) : (
              <p>No teachers are present on {format(new Date(selectedDate), "dd/MM/yyyy")}</p>
            )}
          </div>
          <div className="col-md-6">
            <h4>Students</h4>
            {loading ? (
              <p>Loading...</p>
            ) : studentAttendance.length > 0 ? (
              <ul className="list-group">
                {studentAttendance.map((attendee, index) => (
                  <li key={index} className="list-group-item">{attendee.name}</li>
                ))}
              </ul>
            ) : (
              <p>No students are present on {format(new Date(selectedDate), "dd/MM/yyyy")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}