import { useEffect, useState } from "react";
import { getDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { format } from "date-fns";
import supabase from "../../supabase/supabaseClient";

export default function UploadNotes() {
  const [standards, setStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [file, setFile] = useState(null);
  const [teacherName, setTeacherName] = useState("");

  useEffect(() => {
    const fetchTeacherData = async () => {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, "users", "teachers");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const allTeachers = docSnap.data().teachers;
        const teacher = allTeachers.find((t) => t.uid === uid);
        if (teacher) {
          setStandards(teacher.standards);
          setSubjects(teacher.subjects);
          setTeacherName(teacher.username);
        }
      }
    };
    fetchTeacherData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedStandard || !selectedSubject || !file) {
      alert("Please fill all fields");
      return;
    }

    const currentDate = format(new Date(), "dd/MM/yyyy");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `notes/${fileName}`; // inside notes folder

      // Use the 'assignments' bucket now
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from('assignments')
        .getPublicUrl(filePath);

      const fileURL = urlData.publicUrl;

      const notesData = {
        teacherName,
        standard: selectedStandard,
        subject: selectedSubject,
        fileURL,
        uploadDate: currentDate,
      };

      const notesDocRef = doc(db, "notes", selectedStandard);

      await setDoc(notesDocRef, {
        [teacherName]: arrayUnion(notesData),
      }, { merge: true });

      alert("Notes uploaded successfully!");
      setSelectedStandard("");
      setSelectedSubject("");
      setFile(null);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div className="container mt-5 p-4 rounded shadow" style={{ backgroundColor: "#f5f5f5", maxWidth: "600px" }}>
      <h3 className="mb-4 text-center">Upload Notes</h3>

      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <label className="form-label">Select Standard</label>
          <select className="form-select" value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} required>
            <option value="">Select</option>
            {standards.map((std, i) => (
              <option key={i} value={std}>{std}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Select Subject</label>
          <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
            <option value="">Select</option>
            {subjects.map((subj, i) => (
              <option key={i} value={subj}>{subj}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Notes</label>
          <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} required />
        </div>

        <button type="submit" className="btn w-100" style={{ backgroundColor: "#352f44", color: "white" }}>
          Upload Notes
        </button>
      </form>
    </div>
  );
}
