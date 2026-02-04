import { create } from 'zustand';
import { Bin, LeaderboardEntry, User } from './types';
import { MOCK_BINS, MOCK_LEADERBOARD, MOCK_USER } from './constants';

interface AppState {
  user: User;
  bins: Bin[];
  leaderboard: LeaderboardEntry[];
  activeBinId: string | null;
  
  // Actions
  updateCredits: (amount: number) => void;
  updateCarbon: (amount: number) => void;
  setActiveBin: (id: string | null) => void;
  collectBin: (id: string) => void; // Admin action
  addBinItem: (weight: number, credits: number) => void; // Kiosk action
}

export const useStore = create<AppState>((set) => ({
  user: MOCK_USER,
  bins: MOCK_BINS,
  leaderboard: MOCK_LEADERBOARD,
  activeBinId: null,

  updateCredits: (amount) => set((state) => ({ 
    user: { ...state.user, credits: state.user.credits + amount } 
  })),

  updateCarbon: (amount) => set((state) => ({ 
    user: { ...state.user, carbonSaved: state.user.carbonSaved + amount } 
  })),

  setActiveBin: (id) => set({ activeBinId: id }),

  collectBin: (id) => set((state) => ({
    bins: state.bins.map(b => b.id === id ? { ...b, fillLevel: 0, status: 'Active', lastCollection: new Date().toISOString() } : b)
  })),

  addBinItem: (weight, credits) => set((state) => ({
    // Simulate updating global stats
    user: { 
      ...state.user, 
      credits: state.user.credits + credits,
      carbonSaved: state.user.carbonSaved + (weight * 0.5) 
    }
  })),
}));
