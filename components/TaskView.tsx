
import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, Priority } from '../types';

interface TaskViewProps {
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskView: React.FC<TaskViewProps> = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const queryMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = filterStatus === 'ALL' || t.status === filterStatus;
      const priorityMatch = filterPriority === 'ALL' || t.priority === filterPriority;
      return queryMatch && statusMatch && priorityMatch;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  const handleSave = () => {
    onAddTask({ 
      title: newTitle, 
      description: newDesc, 
      category: newCategory,
      priority: filterPriority === 'ALL' ? Priority.MEDIUM : filterPriority as Priority 
    });
    setNewTitle("");
    setNewDesc("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
        <div className="relative group">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or categories..."
            className="w-full pl-14 pr-10 py-5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl transition-all font-medium text-slate-700"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === status ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 shadow-xl transition-all"
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <div key={task.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 transition-transform group-hover:scale-110 ${
                task.priority === Priority.URGENT ? 'text-red-600' : 'text-indigo-600'
              }`}>
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L18.8 19H5.2L12 5.45z"></path></svg>
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                  task.priority === Priority.URGENT ? 'bg-red-50 text-red-600' : 
                  task.priority === Priority.HIGH ? 'bg-orange-50 text-orange-600' : 
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {task.priority}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {task.category}
                </span>
              </div>
              <button onClick={() => onDeleteTask(task.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            
            <h4 className={`text-xl font-black text-slate-800 mb-2 ${task.status === TaskStatus.COMPLETED ? 'line-through opacity-30' : ''}`}>
              {task.title}
            </h4>
            <p className="text-slate-500 text-sm line-clamp-3 mb-8 min-h-[4.5rem] leading-relaxed">
              {task.description || "No additional context provided."}
            </p>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
              
              <button 
                onClick={() => onUpdateTask(task.id, { status: task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED })}
                className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center ${
                  task.status === TaskStatus.COMPLETED 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-100 scale-110' 
                    : 'bg-slate-50 text-slate-300 hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
             <div className="mb-6 text-slate-200">
               <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             </div>
             <p className="text-xl font-bold text-slate-400">Your list is clean!</p>
             <p className="text-sm text-slate-300 mt-2">Time to plan your next victory.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">New Adventure</h3>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Title</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all border-none font-bold"
                      placeholder="What needs doing?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all border-none font-bold appearance-none"
                    >
                      <option>General</option>
                      <option>Work</option>
                      <option>Personal</option>
                      <option>Learning</option>
                      <option>Finance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Context & Details</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all border-none h-40 resize-none font-medium text-slate-600"
                    placeholder="Add details, subtasks, or additional info..."
                  />
                </div>
              </div>
            </div>
            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-6">
               <button 
                 onClick={() => setShowAddModal(false)}
                 className="px-6 py-3 font-black text-slate-400 hover:text-slate-600 text-xs uppercase tracking-widest"
               >
                 Go Back
               </button>
               <button 
                 onClick={handleSave}
                 className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all uppercase text-xs tracking-widest"
               >
                 Confirm Task
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskView;
