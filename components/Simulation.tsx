import React, { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw, MousePointerClick, Zap, Plus, ArrowRightLeft, Grid3X3, ArrowDown } from 'lucide-react';

// --- Types ---

interface QubitState {
  id: number;
  probabilityOne: number; // 0.0 to 1.0 (Probability of measuring |1>)
  isSuperposition: boolean;
  phase: number; // 0 to 360
  entangledGroup: number | null; // ID of the entanglement group
}

interface Gate {
  id: 'H' | 'X' | 'CNOT';
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

// --- Constants ---

const GATES: Gate[] = [
  { id: 'H', name: 'Hadamard', description: 'Creates Superposition. Maps |0⟩ to |+⟩ and |1⟩ to |-⟩.', icon: Grid3X3, color: 'bg-indigo-500' },
  { id: 'X', name: 'Pauli-X', description: 'Bit Flip. Acts like a classical NOT gate. |0⟩ → |1⟩.', icon: Zap, color: 'bg-emerald-500' },
  { id: 'CNOT', name: 'CNOT', description: 'Entangles qubits. Flips Target if Control is |1⟩.', icon: ArrowRightLeft, color: 'bg-orange-500' },
];

// --- Components ---

interface QubitVisualProps {
  qubit: QubitState;
  result: number | null;
  isMeasuring: boolean;
  selectedGate: string | null;
  cnotControlId: number | null;
  onInteract: (id: number) => void;
}

const QubitVisual: React.FC<QubitVisualProps> = ({ 
  qubit, result, isMeasuring, selectedGate, cnotControlId, onInteract 
}) => {
  // Visual state derived from logic
  const isOne = qubit.probabilityOne > 0.9;
  const isSuperposition = qubit.isSuperposition;
  const isEntangled = qubit.entangledGroup !== null;

  // Interaction State
  const isValidTarget = selectedGate !== null && (selectedGate !== 'CNOT' || cnotControlId !== qubit.id);
  const isControl = cnotControlId === qubit.id;

  // Vector Rotation Logic
  // 0 deg = Up (|0>), 180 deg = Down (|1>)
  let rotation = 0;
  if (isOne) rotation = 180;
  else if (isSuperposition) rotation = 90; 
  else rotation = 0;

  return (
    <div 
      onClick={() => isValidTarget ? onInteract(qubit.id) : undefined}
      className={`
        relative group transition-all duration-300
        ${isValidTarget ? 'cursor-pointer hover:scale-105' : ''}
        ${isControl ? 'scale-110' : ''}
      `}
    >
      {/* Interaction Hint Overlay */}
      {isValidTarget && !isMeasuring && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
          {selectedGate === 'CNOT' && cnotControlId === null ? 'Set Control' : 
           selectedGate === 'CNOT' ? 'Set Target' : 
           `Apply ${selectedGate}`}
        </div>
      )}

      {/* Main Sphere Container */}
      <div className={`
        relative w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-500 overflow-hidden
        ${isMeasuring ? 'scale-110 shadow-[0_0_30px_rgba(255,255,255,0.5)] border-white' : ''}
        ${isEntangled ? 'border-quantum-secondary shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-cyan-500/30'}
        ${isControl ? 'ring-4 ring-orange-500 ring-offset-4 ring-offset-slate-900' : ''}
        bg-slate-900/80 backdrop-blur-sm
      `}>
        
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-30"
             style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent 60%)' }}></div>
        <div className="absolute w-full h-[1px] bg-white/10 top-1/2"></div>
        <div className="absolute h-full w-[1px] bg-white/10 left-1/2"></div>

