import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function MarkAttendance() {
  const [userData, setUserData] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  const navigate = useNavigate();

  const today = format(new Date(), "dd-MM-yyyy"); // Changed to use hyphens instead of slashes

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User not logged in");

        const studentsDoc = await getDoc(doc(db, "users", "students"));
        const teachersDoc = await getDoc(doc(db, "users", "teachers"));

        const students = studentsDoc.exists() ? studentsDoc.data().students || [] : [];
        const teachers = teachersDoc.exists() ? teachersDoc.data().teachers || [] : [];

        let user = students.find((s) => s.uid === currentUser.uid);
        let role = "student";

        if (!user) {
          user = teachers.find((t) => t.uid === currentUser.uid);
          role = "teacher";
        }

        if (!user) throw new Error("User data not found");

        setUserData({
          username: user.username,
          standard: role === "student" ? user.standard : user.standards.join(", "),
          role,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAttendance = async () => {
    if (!userData) return;

    const collectionName =
      userData.role === "student" ? "studentAttendance" : "teacherAttendance";

    try {
      const attendanceDocRef = doc(db, collectionName, today); // Use the full date with hyphens
      const attendanceDoc = await getDoc(attendanceDocRef);
      const attendees = attendanceDoc.exists()
        ? attendanceDoc.data().attendees || []
        : [];

      const alreadyMarked = attendees.some(
        (entry) => entry.name === userData.username
      );

      if (alreadyMarked) {
        setIsMarked(true);
        alert("Attendance already marked for today.");
        return;
      }

      const newEntry = {
        name: userData.username,
        standard: userData.standard,
        date: format(new Date(), "dd/MM/yyyy"), // Keep the original date format for the entry
      };

      const updatedAttendees = [...attendees, newEntry];

      await setDoc(
        attendanceDocRef,
        { attendees: updatedAttendees },
        { merge: true }
      );

      setIsMarked(true);
      alert("Attendance marked successfully!");
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ backgroundColor: "var(--light-color)", minHeight: "100vh" }}>
      <nav
        className="d-flex justify-content-between align-items-center p-3"
        style={{ backgroundColor: "var(--dark-color)", color: "white" }}
      >
        <h4 className="m-0">
          Welcome, {auth.currentUser ? auth.currentUser.email.split("@")[0] : "Guest"}
        </h4>
        <button className="btn btn-danger" onClick={() => navigate(-1)}>
          Back
        </button>
      </nav>

      <div className="container mt-5 p-4 rounded shadow" style={{ backgroundColor: "#fff", maxWidth: "600px" }}>
        <h2 className="text-center mb-4" style={{ color: "var(--dark-color)" }}>
          Mark Attendance
        </h2>
        {userData && (
          <>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="text" className="form-control" value={format(new Date(), "dd/MM/yyyy")} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={userData.username} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Standard</label>
              <input type="text" className="form-control" value={userData.standard} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <input type="text" className="form-control" value={userData.role} readOnly />
            </div>
            <button
              className="btn w-100"
              style={{ backgroundColor: "#007bff", color: "white" }}
              onClick={handleAttendance}
              disabled={isMarked}
            >
              {isMarked ? "Attendance Already Marked" : "Mark Attendance"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}