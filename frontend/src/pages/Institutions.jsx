import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Search, Filter, Plus, ChevronRight, MapPin, Users, X } from 'lucide-react';

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', location: '', contact_person: '', email: '', phone: '', institution_type: 'University', student_strength: 0, program_interest: 'Engineering'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await api.get('/institutions');
        setInstitutions(res.data);
      } catch (error) {
        console.error("Failed to fetch institutions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutions();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/institutions', {
        ...formData,
        student_strength: parseInt(formData.student_strength) || 0
      });
      setInstitutions([res.data, ...institutions]);
      setShowAddModal(false);
      setFormData({
        name: '', location: '', contact_person: '', email: '', phone: '', institution_type: 'University', student_strength: 0, program_interest: 'Engineering'
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add institution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = institutions.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Closed Won') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (status === 'New Lead') return 'text-primary bg-primary/10 border-primary/20';
    return 'text-slate-300 bg-slate-800 border-slate-700';
  };

  return (
    <div className="p-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Institution Management</h1>
          <p className="text-slate-400 mt-1">{institutions.length} total leads in the system</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline border-slate-600 text-slate-300 hover:bg-slate-800">
            <Filter size={18} className="mr-2" />
            Filter
          </button>
          <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20 flex items-center">
            <Plus size={18} className="mr-2" />
            Add Institution
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading institutions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Institution</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Heat Score</th>
                  <th className="px-6 py-4">Strength</th>
                  <th className="px-6 py-4 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-800/40 transition-colors group cursor-pointer" onClick={() => navigate(`/institutions/${inst.id}`)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white group-hover:text-primary transition-colors">{inst.name}</div>
                      <div className="flex items-center mt-1 text-xs text-slate-500">
                        <MapPin size={12} className="mr-1" />
                        {inst.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(inst.status)}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getPriorityColor(inst.priority)}`}>
                        {inst.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white border-2" 
                             style={{ borderColor: `rgba(239, 68, 68, ${inst.heat_score/100})`, backgroundColor: `rgba(239, 68, 68, ${inst.heat_score/200})` }}>
                          {inst.heat_score}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users size={14} className="mr-2 text-slate-500" />
                        {inst.student_strength.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No institutions found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold text-white">Add New Institution</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="add-inst-form" onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Institution Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Contact Person</label>
                    <input type="text" value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Phone</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Institution Type</label>
                    <select value={formData.institution_type} onChange={e => setFormData({...formData, institution_type: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50">
                      <option>University</option>
                      <option>College</option>
                      <option>Institute</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Student Strength</label>
                    <input type="number" value={formData.student_strength} onChange={e => setFormData({...formData, student_strength: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Program Interest</label>
                    <select value={formData.program_interest} onChange={e => setFormData({...formData, program_interest: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50">
                      <option>Engineering</option>
                      <option>Business</option>
                      <option>Medical</option>
                      <option>Arts</option>
                      <option>Multiple</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button form="add-inst-form" type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all flex items-center">
                {isSubmitting ? 'Adding...' : 'Add Institution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Institutions;