        {/* State Vector */}
        {!isMeasuring && result === null && (
          <div 
            className={`absolute top-1/2 left-1/2 w-[2px] h-[45%] origin-top bg-gradient-to-b from-white to-quantum-accent transition-transform duration-700 ease-in-out
              ${isSuperposition ? 'animate-[spin_3s_linear_infinite]' : ''}
            `}
            style={{ 
              transform: isSuperposition ? 'none' : `translate(-50%, 0) rotate(${rotation + 180}deg)` 
            }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-quantum-accent rounded-full shadow-[0_0_10px_cyan]"></div>
          </div>
        )}

        {/* Measured Result Overlay */}
        {result !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 animate-in fade-in zoom-in duration-300">
            <span className={`text-5xl font-bold font-mono ${result === 1 ? 'text-quantum-secondary' : 'text-quantum-accent'}`}>
              |{result}⟩
            </span>
          </div>
        )}

        {/* Labels */}
        <div className="absolute top-2 text-[10px] text-slate-500 font-mono">|0⟩</div>
        <div className="absolute bottom-2 text-[10px] text-slate-500 font-mono">|1⟩</div>
      </div>

      {/* Entanglement Indicator Badge */}
      {isEntangled && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-quantum-secondary rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg z-10 animate-bounce">
          E{qubit.entangledGroup}
        </div>
      )}

      {/* ID Badge */}
      <div className={`
        absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono transition-colors
        ${isControl ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 border border-white/10'}
      `}>
        Q{qubit.id}
      </div>
    </div>
  );
};

