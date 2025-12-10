import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-900">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-quantum-secondary rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-quantum-accent rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-10 animate-pulse-slow"></div>
    </div>
  );
};

export default Background;