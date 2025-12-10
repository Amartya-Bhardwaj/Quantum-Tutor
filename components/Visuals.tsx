import React from 'react';

// A visual for Superposition: A spinning coin/sphere logic
export const SuperpositionVisual: React.FC = () => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <div className="absolute w-32 h-32 rounded-full border-2 border-quantum-accent/30 animate-[spin_3s_linear_infinite]"></div>
      <div className="absolute w-40 h-40 rounded-full border border-quantum-secondary/20 animate-[spin_5s_linear_infinite_reverse]"></div>
      {/* The Particle */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-quantum-accent to-quantum-secondary blur-md animate-pulse"></div>
      <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-float"></div>
      <div className="absolute bottom-0 text-xs text-quantum-accent/70 font-mono tracking-widest uppercase">|0⟩ + |1⟩</div>
    </div>
  );
};

// A visual for Entanglement: Two connected particles
export const EntanglementVisual: React.FC = () => {
  return (
    <div className="relative w-64 h-32 flex items-center justify-between px-8">
      {/* Connection Line */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-quantum-accent to-quantum-secondary opacity-50 blur-[1px]"></div>
      
      {/* Particle A */}
      <div className="relative w-12 h-12 rounded-full bg-quantum-accent shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-[pulse_2s_infinite]">
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50">Alice</span>
      </div>

      {/* Particle B */}
      <div className="relative w-12 h-12 rounded-full bg-quantum-secondary shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-[pulse_2s_infinite]" style={{ animationDelay: '0.1s' }}>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50">Bob</span>
      </div>
      
      {/* Wave effect between them */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 border-t-2 border-white/10 rounded-[100%] animate-pulse"></div>
    </div>
  );
};

// Default abstract quantum atom
export const QuantumAtom: React.FC = () => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
       <div className="absolute w-full h-full border border-cyan-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
       <div className="absolute w-full h-full border border-purple-500/30 rounded-full animate-[spin_4s_linear_infinite]" style={{ transform: 'rotate(60deg)' }}></div>
       <div className="absolute w-full h-full border border-blue-500/30 rounded-full animate-[spin_4s_linear_infinite]" style={{ transform: 'rotate(120deg)' }}></div>
       <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]"></div>
    </div>
  )
}
