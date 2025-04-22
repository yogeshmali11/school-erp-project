import './App.css';
import './styles/custom.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Auth/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AddUserForm from './pages/admin/AddUser';
import UploadAssignment from './pages/teacher/UploadAssignment';
import ViewAssignments from './pages/teacher/ViewAssignments';
import ViewAllAssignments from './pages/student/ViewAllAssignments';
import AssignmentSubmission from './pages/student/AssignmentSubmission';
import ViewSubmissions from './pages/teacher/ViewSubmissions';
import AddNotice from './pages/admin/AddNotice';
import TeacherNotices from './pages/teacher/TeacherNotices';
import StudentNotices from './pages/student/StudentNotices';
import MarkAttendance from './pages/MarkAttendance';
import ViewAttendance from './pages/admin/ViewAttendance';

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/manage-users" element={<AddUserForm />} />
        <Route path="/admin-dashboard/add-notice" element={<AddNotice />} />
        <Route path="/admin-dashboard/view-attendance" element={<ViewAttendance />} />

        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-dashboard/upload-assignment" element={<UploadAssignment />} />
        <Route path="/teacher-dashboard/view-assignments" element={<ViewAssignments />} />
        <Route path="/teacher-dashboard/view-submissions" element={<ViewSubmissions />} />
        <Route path="/teacher-dashboard/view-notices" element={<TeacherNotices />} />
        <Route path="/teacher-dashboard/mark-attendance" element={<MarkAttendance />} />

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-dashboard/view-all-assignments" element={<ViewAllAssignments />} />
        <Route path="/student-dashboard/assignment-submission" element={<AssignmentSubmission />} />
        <Route path="/student-dashboard/view-notices" element={<StudentNotices />} />
        <Route path="/student-dashboard/mark-attendance" element={<MarkAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
