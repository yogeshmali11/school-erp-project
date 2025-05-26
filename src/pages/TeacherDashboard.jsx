import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import avatar from "../assets/avatar.png";

export default function TeacherDashboard() {
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    birthdate: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const teachersDoc = await getDoc(doc(db, "users", "teachers"));
        if (teachersDoc.exists()) {
          const teachers = teachersDoc.data().teachers || [];
          const currentUser = teachers.find((t) => t.uid === user.uid);
          if (currentUser) {
            setUserData(currentUser);
            setFormData({
              address: currentUser.address || "",
              phone: currentUser.phone || "",
              birthdate: currentUser.birthdate || "",
            });
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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    const teachersRef = doc(db, "users", "teachers");
    const teachersSnap = await getDoc(teachersRef);

    if (teachersSnap.exists()) {
      const teachers = teachersSnap.data().teachers || [];
      const updatedTeachers = teachers.map((teacher) =>
        teacher.uid === userData.uid ? { ...teacher, ...formData } : teacher
      );

      await updateDoc(teachersRef, {
        teachers: updatedTeachers,
      });

      setUserData((prev) => ({ ...prev, ...formData }));
      setShowEditForm(false);
      alert("Profile updated successfully");
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowEditForm(false);
  };

  const handleEditClick = () => {
    setShowProfile(false);
    setShowEditForm(true);
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  return (
    <div style={{ backgroundColor: "#dbd8e3", minHeight: "100vh" }}>
      <nav
        className="d-flex justify-content-between align-items-center p-3"
        style={{ backgroundColor: "#352f44", color: "white", position: "relative" }}
      >
        <div onClick={toggleProfile} style={{ cursor: "pointer" }}>
          <img
            src={avatar}
            alt="avatar"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </div>
        <h4 className="m-0 text-center w-100">Welcome, {userData?.username}</h4>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>

        {showProfile && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "10px",
              background: "#352f44",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              zIndex: 1000,
              height: "90vh",
              width: "400px",
              color: "white",
              overflowY: "auto",
            }}
          >
            {Object.entries(userData || {})
              .filter(([key]) => key !== "uid" && key !== "role")
              .map(([key, value]) => (
                <p key={key}>
                  <strong>{formatKey(key)}:</strong> {formatValue(value)}
                </p>
              ))}
            <button className="btn btn-light btn-sm" onClick={handleEditClick}>
              Edit Info
            </button>
          </div>
        )}
      </nav>

      {showEditForm && (
        <div className="container mt-3" style={{ zIndex: 999 }}>
          <div className="card p-3 position-relative">
            <button
              className="btn-close position-absolute"
              style={{ right: "10px", top: "10px" }}
              onClick={() => setShowEditForm(false)}
            ></button>
            <h5>Edit Profile</h5>
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
            />
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
            />
            <input
              className="form-control mb-2"
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleFormChange}
            />
            <button className="btn btn-success" onClick={handleFormSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{
                backgroundColor: "#352f44",
                color: "white",
                cursor: "pointer",
                height: "250px",
                width: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                textAlign: "center",
              }}
              onClick={() => navigate("/teacher-dashboard/upload-assignment")}
            >
              <h5>Upload Assignment</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{
                backgroundColor: "#352f44",
                color: "white",
                cursor: "pointer",
                height: "250px",
                width: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                textAlign: "center",
              }}
              onClick={() => navigate("/teacher-dashboard/view-assignments")}
            >
              <h5>View All Assignments</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{
                backgroundColor: "#352f44",
                color: "white",
                cursor: "pointer",
                height: "250px",
                width: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                textAlign: "center",
              }}
              onClick={() => navigate("/teacher-dashboard/view-submissions")}
            >
              <h5>View Submissions</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{
                backgroundColor: "#352f44",
                color: "white",
                cursor: "pointer",
                height: "250px",
                width: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                textAlign: "center",
              }}
              onClick={() => navigate("/teacher-dashboard/view-notices")}
            >
              <h5>View Notices</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{
                backgroundColor: "#352f44",
                color: "white",
                cursor: "pointer",
                height: "250px",
                width: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                textAlign: "center",
              }}
              onClick={() => navigate("/teacher-dashboard/mark-attendance")}
            >
              <h5>Mark Attendance</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="p-4 text-center shadow rounded"
              style={{
                backgroundColor: "#352f44",
                color: "white",
                cursor: "pointer",
                height: "250px",
                width: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                textAlign: "center",
              }}
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



















// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// export default function TeacherDashboard() {
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();

//   // To navigate on a particular page..
//   const handleNavigate = (path) => {
//     navigate(`/teacher-dashboard/${path}`);
//   };

//   // Get current user's username
//   useEffect(() => {
//     const fetchUser = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const teachersDoc = await getDoc(doc(db, "users", "teachers"));
//         if (teachersDoc.exists()) {
//           const teachers = teachersDoc.data().teachers || [];
//           const currentUser = teachers.find((t) => t.uid === user.uid);
//           if (currentUser) {
//             setUsername(currentUser.username);
//           }
//         }
//       }
//     };
//     fetchUser();
//   }, []);

//   // Logout function
//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login");
//   };

//   return (
//     <div style={{ backgroundColor: "#dbd8e3", minHeight: "100vh" }}>
//       {/* Navbar/Header */}
//       <nav
//         className="d-flex justify-content-between align-items-center p-3"
//         style={{ backgroundColor: "#352f44", color: "white" }}
//       >
//         <h4 className="m-0">Welcome, {username}</h4>
//         <button className="btn btn-danger" onClick={handleLogout}>
//           Logout
//         </button>
//       </nav>

//       {/* Dashboard body  */}
//       <div className="container mt-4">
//         <div className="row g-4">
//           {/* Box 1 */}
//           <div className="col-md-4">
//             <div
//               className="p-4 text-center shadow rounded"
//               style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer", height: "250px",width: "250px", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}
//               // Navigate to upload-assignment inside teacher-dashboard
//               onClick={() => navigate("/teacher-dashboard/upload-assignment")}
//             >
//               <h5>Upload Assignment</h5>
//             </div>
//           </div>

//           {/* Box 2 */}
//           <div className="col-md-4">
//             <div
//               className="p-4 text-center shadow rounded"
//               style={{ backgroundColor: "var(--dark-color)", color: "white", cursor: "pointer", height: "250px",width: "250px", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}
//               onClick={() => navigate("/teacher-dashboard/view-assignments")}
//             >
//               <h5>View All Assignments</h5>
//             </div>
//           </div>

//           {/* Box 3 */}
//           <div className="col-md-4">
//             <div
//               className="p-4 text-center shadow rounded"
//               style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer", height: "250px",width: "250px", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}
//               // Navigate to view-submissions inside teacher-dashboard
//               onClick={() => navigate("/teacher-dashboard/view-submissions")}
//             >
//               <h5>View Submissions</h5>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div
//               className="p-4 text-center shadow rounded"
//               style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer", height: "250px",width: "250px", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}
//               onClick={() => navigate("/teacher-dashboard/view-notices")}
//             >
//               <h5>View Notices</h5>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div
//               className="p-4 text-center shadow rounded"
//               style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer", height: "250px",width: "250px", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}
//               onClick={() => navigate("/teacher-dashboard/mark-attendance")}
//             >
//               <h5>Mark Attendance</h5>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div
//               className="p-4 text-center shadow rounded"
//               style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer", height: "250px",width: "250px", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}
//               onClick={() => navigate("/teacher-dashboard/upload-notes")}
//             >
//               <h5>Upload Notes</h5>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div
//               className="p-4 text-center shadow rounded"
//               style={{ backgroundColor: "#352f44", color: "white", cursor: "pointer", height: "250px",width: "250px", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}
//               onClick={() => navigate("/teacher-dashboard/ai-chat")}
//             >
//               <h5>AI Bot <br /> (Ask Questions)</h5>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }