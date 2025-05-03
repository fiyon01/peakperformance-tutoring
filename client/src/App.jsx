import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from './components/DashboardPage';
import DashboardHome from './components/DashboardHome';
import GoalsVisionBoard from './pages/Goals';
import AttendancePage from './pages/Attendance';
import TimetablePage from './pages/Timetable';
import ProgrammesPage from './pages/Programmes';
import ProfilePage from './pages/Profile';
import NotificationsPage from './pages/Notifications';
import HelpCenterPage from './pages/HelpCenterPage';
import PersonalTimetable from './pages/PersonalTimetable';
import LoginPage from './pages/auth/Login';
import RegistrationPage from './pages/auth/Registration';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Use correct file/component name
import PeakPerformanceTutoring from "./pages/LandingPage"; // Placeholder for Programme Communication
import LearningResources from "./pages/Resources";
import AboutUs from "./pages/AboutUs"

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Dashboard with nested routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          {/* Nested inside DashboardPage */}
          <Route path="dashboard-home" element={<DashboardHome />} />
          <Route path="my-timetable" element={<TimetablePage />} />
          <Route path="vision-board-/-my-goals" element={<GoalsVisionBoard />} />
          <Route path="personal-timetable" element={<PersonalTimetable />} />
          <Route path="explore-upcoming-programmes" element={<ProgrammesPage />} />
          <Route path="programme-communication" element={<div>Programme Communication</div>} />
          <Route path="support" element={<HelpCenterPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="my-account" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="learning-resources" element={<LearningResources />} />
        </Route>

        {/* Public routes */}
        <Route path="/auth/students-signup" element={<RegistrationPage />} />
        <Route path="/auth/students-login" element={<LoginPage />} />
        <Route path="/landingpage" element={<PeakPerformanceTutoring />} /> {/* fallback to login or landing */}
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
