'use client';

import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);
    setRole(user.role);
  }, [router]);

  if (!role) return <div className="h-screen flex items-center justify-center bg-gray-50 text-black">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
