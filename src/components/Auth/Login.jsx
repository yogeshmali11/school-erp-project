import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
  
      if (email === "admin@gmail.com") {
        navigate("/admin-dashboard");
        return;
      }
  
      // Get all students
      const studentsDoc = await getDoc(doc(db, "users", "students"));
      const studentsArray = studentsDoc.exists() ? studentsDoc.data().students || [] : [];
  
      const isStudent = studentsArray.find((u) => u.uid === user.uid);
      if (isStudent) {
        navigate("/student-dashboard");
        return;
      }
  
      // Get all teachers
      const teachersDoc = await getDoc(doc(db, "users", "teachers"));
      const teachersArray = teachersDoc.exists() ? teachersDoc.data().teachers || [] : [];
  
      const isTeacher = teachersArray.find((u) => u.uid === user.uid);
      if (isTeacher) {
        navigate("/teacher-dashboard");
        return;
      }
  
      alert("User role not found. Please contact admin.");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div
      className="container mt-5 p-4 rounded"
      style={{ backgroundColor: "var(--light-color)", color: "var(--dark-color)", maxWidth: "400px" }}
    >
      <h2 className="mb-4 text-center">Login</h2>

      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: "var(--dark-color)", color: "var(--light-color)" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
