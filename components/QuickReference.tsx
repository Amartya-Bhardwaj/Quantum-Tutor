import React, { useState } from 'react';
import { Book, X, ChevronDown, ChevronUp } from 'lucide-react';
import { QUICK_TERMS } from '../constants';

const QuickReference: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const toggleTerm = (term: string) => {
    if (expandedTerm === term) {
      setExpandedTerm(null);
    } else {
      setExpandedTerm(term);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 p-4 rounded-full bg-quantum-secondary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] transition-all duration-300 group ${isOpen ? 'translate-x-24 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}
        title="Quick Reference"
        aria-label="Open Quick Reference Guide"
      >
        <Book size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Slide-out Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900/95 backdrop-filter backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-quantum-secondary/20 rounded-lg">
                <Book size={20} className="text-quantum-secondary" />
              </div>
              Quick Guide
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {QUICK_TERMS.map((item) => (
              <div 
                key={item.term} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${expandedTerm === item.term ? 'bg-slate-800/60 border-quantum-secondary/50 shadow-lg' : 'bg-slate-800/30 border-white/5 hover:border-white/10'}`}
              >
                <button
                  onClick={() => toggleTerm(item.term)}
                  className="w-full flex items-center justify-between p-4 text-left transition-colors"
                >
                  <span className={`font-semibold transition-colors ${expandedTerm === item.term ? 'text-quantum-glow' : 'text-slate-200'}`}>
                    {item.term}
                  </span>
                  {expandedTerm === item.term ? 
                    <ChevronUp size={16} className="text-quantum-secondary" /> : 
                    <ChevronDown size={16} className="text-slate-500" />
                  }
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedTerm === item.term ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-4 pt-0 text-sm text-slate-300 leading-relaxed">
                    <div className="w-full h-px bg-white/5 mb-3"></div>
                    {item.definition}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer decoration */}
          <div className="p-4 border-t border-white/5 bg-slate-900/50 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Quantum Explorer</p>
          </div>
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default QuickReference;