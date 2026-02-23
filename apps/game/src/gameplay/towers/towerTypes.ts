export interface TowerType {
  id: string;
  name: string;
  icon: string;
  cost: number;
  color: string;
  damage: number[];
  range: number[];
  fireRate: number[];
  upgradeCosts: number[];
  projectile: string;
  splash?: number[];
  slowPower?: number;
  slowDuration?: number[];
  burnDamage?: number[];
  burnDuration?: number;
  chainTargets?: number[];
  chainRange?: number;
  critChance?: number;
}

export const HOCKEY_TOWERS: TowerType[] = [
  { id: 't1', name: 'Slap Shot', icon: '🏒', cost: 80, color: '#00d4ff', damage: [25,40,60,90], range: [2.8,3.2,3.6,4.1], fireRate: [1.2,1.4,1.7,2.0], upgradeCosts: [60,100,170], projectile: 'puck' },
  { id: 't2', name: 'Sniper', icon: '🎯', cost: 150, color: '#ef4444', damage: [70,110,165,250], range: [4.5,5.0,5.6,6.2], fireRate: [0.5,0.6,0.72,0.85], upgradeCosts: [110,190,320], projectile: 'dart' },
  { id: 't3', name: 'Enforcer', icon: '👊', cost: 120, color: '#f97316', damage: [45,70,105,160], range: [2.5,2.9,3.3,3.8], fireRate: [0.55,0.65,0.78,0.92], upgradeCosts: [90,155,260], splash: [1.2,1.5,1.8,2.2], projectile: 'hammer' },
  { id: 't4', name: 'Ice Spray', icon: '❄️', cost: 90, color: '#38bdf8', damage: [18,28,42,60], range: [3.0,3.4,3.8,4.3], fireRate: [1.3,1.55,1.8,2.1], upgradeCosts: [65,115,190], slowPower: 0.5, projectile: 'shard' },
  { id: 't5', name: 'Goalie', icon: '🥅', cost: 200, color: '#ffd700', damage: [100,155,230,350], range: [2.0,2.4,2.8,3.2], fireRate: [0.7,0.85,1.0,1.2], upgradeCosts: [140,250,420], projectile: 'glove' },
  { id: 't6', name: 'Power Play', icon: '⚡', cost: 160, color: '#a855f7', damage: [35,55,82,125], range: [3.5,4.0,4.5,5.1], fireRate: [0.85,1.0,1.15,1.35], upgradeCosts: [120,200,340], chainTargets: [2,3,4,6], chainRange: 2.2, projectile: 'lightning' },
  { id: 't7', name: 'Hot Stick', icon: '🔥', cost: 140, color: '#f97316', damage: [15,24,36,52], range: [2.6,3.0,3.4,3.9], fireRate: [3.5,4.2,5.0,6.0], upgradeCosts: [100,175,290], burnDamage: [10,16,24,35], burnDuration: 3, projectile: 'fireball' },
  { id: 't8', name: 'Captain', icon: '👑', cost: 280, color: '#fbbf24', damage: [200,320,480,720], range: [5.5,6.1,6.8,7.5], fireRate: [0.2,0.26,0.33,0.42], upgradeCosts: [200,360,600], critChance: 0.4, projectile: 'star' },
];

export const SOCCER_TOWERS: TowerType[] = [
  { id: 't1', name: 'Striker', icon: '⚽', cost: 80, color: '#22c55e', damage: [28,44,66,100], range: [2.6,3.0,3.4,3.9], fireRate: [1.15,1.35,1.6,1.9], upgradeCosts: [60,100,170], projectile: 'ball' },
  { id: 't2', name: 'Free Kick', icon: '🎯', cost: 150, color: '#fbbf24', damage: [75,118,175,265], range: [4.8,5.3,5.9,6.5], fireRate: [0.48,0.58,0.7,0.84], upgradeCosts: [110,190,320], projectile: 'curveBall' },
  { id: 't3', name: 'Header', icon: '🤕', cost: 120, color: '#3b82f6', damage: [50,78,118,178], range: [2.8,3.2,3.6,4.1], fireRate: [0.5,0.6,0.72,0.86], upgradeCosts: [90,155,260], splash: [1.3,1.6,2.0,2.4], projectile: 'headButt' },
  { id: 't4', name: 'Tackle', icon: '🦶', cost: 90, color: '#f97316', damage: [20,32,48,70], range: [2.8,3.2,3.6,4.1], fireRate: [1.25,1.48,1.72,2.0], upgradeCosts: [65,115,190], slowPower: 0.5, projectile: 'tackle' },
  { id: 't5', name: 'Keeper', icon: '🧤', cost: 200, color: '#a855f7', damage: [110,170,255,385], range: [1.8,2.2,2.6,3.0], fireRate: [0.75,0.9,1.05,1.25], upgradeCosts: [140,250,420], projectile: 'glove' },
  { id: 't6', name: 'Playmaker', icon: '🔄', cost: 160, color: '#06b6d4', damage: [38,60,90,135], range: [3.8,4.3,4.9,5.5], fireRate: [0.82,0.96,1.12,1.3], upgradeCosts: [120,200,340], chainTargets: [2,3,5,7], chainRange: 2.5, projectile: 'chain' },
  { id: 't7', name: 'Flare', icon: '🔥', cost: 140, color: '#ef4444', damage: [16,26,40,58], range: [2.4,2.8,3.2,3.7], fireRate: [3.2,3.9,4.7,5.6], upgradeCosts: [100,175,290], burnDamage: [12,18,28,40], burnDuration: 3.5, projectile: 'flare' },
  { id: 't8', name: 'Legend', icon: '👑', cost: 280, color: '#fbbf24', damage: [220,350,525,790], range: [5.2,5.8,6.5,7.2], fireRate: [0.18,0.24,0.31,0.4], upgradeCosts: [200,360,600], critChance: 0.45, projectile: 'legend' },
];
