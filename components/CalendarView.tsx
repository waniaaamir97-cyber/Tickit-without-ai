
import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = daysInMonth(year, month);
  const startDay = startDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const days = [];
  // Previous month padding
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`prev-${i}`} className="h-32 bg-slate-50/50 border border-slate-100 opacity-20"></div>);
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div 
        key={day} 
        className={`h-32 p-3 bg-white border border-slate-100 transition-all hover:bg-slate-50 group relative overflow-hidden flex flex-col ${isToday ? 'ring-2 ring-inset ring-indigo-500 z-10' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-black ${isToday ? 'bg-indigo-600 text-white px-2 py-1 rounded-lg' : 'text-slate-400'}`}>
            {day}
          </span>
          {dayTasks.length > 0 && (
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
              {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {dayTasks.map(task => (
            <div 
              key={task.id} 
              className={`px-2 py-1 rounded text-[9px] font-bold truncate ${
                task.priority === Priority.URGENT ? 'bg-red-50 text-red-600' :
                task.priority === Priority.HIGH ? 'bg-orange-50 text-orange-600' :
                'bg-indigo-50 text-indigo-600'
              }`}
              title={task.title}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800">{monthNames[month]} {year}</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Visualizing your timeline</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={goToToday}
              className="px-6 py-2 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
            >
              Today
            </button>
            <div className="flex items-center bg-slate-50 rounded-2xl p-1">
              <button 
                onClick={prevMonth}
                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button 
                onClick={nextMonth}
                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-l border-t border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-slate-50 p-4 border-r border-b border-slate-100 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{day}</span>
            </div>
          ))}
          {days}
        </div>
      </div>

      <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h4 className="font-bold text-indigo-900">Timeline Tip</h4>
            <p className="text-sm text-indigo-700/70">Plan your week ahead by dragging tasks onto specific dates. Consistent scheduling leads to a 40% higher completion rate!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
