import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import WeeklyReflection from '../pages/Goals';
import AttendancePage from "../pages/Attendance";
import TimetablePage from '../pages/Timetable';
import ProgrammesPage from '../pages/Programmes';
import ProfilePage from "../pages/Profile";
import NotificationsPage from "../pages/Notifications";
import HelpCenterPage from "../pages/HelpCenterPage";
import PersonalTimetable from "../pages/PersonalTimetable";
import LearningResources from "../pages/Resources";

const DashboardLayout = () => {
  const [isEnrolled, setIsEnrolled] = useState(true); 
  const [currentPage, setCurrentPage] = useState('dashboard-home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handler function for toggling sidebar on all screen sizes
  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(prev => !prev);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isEnrolled={isEnrolled}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col">
        <Navbar 
          studentName="Alex Johnson" 
          notificationCount={3}
          onHamburgerClick={handleToggleSidebar} // Now using the correct prop name
        />

        <main className={`transition-all duration-300 pt-8 px-4 h-screen ${isSidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
          {currentPage === 'dashboard-home' && <DashboardHome isEnrolled={isEnrolled} />}
          {currentPage === 'my-timetable' && <TimetablePage />}
          {currentPage === 'vision-board-/-my-goals' && <WeeklyReflection />}
          {currentPage === 'explore-upcoming-programmes' && <ProgrammesPage />}
          {currentPage === 'personal-timetable' && <PersonalTimetable />}
          {currentPage === 'support' && <HelpCenterPage />}
          {currentPage === 'attendance' && <AttendancePage />}
          {currentPage === 'my-account' && <ProfilePage />}
          {currentPage === 'notifications' && <NotificationsPage />}
          {currentPage === 'learning-resources' && <LearningResources />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;