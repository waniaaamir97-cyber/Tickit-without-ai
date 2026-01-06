
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, TaskStatus, Priority, UserProfile, Badge } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskView from './components/TaskView';
import AnalyticsView from './components/AnalyticsView';
import FocusMode from './components/FocusMode';
import CalendarView from './components/CalendarView';

const INITIAL_USER: UserProfile = {
  id: 'user-1',
  name: 'Alex Developer',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  level: 1,
  xp: 0,
  completedTasks: 0,
  joinedDate: new Date().toISOString(),
  streak: 5,
  lastActive: new Date().toISOString(),
  badges: [
    { id: '1', name: 'Early Bird', icon: '☀️', unlockedAt: new Date().toISOString() },
    { id: '2', name: 'Task Master', icon: '🎯' }
  ]
};

const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tickit-tasks', []);
  const [user, setUser] = useLocalStorage<UserProfile>('tickit-user', INITIAL_USER);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'analytics' | 'focus' | 'calendar'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Streak logic
  useEffect(() => {
    const last = new Date(user.lastActive);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      setUser({ ...user, streak: user.streak + 1, lastActive: today.toISOString() });
    } else if (diffDays > 1) {
      setUser({ ...user, streak: 1, lastActive: today.toISOString() });
    }
  }, []);

  const addTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      priority: newTask.priority || Priority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      tags: newTask.tags || [],
      category: newTask.category || 'General',
      subtasks: newTask.subtasks || [],
      xpValue: 20,
    };
    setTasks([task, ...tasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (updates.status === TaskStatus.COMPLETED && t.status !== TaskStatus.COMPLETED) {
          handleXpGain(t.xpValue);
        }
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleXpGain = (amount: number) => {
    const newXp = user.xp + amount;
    const nextLevelXp = user.level * 100;
    if (newXp >= nextLevelXp) {
      setUser({
        ...user,
        xp: newXp - nextLevelXp,
        level: user.level + 1,
        completedTasks: user.completedTasks + 1
      });
    } else {
      setUser({
        ...user,
        xp: newXp,
        completedTasks: user.completedTasks + 1
      });
    }
  };

  if (activeTab === 'focus') {
    return <FocusMode 
      tasks={tasks} 
      onCompleteTask={(id) => updateTask(id, { status: TaskStatus.COMPLETED })} 
      onExit={() => setActiveTab('dashboard')} 
    />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      )}

      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        activeTab={activeTab as any} 
        setActiveTab={setActiveTab as any} 
        user={user}
      />

      <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">
              {activeTab}
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Manage your day with precision.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex items-center gap-2">
               <span className="text-xl">🔥</span>
               <span className="font-bold text-orange-600">{user.streak} Day Streak</span>
             </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">LVL {user.level}</span>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${(user.xp / (user.level * 100)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard tasks={tasks} user={user} addTask={addTask} onFocus={() => setActiveTab('focus')} onCalendar={() => setActiveTab('calendar')} />}
        {activeTab === 'tasks' && <TaskView tasks={tasks} onAddTask={addTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} />}
        {activeTab === 'analytics' && <AnalyticsView tasks={tasks} />}
        {activeTab === 'calendar' && <CalendarView tasks={tasks} />}
      </main>
    </div>
  );
};

export default App;
