export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  BIN_KIOSK = 'BIN_KIOSK'
}

export interface User {
  id: string;
  name: string;
  credits: number; // EcoCoins
  carbonSaved: number; // kg
  rank: string;
  neighborhood: string;
}

export interface Bin {
  id: string;
  lat: number;
  lng: number;
  type: 'General' | 'Battery' | 'Mobile';
  fillLevel: number; // 0-100
  status: 'Active' | 'Full' | 'Maintenance';
  address: string;
  lastCollection?: string;
}

export interface ScannedItem {
  id: string;
  name: string;
  category: 'Phone' | 'Battery' | 'Laptop' | 'Cable' | 'Peripheral';
  condition: 'Good' | 'Damaged' | 'Broken';
  estimatedValue: number;
  carbonValue: number;
  repairable: boolean;
  repairShops?: string[];
}

export interface LeaderboardEntry {
  neighborhood: string;
  score: number; // Total weight recycled
  trend: 'up' | 'down' | 'stable';
}

export interface Transaction {
  id: string;
  timestamp: string;
  item: string;
  weight: number;
  credits: number;
}