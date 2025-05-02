import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import GoalsVisionBoard from '../pages/Goals';
import AttendancePage from "../pages/Attendance"
import TimetablePage from '../pages/Timetable';
import ProgrammesPage from '../pages/Programmes';
import ProfilePage from "../pages/Profile"
import NotificationsPage from "../pages/Notifications"
import HelpCenterPage from "../pages/HelpCenterPage"
import PersonalTimetable from "../pages/PersonalTimetable"

const DashboardLayout = ({ children }) => {
  const [isEnrolled, setIsEnrolled] = useState(true); 
  const [currentPage, setCurrentPage] = useState('dashboard-home'); // Changed from 'home'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // new state

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isEnrolled={isEnrolled} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}  // <- ADD THIS
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />


      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <Navbar 
          studentName="Alex Johnson" 
          notificationCount={3}
          toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        <main className={`transition-all duration-300 pt-8 px-4 h-screen  ${isSidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
        {currentPage === 'dashboard-home' && <DashboardHome isEnrolled={isEnrolled} />}
        {currentPage === 'my-timetable' && <TimetablePage />}
        {currentPage === 'vision-board-/-my-goals' && <GoalsVisionBoard />}
        {currentPage === 'explore-upcoming-programmes' && <ProgrammesPage />}
        {currentPage === 'personal-timetable' && <PersonalTimetable />} {/* Placeholder for Programme Communication */}
        {currentPage === 'support' && <HelpCenterPage />}
        {currentPage === 'attendance' && <AttendancePage />}
        {currentPage === 'my-account' && <ProfilePage />}
        {currentPage === 'notifications' && <NotificationsPage />}


        {/* Add other pages as needed */}
        </main>


      </div>
    </div>
  );
};

export default DashboardLayout;
