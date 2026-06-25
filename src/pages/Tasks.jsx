import React, { useState, useEffect } from 'react';
import api from '../api';
import { CheckSquare, Calendar, Phone, Mail, Video, FileText, CheckCircle2 } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const completeTask = async (id) => {
    try {
      await api.put(`/tasks/${id}/complete`);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const getIcon = (type) => {
    switch(type) {
      case 'Call': return <Phone size={18} className="text-blue-400" />;
      case 'Email': return <Mail size={18} className="text-emerald-400" />;
      case 'Meeting': return <Video size={18} className="text-purple-400" />;
      case 'Proposal': return <FileText size={18} className="text-orange-400" />;
      default: return <CheckSquare size={18} className="text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'High': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Low': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
    return `px-2.5 py-0.5 rounded text-xs font-medium border ${colors[priority] || colors['Medium']}`;
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Tasks...</div>;

  return (
    <div className="p-8 pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tasks & Follow-ups</h1>
          <p className="text-slate-400 mt-1">You have {pendingTasks.length} pending tasks to complete.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar className="mr-2 text-primary" size={20} /> Pending Actions
          </h3>
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <div key={task.id} className="glass-card p-5 flex items-start border-l-4 border-l-primary/50 hover:border-l-primary">
                <button 
                  onClick={() => completeTask(task.id)}
                  className="mt-1 flex-shrink-0 w-5 h-5 rounded border border-slate-500 flex items-center justify-center hover:bg-primary/20 hover:border-primary transition-colors mr-4"
                >
                  {/* Empty checkbox */}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium">{task.title}</h4>
                    <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-400 space-x-4">
                    <span className="flex items-center">{getIcon(task.task_type)} <span className="ml-1.5">{task.task_type}</span></span>
                    <span>•</span>
                    <span className="text-primary font-medium">{task.institution_name}</span>
                  </div>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl text-slate-500">
                You're all caught up! No pending tasks.
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-400 mb-4 flex items-center">
            <CheckCircle2 className="mr-2" size={20} /> Completed Today
          </h3>
          <div className="space-y-4 opacity-60">
            {completedTasks.slice(0, 10).map(task => (
              <div key={task.id} className="glass-card p-5 flex items-start bg-slate-900/40">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center mr-4">
                  <CheckSquare size={14} />
                </div>
                <div>
                  <h4 className="text-slate-300 font-medium line-through">{task.title}</h4>
                  <p className="text-sm text-slate-500">{task.institution_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
