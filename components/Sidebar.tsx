
import React from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: 'dashboard' | 'tasks' | 'analytics' | 'focus' | 'calendar';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'analytics' | 'focus' | 'calendar') => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeTab, setActiveTab, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'tasks', label: 'Workplace', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'calendar', label: 'Timeline', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'analytics', label: 'Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'focus', label: 'Deep Focus', icon: 'M13 10V3L4 14h7v7l9-11h-7z', special: true },
  ];

  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 transition-transform duration-300 md:relative md:translate-x-0 flex flex-col`}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl transition-transform group-hover:rotate-12">
            T
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">TickIt.</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id as any);
              if (window.innerWidth < 768) setIsOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-100' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            } ${item.special ? 'mt-8 border-t border-slate-50 pt-8' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}></path>
            </svg>
            <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 mt-auto">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl border-4 border-white shadow-sm" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 truncate tracking-tight">{user.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Elite Member</p>
            </div>
          </div>
          <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
