import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Smart Leads Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Logged in as {user?.name} · {user?.role}
            </p>
          </div>
          <Button variant="secondary" onClick={logout}>
            Sign out
          </Button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Leads table coming in step 10...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
