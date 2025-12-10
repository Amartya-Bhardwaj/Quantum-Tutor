import { Module } from './types';
import { Atom, Cpu, Share2, Shuffle, Layers, Key } from 'lucide-react';

export const MODULES: Module[] = [
  {
    id: 'intro',
    title: 'Introduction to Quantum',
    shortDescription: 'Why quantum computing changes everything.',
    icon: 'Atom',
    content: `Traditional computers work with bits that are either 0 or 1. Quantum computers use quantum bits, or qubits, which can exist in a state of superposition. This allows them to solve specific types of complex problems exponentially faster than classical supercomputers.`
  },
  {
    id: 'superposition',
    title: 'Superposition',
    shortDescription: 'Being in multiple states at once.',
    icon: 'Layers',
    content: `Imagine a spinning coin. While it's spinning, is it heads or tails? It's kind of both. Superposition is a quantum principle where a particle exists in all possible states simultaneously until it is measured. This property allows quantum computers to process a vast number of possibilities at once.`
  },
  {
    id: 'entanglement',
    title: 'Entanglement',
    shortDescription: 'Spooky action at a distance.',
    icon: 'Share2',
    content: `Quantum entanglement is a phenomenon where two particles become linked. If you measure the state of one particle, you instantly know the state of the other, no matter how far apart they are. Einstein called this "spooky action at a distance."`
  },
  {
    id: 'interference',
    title: 'Interference',
    shortDescription: 'Amplifying the right answers.',
    icon: 'Shuffle',
    content: `Just like waves in water can add up (constructive interference) or cancel each other out (destructive interference), quantum states can interfere. Quantum algorithms are designed to amplify the probability of the correct answer while cancelling out the wrong ones.`
  },
  {
    id: 'qubits',
    title: 'Qubits vs Bits',
    shortDescription: 'The fundamental building block.',
    icon: 'Cpu',
    content: `A classical bit is a switch: on or off. A qubit is like a sphere (the Bloch Sphere). It can be at the north pole (0), south pole (1), or anywhere on the surface (superposition). This added dimension of information density is the key to quantum power.`
  },
  {
    id: 'crypto',
    title: 'Cryptography',
    shortDescription: 'Breaking and making codes.',
    icon: 'Key',
    content: `Shor's algorithm proved that a sufficiently powerful quantum computer could break much of the encryption (like RSA) that protects the internet today. However, quantum mechanics also enables Quantum Key Distribution (QKD), creating theoretically unbreakable encryption.`
  }
];

export const INITIAL_CHAT_MESSAGE = "Greetings! I am your Quantum Tutor. I can explain complex topics, help you visualize concepts, or answer any questions about the quantum realm. What would you like to know?";

export const QUICK_TERMS = [
  { term: 'Qubit', definition: 'The fundamental unit of quantum information. Unlike a classical bit (0 or 1), a qubit can exist in a superposition of both states simultaneously.' },
  { term: 'Superposition', definition: 'A quantum state where a particle exists in all possible states simultaneously. It collapses to a single state only when measured.' },
  { term: 'Entanglement', definition: 'A phenomenon where particles become interconnected, sharing states instantaneously across any distance.' },
  { term: 'Interference', definition: 'The manipulation of quantum wave functions to amplify correct outcomes (constructive) and cancel incorrect ones (destructive).' },
  { term: 'Decoherence', definition: 'The decay of a quantum state due to interaction with the environment, causing the loss of quantum information.' },
  { term: 'Gate', definition: 'A basic quantum circuit operating on a small number of qubits, similar to classical logic gates but reversible.' },
  { term: 'Measurement', definition: 'The act of observing a quantum system, which forces it to collapse from superposition into a single definite state.' }
];