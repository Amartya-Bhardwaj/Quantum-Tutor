import React from 'react';
import { Module } from '../types';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TopicCardProps {
  module: Module;
  onClick: () => void;
  isActive: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({ module, onClick, isActive }) => {
  // Dynamically resolve icon
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[module.icon] || LucideIcons.Atom;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl transition-all duration-300 group
        border border-white/5 hover:border-quantum-accent/50
        ${isActive 
          ? 'bg-quantum-accent/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] border-quantum-accent/50 scale-[1.02]' 
          : 'bg-slate-800/40 hover:bg-slate-800/60'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-lg transition-colors
          ${isActive ? 'bg-quantum-accent/20 text-quantum-glow' : 'bg-slate-700/50 text-slate-400 group-hover:text-quantum-accent'}
        `}>
          <IconComponent size={24} />
        </div>
        <div>
          <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
            {module.title}
          </h3>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            {module.shortDescription}
          </p>
        </div>
      </div>
    </button>
  );
};

export default TopicCard;