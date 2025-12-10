export interface Module {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  content: string; // Base content
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  LANDING = 'LANDING',
  LEARN = 'LEARN',
  TUTOR = 'TUTOR',
  SIMULATION = 'SIMULATION'
}

export interface SimulationState {
  qubits: number;
  entangled: boolean;
  superposition: boolean;
}