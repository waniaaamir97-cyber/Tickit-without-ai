
import React, { useState, useEffect } from 'react';
import { Task, Priority, TaskStatus } from '../types';

interface FocusModeProps {
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  onExit: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ tasks, onCompleteTask, onExit }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'custom'>('work');
  const [customInput, setCustomInput] = useState("25");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const focusTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED && (t.priority === Priority.URGENT || t.priority === Priority.HIGH));

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else if (mode === 'break') {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      // Notify user (browser notification or sound could go here)
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSetCustomTimer = () => {
    const mins = parseInt(customInput);
    if (!isNaN(mins) && mins > 0) {
      setMode('custom');
      setTimeLeft(mins * 60);
      setIsActive(false);
      setShowCustomInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
      <button 
        onClick={onExit}
        className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 group transition-all"
      >
        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Exit Focus Mode
      </button>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center space-y-8">
          <div className="space-y-2">
             <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
               {mode === 'work' ? 'Focus Session' : mode === 'break' ? 'Rest Session' : 'Custom Session'}
             </span>
             <h2 className="text-8xl font-black tabular-nums tracking-tighter">{formatTime(timeLeft)}</h2>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`px-12 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all ${
                  isActive ? 'bg-white/10 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {isActive ? 'Pause' : 'Start Focus'}
              </button>
              <button 
                onClick={() => { 
                  const defaultTime = mode === 'break' ? 5 * 60 : 25 * 60;
                  setTimeLeft(mode === 'custom' ? parseInt(customInput) * 60 : defaultTime); 
                  setIsActive(false); 
                }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </button>
            </div>

            {showCustomInput ? (
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
                <input 
                  type="number" 
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-20 bg-transparent border-none focus:ring-0 text-center font-bold text-lg"
                  placeholder="Mins"
                  min="1"
                />
                <button 
                  onClick={handleSetCustomTimer}
                  className="px-4 py-2 bg-indigo-600 rounded-xl font-bold text-sm"
                >
                  Set
                </button>
                <button 
                  onClick={() => setShowCustomInput(false)}
                  className="p-2 text-white/40"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowCustomInput(true)}
                className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                Custom Timer
              </button>
            )}
          </div>
          
          <p className="text-white/40 text-sm max-w-xs mx-auto italic">"Focus on being productive instead of busy."</p>
        </div>

        <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-md border border-white/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"></path></svg>
            Focus Targets
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {focusTasks.length > 0 ? focusTasks.map(task => (
              <div key={task.id} className="group bg-white/10 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/15 transition-all">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-bold truncate">{task.title}</p>
                  <p className="text-xs text-white/40">{task.priority} Priority</p>
                </div>
                <button 
                  onClick={() => onCompleteTask(task.id)}
                  className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
            )) : (
              <div className="text-center py-12 text-white/30 border-2 border-dashed border-white/10 rounded-2xl">
                <p>No high-priority tasks.</p>
                <p className="text-xs mt-2">Add some critical tasks to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
