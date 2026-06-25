import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Target, TrendingUp, DollarSign, Mail, Phone, MapPin, BrainCircuit, MessageSquare, Briefcase, CalendarCheck, FileText, CheckCircle2 } from 'lucide-react';

const InstitutionDetail = () => {
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const [copilot, setCopilot] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, copilotRes, timelineRes] = await Promise.all([
          api.get(`/institutions/${id}`),
          api.get(`/institutions/${id}/copilot`),
          api.get(`/institutions/${id}/timeline`)
        ]);
        setInstitution(instRes.data);
        setCopilot(copilotRes.data);
        setTimeline(timelineRes.data);
      } catch (error) {
        console.error("Failed to fetch detail data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Intelligence Profile...</div>;
  if (!institution) return <div className="p-8 text-center text-red-400">Institution not found.</div>;

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-semibold tracking-wide uppercase">
              {institution.lead_category}
            </span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-medium">
              {institution.status}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{institution.name}</h1>
          <div className="flex items-center text-slate-400 mt-3 space-x-6">
            <div className="flex items-center"><MapPin size={16} className="mr-2" /> {institution.location}</div>
            <div className="flex items-center"><Briefcase size={16} className="mr-2" /> {institution.institution_type}</div>
            <div className="flex items-center"><Phone size={16} className="mr-2" /> {institution.phone}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Intelligence Scorecards & Timeline */}
        <div className="xl:col-span-2 space-y-8">
          {/* AI Intelligence Scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
              <p className="text-sm font-medium text-slate-400 mb-2 flex items-center"><Target size={16} className="mr-2" /> Heat Score</p>
              <div className="flex items-end space-x-2">
                <span className="text-5xl font-black text-white">{institution.heat_score}</span>
                <span className="text-slate-500 font-medium mb-1">/100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" style={{ width: `${institution.heat_score}%` }}></div>
              </div>
            </div>
            
            <div className="glass-panel p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
              <p className="text-sm font-medium text-slate-400 mb-2 flex items-center"><TrendingUp size={16} className="mr-2" /> Conversion Prob</p>
              <div className="flex items-end space-x-2">
                <span className="text-5xl font-black text-white">{institution.conversion_probability}</span>
                <span className="text-slate-500 font-medium mb-1">%</span>
              </div>
            </div>

            <div className="glass-panel p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
              <p className="text-sm font-medium text-slate-400 mb-2 flex items-center"><DollarSign size={16} className="mr-2" /> Potential Revenue</p>
              <div className="flex items-end space-x-1">
                <span className="text-slate-400 text-2xl font-bold mb-1">₹</span>
                <span className="text-4xl font-black text-white">{(institution.potential_revenue/1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          {/* AI Relationship Timeline */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Clock className="mr-2 text-primary" size={20} /> Relationship Timeline
            </h3>
            <div className="relative border-l-2 border-slate-700 ml-4 space-y-8 pb-4">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-slate-900"></div>
                  <div className="text-xs text-slate-500 font-medium mb-1">
                    {new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                    <h4 className="text-white font-semibold text-sm">{event.event_type}</h4>
                    <p className="text-slate-400 text-sm mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Sales Copilot */}
        <div className="xl:col-span-1">
          <div className="glass-panel p-6 border-accent/30 shadow-[0_0_30px_rgba(139,92,246,0.1)] h-full">
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-700/50">
              <div className="bg-accent/20 p-2.5 rounded-xl text-accent">
                <BrainCircuit size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Sales Copilot</h3>
                <p className="text-xs text-slate-400">Context-aware recommendations</p>
              </div>
            </div>

            {copilot && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">Suggested Action</h4>
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-accent font-medium flex items-center">
                    <CheckCircle2 size={18} className="mr-2" />
                    {copilot.suggested_action}
                  </div>
                  <p className="text-sm text-slate-400 mt-2 px-1">Reason: {copilot.reason}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2 flex items-center">
                    <MessageSquare size={14} className="mr-2" /> Generated Outreach
                  </h4>
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 relative group">
                    <button className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Copy
                    </button>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                      {copilot.outreach_message}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3">Meeting Talking Points</h4>
                  <ul className="space-y-2">
                    {copilot.talking_points.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-slate-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4">
                  <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex justify-center items-center">
                    <Mail size={18} className="mr-2" />
                    Send Message Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstitutionDetail;
