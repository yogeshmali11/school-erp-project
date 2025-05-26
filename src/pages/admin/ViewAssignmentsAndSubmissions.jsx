import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Card, Spinner, Table } from 'react-bootstrap';

const ViewAssignmentsAndSubmissions = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch assignments
  const fetchAssignments = async () => {
    const assignmentsRef = collection(db, 'assignments');
    const snapshot = await getDocs(assignmentsRef);
    const allAssignments = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const standard = docSnap.id;

      Object.keys(data).forEach((teacherKey) => {
        const teacherAssignments = data[teacherKey];
        teacherAssignments.forEach((assignment) => {
          allAssignments.push({
            ...assignment,
            standard,
            teacherKey,
          });
        });
      });
    }

    return allAssignments;
  };

  // Fetch student submissions (updated as per screenshot)
  const fetchSubmissions = async () => {
    const submissionsRef = collection(db, 'submissions');
    const snapshot = await getDocs(submissionsRef);
    const allSubmissions = [];

    for (const docSnap of snapshot.docs) {
      const standard = docSnap.id;
      const data = docSnap.data();
      const subjectsArray = data.subjects || [];

      subjectsArray.forEach((subjectEntry) => {
        const subject = subjectEntry.subject;
        const assignmentsArray = subjectEntry.assignments || [];

        assignmentsArray.forEach((assignment) => {
          allSubmissions.push({
            ...assignment,
            subject,
            standard,
          });
        });
      });
    }

    return allSubmissions;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [a, s] = await Promise.all([fetchAssignments(), fetchSubmissions()]);
      setAssignments(a);
      setSubmissions(s);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Assignments</h2>
      <Card className="mb-4 p-3">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Standard</th>
              <th>Upload Date</th>
              <th>Due Date</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, index) => (
              <tr key={index}>
                <td>{a.teacherName}</td>
                <td>{a.subject}</td>
                <td>{a.standard}</td>
                <td>{a.uploadDate}</td>
                <td>{a.dueDate}</td>
                <td>
                  <a href={a.fileURL} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <h2 className="mb-4">Student Submissions</h2>
      <Card className="p-3">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Subject</th>
              <th>Assignment By</th>
              <th>Submission Date</th>
              <th>Standard</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, index) => (
              <tr key={index}>
                <td>{s.studentName}</td>
                <td>{s.subject}</td>
                <td>{s["Assignment by"]}</td>
                <td>{s["submission date"]}</td>
                <td>{s.standard}</td>
                <td>
                  <a href={s["submission file"]} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default ViewAssignmentsAndSubmissions;
