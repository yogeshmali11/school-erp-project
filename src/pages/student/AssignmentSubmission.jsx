import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import supabase from "../../supabase/supabaseClient";
import { format } from "date-fns";

export default function AssignmentSubmission() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignment = location.state;
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const studentsDoc = await getDoc(doc(db, "users", "students"));
      const students = studentsDoc.data().students || [];
      const currentUser = students.find((s) => s.uid === user.uid);
      const studentName = currentUser.username;
      const standard = currentUser.standard;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-${Date.now()}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from('assignments')
        .getPublicUrl(filePath);
      const fileURL = urlData.publicUrl;

      const submissionData = {
        studentName,
        standard,
        "Assignment by": assignment.teacherName,
        "submission date": format(new Date(), "dd/MM/yyyy"),
        "submission file": fileURL,
      };

      const submissionDocRef = doc(db, "submissions", standard.toString());
      const submissionDoc = await getDoc(submissionDocRef);
      let updatedSubjects = [];

      if (submissionDoc.exists()) {
        const subjects = submissionDoc.data().subjects || [];
        const subjectIndex = subjects.findIndex(s => s.subject === assignment.subject);

        if (subjectIndex > -1) {
          const assignmentsArray = subjects[subjectIndex].assignments;

          const existingIndex = assignmentsArray.findIndex(
            (a) =>
              a["Assignment by"] === assignment.teacherName &&
              a.studentName === studentName
          );

          if (existingIndex > -1) {
            assignmentsArray[existingIndex] = submissionData;
          } else {
            assignmentsArray.push(submissionData);
          }

          subjects[subjectIndex].assignments = assignmentsArray;
        } else {
          subjects.push({ subject: assignment.subject, assignments: [submissionData] });
        }

        updatedSubjects = subjects;
      } else {
        updatedSubjects = [{ subject: assignment.subject, assignments: [submissionData] }];
      }

      await setDoc(submissionDocRef, { subjects: updatedSubjects }, { merge: true });

      alert("Assignment submitted successfully!");
      navigate("/student-dashboard/view-all-assignments");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed: " + err.message);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--light-color)", minHeight: "100vh" }}>
      <nav
        className="d-flex justify-content-between align-items-center p-3"
        style={{ backgroundColor: "var(--dark-color)", color: "white" }}
      >
        <h4 className="m-0">
          Welcome, {auth.currentUser ? auth.currentUser.email.split('@')[0] : "Guest"}
        </h4>
        <button
          className="btn btn-danger"
          onClick={() => navigate("/student-dashboard/view-all-assignments")}
        >
          Back
        </button>
      </nav>

      <div className="container mt-5 p-4 rounded shadow" style={{ backgroundColor: "#fff", maxWidth: "600px" }}>
        <h2 className="text-center mb-4" style={{ color: "var(--dark-color)" }}>Assignment Submission</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Standard</label>
            <input
              type="text"
              className="form-control"
              value={assignment ? assignment.standard : ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              value={assignment ? assignment.subject : ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Assignment by</label>
            <input
              type="text"
              className="form-control"
              value={assignment ? assignment.teacherName : ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Assignment</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#28a745", color: "white", borderColor: "#28a745" }}
          >
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
}
