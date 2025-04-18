import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const querySnapshot = await getDocs(collection(db, "notices"));
          const noticesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotices(noticesList);
        } else {
          console.log("No authenticated user");
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    fetchNotices();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "var(--light-color)", minHeight: "100vh" }}>
      <nav className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: "var(--dark-color)", color: "white" }}>
        <h4 className="m-0">Notices</h4>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="container mt-4">
        <h2 className="text-center mb-4" style={{ color: "var(--dark-color)" }}>Notices</h2>
        {notices.length > 0 ? (
          <div className="list-group">
            {notices.map((notice) => (
              <div key={notice.id} className="list-group-item">
                <h5>{notice.content}</h5>
                <p>Host: {notice.host} | Date: {notice.timestamp}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No notices available.</p>
        )}
      </div>
    </div>
  );
}