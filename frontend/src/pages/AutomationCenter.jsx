import React from 'react';
import { Workflow, Zap, ArrowRight, Bell, Calendar, FileText } from 'lucide-react';

const AutomationCenter = () => {
  const rules = [
    {
      id: 1,
      name: "New Lead Onboarding",
      trigger: "IF Lead Created",
      action: "THEN Create Follow-Up Task",
      icon: Bell,
      color: "blue",
      active: true
    },
    {
      id: 2,
      name: "Enterprise Prioritization",
      trigger: "IF Student Strength > 5000",
      action: "THEN Mark High Priority",
      icon: Zap,
      color: "purple",
      active: true
    },
    {
      id: 3,
      name: "Dormant Lead Revival",
      trigger: "IF No Activity For 7 Days",
      action: "THEN Generate Reminder",
      icon: Calendar,
      color: "orange",
      active: true
    },
    {
      id: 4,
      name: "Post-Meeting Follow Up",
      trigger: "IF Meeting Completed",
      action: "THEN Recommend Proposal",
      icon: FileText,
      color: "emerald",
      active: true
    }
  ];

  const logs = [
    { time: "2 mins ago", msg: "Task 'Follow-Up Call' created for State University." },
    { time: "15 mins ago", msg: "Priority elevated to HIGH for Tech Institute (Strength: 8,500)." },
    { time: "1 hour ago", msg: "Reminder generated: 'Reach out to Community College (No activity 7 days)'." }
  ];

  return (
    <div className="p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <Workflow className="mr-3 text-primary" size={32} /> Automation Center
        </h1>
        <p className="text-slate-400 mt-1">Manage rules that automatically drive your pipeline forward.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Workflows</h3>
          
          {rules.map(rule => (
            <div key={rule.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between group">
              <div className="flex items-center space-x-6 w-full">
                <div className={`p-4 rounded-xl bg-${rule.color}-500/10 text-${rule.color}-400 group-hover:scale-110 transition-transform`}>
                  <rule.icon size={28} />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-3">{rule.name}</h4>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 text-sm">
                    <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 font-mono">
                      {rule.trigger}
                    </div>
                    <ArrowRight size={16} className="text-slate-500 mx-3 hidden md:block" />
                    <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg text-primary font-mono">
                      {rule.action}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked={rule.active} />
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full glass-panel py-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors border-dashed border-2">
            + Create New Rule
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-6">Execution Logs</h3>
            <div className="space-y-6">
              {logs.map((log, idx) => (
                <div key={idx} className="relative pl-6 border-l border-slate-700 pb-2">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-900"></div>
                  <p className="text-xs text-slate-500 mb-1">{log.time}</p>
                  <p className="text-sm text-slate-300">{log.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationCenter;
