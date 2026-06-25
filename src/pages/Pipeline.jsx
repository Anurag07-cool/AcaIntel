import React, { useState, useEffect } from 'react';
import api from '../api';
import { Target, Users, MoreHorizontal } from 'lucide-react';

const Pipeline = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'New Lead', title: 'New Lead', color: 'border-blue-500' },
    { id: 'Contacted', title: 'Contacted', color: 'border-indigo-500' },
    { id: 'Meeting Scheduled', title: 'Meeting Scheduled', color: 'border-purple-500' },
    { id: 'Proposal Sent', title: 'Proposal Sent', color: 'border-pink-500' },
    { id: 'Negotiation', title: 'Negotiation', color: 'border-orange-500' },
  ];

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await api.get('/institutions');
        setInstitutions(res.data);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutions();
  }, []);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('instId', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    const id = e.dataTransfer.getData('instId');
    if (!id) return;
    
    // Optimistic UI update
    setInstitutions(prev => prev.map(inst => 
      inst.id === parseInt(id) ? { ...inst, status: newStatus } : inst
    ));

    try {
      await api.put(`/institutions/${id}/status`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Pipeline...</div>;

  return (
    <div className="p-8 pb-20 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Sales Pipeline</h1>
        <p className="text-slate-400 mt-1">Drag and drop institutions to update their status.</p>
      </div>

      <div className="flex flex-1 space-x-6 overflow-x-auto pb-4">
        {columns.map(col => {
          const columnInsts = institutions.filter(i => i.status === col.id);
          
          return (
            <div 
              key={col.id} 
              className="flex-shrink-0 w-80 bg-slate-900/50 rounded-2xl border border-slate-700/50 flex flex-col max-h-full overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={`p-4 border-b-2 ${col.color} bg-slate-800/80 flex justify-between items-center`}>
                <h3 className="font-semibold text-slate-200">{col.title}</h3>
                <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded-md">{columnInsts.length}</span>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {columnInsts.map(inst => (
                  <div 
                    key={inst.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, inst.id)}
                    className="glass-card p-4 cursor-grab active:cursor-grabbing border-l-4 border-l-primary/50 hover:border-l-primary"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white line-clamp-1" title={inst.name}>{inst.name}</h4>
                      <button className="text-slate-500 hover:text-slate-300"><MoreHorizontal size={16} /></button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-xs font-medium bg-red-500/10 text-red-400 px-2 py-1 rounded-md">
                        <Target size={12} className="mr-1" />
                        {inst.heat_score}
                      </div>
                      <div className="flex items-center text-xs text-slate-400">
                        <Users size={12} className="mr-1" />
                        {(inst.student_strength/1000).toFixed(1)}k
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
