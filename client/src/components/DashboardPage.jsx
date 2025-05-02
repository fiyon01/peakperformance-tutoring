import DashboardLayout from './Dashboard';
import DashboardHome from './DashboardHome';
import { useParams,useLocation, Outlet } from "react-router-dom";
const DashboardPage = () => {
  const location = useLocation();
  const justLoggedIn = location.state?.justLoggedIn || false;

  return (
    <DashboardLayout>
      <DashboardHome
        justLoggedIn={justLoggedIn} // ✅ This is critical
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
