import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export default function AddUserForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [standard, setStandard] = useState("");
  const [teacherStandards, setTeacherStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const handleMultiSelect = (e, setter) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setter(options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) return alert("Please select a role");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const userData = {
        email,
        username,
        role,
        uid: user.uid,
        ...(role === "student" && { standard }),
        ...(role === "teacher" && { standards: teacherStandards, subjects }),
      };

      const docRef = doc(db, "users", role === "student" ? "students" : "teachers");

      await setDoc(
        docRef,
        {
          [role === "student" ? "students" : "teachers"]: arrayUnion(userData),
        },
        { merge: true }
      );

      alert("User added successfully!");

      // Reset form
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("");
      setStandard("");
      setTeacherStandards([]);
      setSubjects([]);
    } catch (err) {
      alert("Error adding user: " + err.message);
    }
  };

  return (
    <div
      className="container mt-5 p-4 rounded shadow"
      style={{ backgroundColor: "#f5f5f5", maxWidth: "600px" }}
    >
      <h3 className="mb-4 text-center">Add User</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {role === "student" && (
          <div className="mb-3">
            <label className="form-label">Standard</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 10"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              required
            />
          </div>
        )}

        {role === "teacher" && (
          <>
            <div className="mb-3">
              <label className="form-label">Standards</label>
              <select
                multiple
                className="form-select"
                value={teacherStandards}
                onChange={(e) => handleMultiSelect(e, setTeacherStandards)}
                required
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
            </div>

            <div className="mb-3">
              <label className="form-label">Subjects</label>
              <select
                multiple
                className="form-select"
                value={subjects}
                onChange={(e) => handleMultiSelect(e, setSubjects)}
                required
              >
                {['English', 'Maths', 'Science', 'History', 'Geography'].map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
              <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
            </div>
          </>
        )}

        <button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: "#352f44", color: "white" }}
        >
          Add User
        </button>
      </form>
    </div>
  );
}
