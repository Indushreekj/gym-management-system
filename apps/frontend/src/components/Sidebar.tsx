import Link from 'next/link';
import { Home, Users, CreditCard, Activity, Settings, LogOut, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar({ role }: { role: string }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-wider text-emerald-500">GYM<span className="text-white">PRO</span></h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-8">
        <Link href={`/dashboard/${role.toLowerCase()}`} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        
        {role === 'ADMIN' && (
          <Link href="/dashboard/admin/users" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
            <Users size={20} />
            <span>Manage Users</span>
          </Link>
        )}
        
        {role === 'MEMBER' && (
          <>
            <Link href="/dashboard/member/plan" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
              <Activity size={20} />
              <span>My Plan</span>
            </Link>
            <Link href="/dashboard/member/attendance" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
              <QrCode size={20} />
              <span>Digital ID</span>
            </Link>
          </>
        )}

        <Link href="/dashboard/billing" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <CreditCard size={20} />
          <span>Billing</span>
        </Link>
        
        <Link href="/dashboard/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded-lg w-full text-left hover:bg-red-900/50 text-red-400 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
