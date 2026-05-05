import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-black tracking-tighter">
          <span className="text-emerald-500">GYM</span>PRO
        </h1>
        <p className="text-xl text-gray-400 max-w-lg mx-auto">
          The advanced, all-in-one management system for your fitness business.
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            Access Portal
          </Link>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
