import React, { useState } from 'react';
import { MODULES } from './constants';
import { AppView, Module } from './types';
import Background from './components/Background';
import TopicCard from './components/TopicCard';
import ChatInterface from './components/ChatInterface';
import QuickReference from './components/QuickReference';
import Simulation from './components/Simulation';
import { SuperpositionVisual, EntanglementVisual, QuantumAtom } from './components/Visuals';
import { generateExplanation } from './services/geminiService';
import { ArrowRight, BookOpen, MessageSquare, RefreshCw, Zap, Atom, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [activeModuleId, setActiveModuleId] = useState<string>(MODULES[0].id);
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];

  const handleModuleChange = (id: string) => {
    setActiveModuleId(id);
    setDynamicContent(null); // Reset dynamic content when switching topics
  };

  const handleDeepDive = async () => {
    setIsGenerating(true);
    const content = await generateExplanation(activeModule.title, 'beginner');
    setDynamicContent(content);
    setIsGenerating(false);
  };

  const renderVisual = (id: string) => {
    switch (id) {
      case 'superposition': return <SuperpositionVisual />;
      case 'entanglement': return <EntanglementVisual />;
      default: return <QuantumAtom />;
    }
  };

  const LandingPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center z-10 relative">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-quantum-accent blur-[80px] opacity-20 animate-pulse"></div>
        <QuantumAtom />
      </div>
      <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 mb-6 neon-text tracking-tight">
        QUANTUM
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
        Unlock the mysteries of the subatomic universe.
        <br />
        <span className="text-quantum-accent">Learn. Visualize. Interact.</span>
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setView(AppView.LEARN)}
          className="group px-8 py-4 bg-quantum-accent text-slate-900 rounded-full font-bold text-lg hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]"
        >
          Start Learning
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => setView(AppView.TUTOR)}
          className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
        >
          Ask AI Tutor
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );

  const LearnPage = () => (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-4">
           <div className="mb-6 p-4 glass-panel rounded-xl flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <BookOpen className="text-quantum-accent" />
                 Modules
              </h2>
           </div>
           <div className="space-y-3">
             {MODULES.map(module => (
               <TopicCard 
                 key={module.id} 
                 module={module} 
                 isActive={activeModuleId === module.id}
                 onClick={() => handleModuleChange(module.id)}
               />
             ))}
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-2xl min-h-[600px] relative overflow-hidden flex flex-col">
            
            {/* Header / Visual */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-white/10 pb-8">
               <div className="p-8 bg-slate-900/50 rounded-full border border-white/5 shadow-inner">
                  {renderVisual(activeModuleId)}
               </div>
               <div className="text-center md:text-left">
                 <h1 className="text-4xl font-bold text-white mb-2">{activeModule.title}</h1>
                 <p className="text-quantum-accent font-mono uppercase tracking-wider text-sm">Concept {MODULES.findIndex(m => m.id === activeModuleId) + 1} of {MODULES.length}</p>
               </div>
            </div>

            {/* Content Text */}
            <div className="prose prose-invert prose-lg max-w-none flex-grow">
               <div className="text-slate-300 leading-8 text-lg">
                 {activeModule.content}
               </div>

               {/* Dynamic AI Content Section */}
               {dynamicContent && (
                 <div className="mt-8 p-6 bg-quantum-secondary/10 border border-quantum-secondary/30 rounded-xl animate-float">
                    <h3 className="text-quantum-secondary font-bold mb-3 flex items-center gap-2">
                      <Zap size={18} /> Deep Dive Analysis
                    </h3>
                    <p className="text-slate-200 text-base italic leading-relaxed">
                      "{dynamicContent}"
                    </p>
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-4">
               <button 
                  onClick={handleDeepDive}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
               >
                  {isGenerating ? <RefreshCw className="animate-spin" size={18}/> : <Zap size={18} className="text-yellow-400" />}
                  {isGenerating ? 'Consulting the Oracle...' : 'Explain Deeper with AI'}
               </button>
            </div>
          </div>
        </div>

      </div>
      <QuickReference />
    </div>
  );

  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 h-16 flex items-center px-6 justify-between">
       <div 
         className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer"
         onClick={() => setView(AppView.LANDING)}
        >
          <div className="text-quantum-accent"><Atom size={24} /></div>
          <span className="text-white hidden sm:block">Quantum<span className="text-quantum-accent">Explorer</span></span>
       </div>
       
       <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
          <button 
            onClick={() => setView(AppView.LEARN)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === AppView.LEARN ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Learn
          </button>
          <button 
            onClick={() => setView(AppView.SIMULATION)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === AppView.SIMULATION ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <Activity size={16} />
            Simulation
          </button>
          <button 
            onClick={() => setView(AppView.TUTOR)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === AppView.TUTOR ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Tutor
          </button>
       </div>
    </nav>
  );

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-quantum-accent/30 selection:text-white">
      <Background />
      
      {view !== AppView.LANDING && <Navigation />}

      <main className="relative">
        {view === AppView.LANDING && <LandingPage />}
        {view === AppView.LEARN && <LearnPage />}
        {view === AppView.SIMULATION && <Simulation />}
        {view === AppView.TUTOR && (
          <div className="pt-24 px-4 min-h-screen flex flex-col items-center">
             <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Quantum Tutor</h2>
                <p className="text-slate-400">Ask any question about the quantum universe.</p>
             </div>
             <ChatInterface />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
