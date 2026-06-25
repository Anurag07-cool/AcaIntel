import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Workflow, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">AcaIntel</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/login')} className="text-slate-300 hover:text-white font-medium text-sm hidden sm:block">Log in</button>
          <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-sm">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen"></div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap size={16} className="mr-2" /> V2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Transform Academia <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Partnerships with AI
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Automate outreach, prioritize institutions, generate intelligent recommendations, and accelerate your partnership growth with the industry's most advanced Business Automation Platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center">
              Get Started for Free <ArrowRight size={20} className="ml-2" />
            </button>
            <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center">
              View Interactive Demo
            </button>
          </div>
          
          <div className="mt-10 flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center"><ShieldCheck size={16} className="mr-2 text-emerald-500" /> No credit card required</div>
            <div className="flex items-center"><ShieldCheck size={16} className="mr-2 text-emerald-500" /> 14-day free trial</div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="container mx-auto px-6 mt-20 relative z-10">
          <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl pointer-events-none"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="w-full rounded-xl border border-slate-800 object-cover h-[400px] md:h-[600px] opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
            />
            {/* Overlay UI elements to make it look like our app */}
            <div className="absolute top-8 left-8 p-6 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl w-80 hidden md:block">
              <h4 className="text-white font-bold mb-4 flex items-center"><BrainCircuit className="mr-2 text-primary" size={20}/> AI Copilot Insight</h4>
              <p className="text-sm text-slate-300">"State University's Heat Score reached 92/100. Recommend immediate outreach to schedule a workshop."</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500">Just now</span>
                <button className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg font-medium">Generate Email</button>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default LandingPage;
