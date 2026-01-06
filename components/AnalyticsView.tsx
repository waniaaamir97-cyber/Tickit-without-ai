
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Task, TaskStatus, Priority } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const completionData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      completed: Math.floor(Math.random() * 8) + 2,
      pending: Math.floor(Math.random() * 4),
    }));
  }, []);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const COLORS = ['#6366f1', '#f97316', '#ef4444', '#10b981', '#ec4899'];

  return (
    <div className="space-y-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800">Weekly Performance</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Task Throughput</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-black uppercase text-slate-400">Done</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-[10px] font-black uppercase text-slate-400">Todo</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{stroke: '#e2e8f0', strokeWidth: 1}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorComp)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#e2e8f0" 
                  strokeWidth={2} 
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full mb-10 text-center">
            <h3 className="text-xl font-black text-slate-800">Domain Focus</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Tasks by Category</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.length ? categoryData : [{ name: 'None', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {(categoryData.length ? categoryData : [{ name: 'None', value: 1 }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} radius={10} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            {categoryData.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase text-slate-800 truncate">{cat.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{cat.value} Tasks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Deep Work Hours', value: '32.5h', icon: '⏱️' },
            { label: 'Focus Score', value: '94/100', icon: '🧠' },
            { label: 'Avg Task Velocity', value: '2.1/hr', icon: '⚡' },
            { label: 'Consistency', value: 'High', icon: '📈' },
          ].map((stat, i) => (
            <div key={i} className="space-y-3 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
               <span className="text-2xl">{stat.icon}</span>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
