
import React, { useState } from 'react';
import { Task, TaskStatus, UserProfile } from '../types';

interface DashboardProps {
  tasks: Task[];
  user: UserProfile;
  addTask: (task: Partial<Task>) => void;
  onFocus: () => void;
  onCalendar: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, user, addTask, onFocus, onCalendar }) => {
  const [quickTask, setQuickTask] = useState("");

  const stats = [
    { label: 'Pending', value: tasks.filter(t => t.status !== TaskStatus.COMPLETED).length, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Completed', value: tasks.filter(t => t.status === TaskStatus.COMPLETED).length, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Total XP', value: user.xp + (user.level - 1) * 100, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    addTask({ title: quickTask });
    setQuickTask("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L18.8 19H5.2L12 5.45z"></path></svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 mb-8 max-w-md">Your productivity profile is optimized. Ready to organize your goals?</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <button 
                onClick={onFocus}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <span className="text-xl">⚡</span>
                Enter Focus Mode
              </button>
              <button 
                onClick={onCalendar}
                className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <span className="text-xl">📅</span>
                View Calendar
              </button>
            </div>

            <form onSubmit={handleQuickAdd} className="relative group">
              <input 
                type="text" 
                value={quickTask}
                onChange={(e) => setQuickTask(e.target.value)}
                placeholder="What's the next big thing?"
                className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent group-hover:bg-slate-100 focus:bg-white focus:border-indigo-500 rounded-[1.5rem] transition-all text-slate-700 placeholder-slate-400 font-medium"
              />
              <button type="submit" className="absolute right-3 top-3 px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all font-bold">
                Add Task
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={`p-8 rounded-[2rem] ${stat.bg} flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-transform`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</span>
              <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800">Recent Activity</h3>
            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest">View History</button>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${task.status === TaskStatus.COMPLETED ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
                  <p className={`font-semibold text-slate-800 ${task.status === TaskStatus.COMPLETED ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">{task.priority}</span>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-center text-slate-400 py-4 italic">No tasks yet.</p>}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          <h3 className="text-xl font-black mb-6 flex items-center justify-between">
            Achievements
            <span className="text-xs font-medium text-white/50">{user.badges.filter(b => b.unlockedAt).length} / {user.badges.length}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {user.badges.map(badge => (
              <div key={badge.id} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${badge.unlockedAt ? 'bg-white/10 border-white/10' : 'bg-black/20 border-white/5 grayscale opacity-50'}`}>
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-[10px] font-bold text-center uppercase tracking-tighter">{badge.name}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">View All Badges</button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6">Upcoming Milestones</h3>
          <div className="space-y-6">
             {[
               { title: 'Task Crusher', prog: (user.completedTasks / 20) * 100, label: `${user.completedTasks}/20 tasks` },
               { title: 'Streak King', prog: (user.streak / 7) * 100, label: `${user.streak}/7 days` },
               { title: 'Level Up', prog: (user.xp / (user.level * 100)) * 100, label: 'To LVL ' + (user.level + 1) }
             ].map((m, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">{m.title}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{m.label}</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(m.prog, 100)}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
