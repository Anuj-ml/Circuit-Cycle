import { Bin, LeaderboardEntry, ScannedItem, User } from './types';

export const MOCK_USER: User = {
  id: 'u_001',
  name: 'CyberScavenger',
  credits: 1250,
  carbonSaved: 45.2,
  rank: 'Technomancer',
  neighborhood: 'Sector 7 (North)'
};

export const MOCK_BINS: Bin[] = [
  { id: 'b_101', lat: 40.7128, lng: -74.0060, type: 'Mobile', fillLevel: 45, status: 'Active', address: 'Times Square Nexus' },
  { id: 'b_102', lat: 40.7138, lng: -74.0070, type: 'Battery', fillLevel: 92, status: 'Full', address: 'Broadway Junction' },
  { id: 'b_103', lat: 40.7118, lng: -74.0050, type: 'General', fillLevel: 12, status: 'Active', address: 'Wall St. Terminal' },
  { id: 'b_104', lat: 40.7148, lng: -74.0080, type: 'Mobile', fillLevel: 78, status: 'Maintenance', address: 'Hell\'s Kitchen Outpost' },
  { id: 'b_105', lat: 40.7108, lng: -74.0040, type: 'Battery', fillLevel: 30, status: 'Active', address: 'Seaport Dock' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { neighborhood: 'Sector 7 (North)', score: 12500, trend: 'up' },
  { neighborhood: 'Sector 4 (South)', score: 11200, trend: 'down' },
  { neighborhood: 'Sector 1 (East)', score: 9800, trend: 'stable' },
  { neighborhood: 'Sector 9 (West)', score: 8500, trend: 'up' },
];

export const POTENTIAL_SCANS: ScannedItem[] = [
  { 
    id: 'item_1', name: 'iPhone 11', category: 'Phone', condition: 'Broken', 
    estimatedValue: 150, carbonValue: 5.2, repairable: true, 
    repairShops: ['FixIt Felix - 0.2km', 'TechHealers - 0.5km'] 
  },
  { 
    id: 'item_2', name: 'AA Battery (Pack)', category: 'Battery', condition: 'Damaged', 
    estimatedValue: 10, carbonValue: 0.5, repairable: false 
  },
  { 
    id: 'item_3', name: 'MacBook Pro 2015', category: 'Laptop', condition: 'Good', 
    estimatedValue: 500, carbonValue: 12.0, repairable: true,
    repairShops: ['Apple Genius Bar - 1.2km', 'Laptop Lazrus - 0.8km']
  },
  { 
    id: 'item_4', name: 'USB-C Cable', category: 'Cable', condition: 'Broken', 
    estimatedValue: 5, carbonValue: 0.1, repairable: false 
  },
];
