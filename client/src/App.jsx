import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardPage from './components/DashboardPage';
import DashboardHome from './components/DashboardHome';
import WeeklyReflection from './pages/Goals';
import AttendancePage from './pages/Attendance';
import TimetablePage from './pages/Timetable';
import ProgrammesPage from './pages/Programmes';
import ProfilePage from './pages/Profile';
import NotificationsPage from './pages/Notifications';
import HelpCenterPage from './pages/HelpCenterPage';
import PersonalTimetable from './pages/PersonalTimetable';
import LoginPage from './pages/auth/Login';
import RegistrationPage from './pages/auth/Registration';
import ProtectedRoute from './components/ProtectedRoute';
import PeakPerformanceTutoring from "./pages/LandingPage";
import SecurityQuestionDisplay from "./pages/test";
import LearningResources from "./pages/Resources";
import AboutUs from "./pages/AboutUs";
import GoalsPage from "./pages/GoalsPage";
import TutoringPolicies from "./pages/Policies"
import SecurityDetailsPage from "./pages/accountRecovery/SecurityDetailsPage";
import AccountRecoverySetup from "./pages/accountRecovery/AccountRecoverySetup";


function App() {
  return (
    <Router>
      <>
        <Routes>
          {/* Protected Dashboard with nested routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard-home" element={<DashboardHome />} />
            <Route path="my-timetable" element={<TimetablePage />} />
            <Route path="focused-sessions" element={<WeeklyReflection />} />
            <Route path="personal-timetable" element={<PersonalTimetable />} />
            <Route path="upcoming-programmes" element={<ProgrammesPage />} />
            <Route path="programme-communication" element={<div>Programme Communication</div>} />
            <Route path="support" element={<HelpCenterPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="my-account" element={<ProfilePage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="learning-resources" element={<LearningResources />} />
          </Route>

          {/* Public routes */}
          <Route path="/auth/students-signup" element={<RegistrationPage />} />
          <Route path="/auth/students-login" element={<LoginPage />} />
          <Route path="/" element={<PeakPerformanceTutoring />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/policies" element={<TutoringPolicies />} />
          <Route path="/account-recovery" element={<SecurityDetailsPage />} />
          <Route path="/account-recovery/set-up" element={<AccountRecoverySetup />} />

        </Routes>

        {/* Global Toast Messages */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    </Router>
  );
}

export default App;