const Simulation: React.FC = () => {
  // --- State ---
  const [qubits, setQubits] = useState<QubitState[]>([]);
  const [qubitCount, setQubitCount] = useState<number>(3);
  const [results, setResults] = useState<(number | null)[]>([]);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Gate Selection State
  const [selectedGate, setSelectedGate] = useState<'H' | 'X' | 'CNOT' | null>(null);
  const [cnotControlId, setCnotControlId] = useState<number | null>(null);

  // --- Initialization ---
  
  const initQubits = useCallback((count: number) => {
    const newQubits: QubitState[] = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      probabilityOne: 0,
      isSuperposition: false,
      phase: 0,
      entangledGroup: null
    }));
    setQubits(newQubits);
    setResults(Array(count).fill(null));
    setLogs(['System initialized to |00...0⟩ state.']);
    setCnotControlId(null);
    setSelectedGate(null);
  }, []);

  useEffect(() => {
    initQubits(qubitCount);
  }, [qubitCount, initQubits]);

  // --- Logic ---

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const applyGate = (targetId: number) => {
    if (!selectedGate) return;

    // Clone state
    const newQubits = [...qubits];
    const targetIndex = newQubits.findIndex(q => q.id === targetId);
    if (targetIndex === -1) return;
    const target = newQubits[targetIndex];

    // --- Hadamard Gate ---
    if (selectedGate === 'H') {
      if (target.isSuperposition) {
        // Simplifying: H on |+> goes to |0> (ignoring phase for this basic demo level)
        target.isSuperposition = false;
        target.probabilityOne = 0; 
        addLog(`Applied H on Q${targetId}: Collapsed to |0⟩ basis.`);
      } else {
        // H on |0> or |1> creates superposition
        target.isSuperposition = true;
        target.probabilityOne = 0.5;
        addLog(`Applied H on Q${targetId}: Entered Superposition |+⟩.`);
      }
    }

    // --- Pauli-X Gate ---
    else if (selectedGate === 'X') {
      if (target.isSuperposition) {
        // X on superposition just flips phase conceptually, visually we might keep it same or blink
        addLog(`Applied X on Q${targetId}: Phase flip (Visual unchanged).`);
      } else {
        // Classic Bit Flip
        target.probabilityOne = target.probabilityOne > 0.5 ? 0 : 1;
        addLog(`Applied X on Q${targetId}: Flipped to |${target.probabilityOne > 0.5 ? 1 : 0}⟩.`);
      }
    }

    // --- CNOT Gate ---
    else if (selectedGate === 'CNOT') {
      if (cnotControlId === null) {
        // First click sets control
        setCnotControlId(targetId);
        return; // Wait for second click
      } else {
        // Second click sets target
        if (cnotControlId === targetId) return; // Can't target self

        const controlIndex = newQubits.findIndex(q => q.id === cnotControlId);
        const control = newQubits[controlIndex];

        if (control.probabilityOne < 0.1 && !control.isSuperposition) {
          // Control is |0> -> Nothing happens
          addLog(`CNOT (C:Q${cnotControlId}, T:Q${targetId}): Control is |0⟩. No change.`);
        } else if (control.probabilityOne > 0.9 && !control.isSuperposition) {
          // Control is |1> -> Flip Target
          if (!target.isSuperposition) {
             target.probabilityOne = target.probabilityOne > 0.5 ? 0 : 1;
             addLog(`CNOT (C:Q${cnotControlId}, T:Q${targetId}): Control is |1⟩. Flipped Target.`);
          } else {
             addLog(`CNOT (C:Q${cnotControlId}, T:Q${targetId}): Target in Superposition. Phase Shift.`);
          }
        } else if (control.isSuperposition) {
          // Control is Superposition -> Entanglement
          const newGroupId = Date.now(); // Unique ID for group
          control.entangledGroup = newGroupId;
          target.entangledGroup = newGroupId;
          // Target also enters a superposition-like state correlated to Control
          target.isSuperposition = true;
          target.probabilityOne = 0.5;
          addLog(`CNOT (C:Q${cnotControlId}, T:Q${targetId}): Entanglement Created!`);
        }

        // Reset CNOT state
        setCnotControlId(null);
        setSelectedGate(null); // Deselect tool after use
      }
    }

    setQubits(newQubits);
  };

  const measure = () => {
    if (isMeasuring) return;
    setIsMeasuring(true);
    addLog("Measuring system...");

    setTimeout(() => {
      const newResults: number[] = new Array(qubitCount).fill(0);
      const measuredGroups: Record<number, number> = {}; // Store result of entangled groups

      qubits.forEach((q, idx) => {
        let outcome = 0;
        
        if (q.entangledGroup && measuredGroups[q.entangledGroup] !== undefined) {
          // Already measured this group? Use correlated result
          // (Simplified: Assuming perfect correlation |00> + |11>)
          outcome = measuredGroups[q.entangledGroup];
        } else {
          // Independent measurement
          const rand = Math.random();
          outcome = rand < q.probabilityOne ? 1 : 0;
          
          // Store result if entangled
          if (q.entangledGroup) {
            measuredGroups[q.entangledGroup] = outcome;
          }
        }
        newResults[idx] = outcome;
      });

      setResults(newResults);
      setIsMeasuring(false);
      addLog(`Measurement Complete: |${newResults.join('')}⟩`);
    }, 800);
  };

  // --- Render Helpers ---

  // Check if two qubits are entangled to draw a line
  const getEntanglementPairs = () => {
    const pairs: [number, number][] = [];
    const seenGroups = new Set<number>();
    
    qubits.forEach((q1, i) => {
      if (q1.entangledGroup && !seenGroups.has(q1.entangledGroup)) {
        // Find partner
        const partnerIdx = qubits.findIndex((q2, j) => i !== j && q2.entangledGroup === q1.entangledGroup);
        if (partnerIdx !== -1) {
          pairs.push([i, partnerIdx]);
          seenGroups.add(q1.entangledGroup);
        }
      }
    });
    return pairs;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Activity className="text-quantum-accent" />
          Quantum Circuit Laboratory
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Build a circuit state. Select a Quantum Gate below, then click a Qubit to apply it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Circuit Settings */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-slate-300 font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
              System Settings
            </h3>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Qubit Count: {qubitCount}</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={qubitCount} 
                onChange={(e) => setQubitCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-quantum-accent"
                disabled={isMeasuring}
              />
            </div>
            <button 
              onClick={() => initQubits(qubitCount)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Reset Circuit
            </button>
          </div>

          {/* Gate Palette */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-slate-300 font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
              Quantum Gates
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {GATES.map((gate) => (
                <button
                  key={gate.id}
                  onClick={() => {
                     if (selectedGate === gate.id) {
                       setSelectedGate(null);
                       setCnotControlId(null);
                     } else {
                       setSelectedGate(gate.id as any);
                       setCnotControlId(null);
                     }
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all text-left border
                    ${selectedGate === gate.id 
                      ? 'bg-slate-700 border-quantum-accent shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'bg-slate-800/50 border-transparent hover:bg-slate-800 hover:border-white/10'
                    }
                  `}
                >
                  <div className={`p-2 rounded-lg text-white ${gate.color}`}>
                    <gate.icon size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">{gate.name}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{gate.description}</div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Context Help */}
            <div className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg border border-white/5 min-h-[60px]">
               {!selectedGate ? "Select a gate above to begin." : 
                selectedGate === 'CNOT' && cnotControlId === null ? "Select CONTROL qubit." :
                selectedGate === 'CNOT' ? "Select TARGET qubit." :
                `Click any qubit to apply ${selectedGate} gate.`
               }
            </div>
          </div>
          
          {/* Action Button */}
          <button
              onClick={measure}
              disabled={isMeasuring}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${isMeasuring 
                  ? 'bg-slate-700 text-slate-400 cursor-wait' 
                  : 'bg-gradient-to-r from-quantum-accent to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-900 shadow-lg hover:shadow-cyan-500/20'
                }
              `}
            >
               {isMeasuring ? <RefreshCw className="animate-spin" /> : <MousePointerClick />}
               {isMeasuring ? 'Measuring...' : 'MEASURE'}
            </button>

        </div>

        {/* Visual Workspace */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-2xl flex-1 min-h-[500px] relative flex flex-col items-center justify-center overflow-hidden border border-white/10">
            
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}>
            </div>

            {/* Circuit Wires Visualization (Decor) */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-20 z-0">
               {qubits.map((_, i) => (
                  <div key={i} className="w-full h-32 border-b border-white/20"></div>
               ))}
            </div>

            {/* Qubits Row */}
            <div className="flex flex-wrap items-center justify-center gap-12 relative z-10">
              {qubits.map((q) => (
                <QubitVisual 
                  key={q.id}
                  qubit={q}
                  result={results[q.id - 1] !== undefined ? results[q.id - 1] : null}
                  isMeasuring={isMeasuring}
                  selectedGate={selectedGate}
                  cnotControlId={cnotControlId}
                  onInteract={applyGate}
                />
              ))}
            </div>
            
            {/* Dynamic Entanglement Lines */}
            {getEntanglementPairs().map(([startIdx, endIdx], i) => (
                <div key={i} className="absolute top-1/2 left-0 right-0 h-1 bg-quantum-secondary/50 blur-sm pointer-events-none animate-pulse" 
                     style={{
                        // This is a rough CSS hack to connect them visually; 
                        // real implementation would calculate X/Y coords of refs.
                        // For this layout, we just show a connection line across the screen implies correlation.
                        // A more precise SVG overlay is complex without refs.
                        width: '80%',
                        transform: 'translateY(-50%)'
                     }}
                ></div>
            ))}

            {/* Instruction Overlay when Gate Selected */}
            {selectedGate && !isMeasuring && (
               <div className="absolute top-6 px-4 py-2 bg-slate-900/80 border border-quantum-accent/50 text-quantum-accent rounded-full text-sm font-bold flex items-center gap-2 animate-bounce">
                  <ArrowDown size={16} />
                  {selectedGate === 'CNOT' && cnotControlId !== null 
                    ? "Click Target Qubit" 
                    : `Click Qubit to apply ${selectedGate}`}
               </div>
            )}

          </div>

          {/* Event Log */}
          <div className="glass-panel p-4 rounded-xl h-40 overflow-hidden flex flex-col">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Activity size={12} /> Quantum Logs
            </h4>
            <div className="space-y-1 font-mono text-sm overflow-y-auto custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`p-1 ${i === 0 ? 'text-quantum-accent' : 'text-slate-400'}`}>
                  <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Simulation;