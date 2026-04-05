export interface EnemyType {
  id: string;
  name: string;
  hp: number;
  speed: number;
  reward: number;
  size: number;
  armor?: number;
  fire?: boolean;
  flying?: boolean;
  boss?: boolean;
}

// Hockey theme: Fast-paced, high-speed units
export const HOCKEY_ENEMIES: EnemyType[] = [
  { id: 'e1', name: 'Puck', hp: 40, speed: 2.8, reward: 10, size: 0.9 },
  { id: 'e2', name: 'Skater', hp: 85, speed: 2.5, reward: 15, size: 1.1 },
  { id: 'e3', name: 'Speed Winger', hp: 50, speed: 3.5, reward: 18, size: 0.95 },
  { id: 'e4', name: 'Defense', hp: 300, speed: 1.2, reward: 40, armor: 0.5, size: 1.5 },
  { id: 'e5', name: 'Hot Puck', hp: 120, speed: 2.2, reward: 22, fire: true, size: 1.0 },
  { id: 'e6', name: 'Flying Puck', hp: 60, speed: 3.2, reward: 20, flying: true, size: 0.85 },
  { id: 'e7', name: 'Enforcer', hp: 220, speed: 1.8, reward: 35, armor: 0.4, size: 1.3 },
  { id: 'e8', name: 'Power Forward', hp: 180, speed: 2.0, reward: 30, fire: true, size: 1.2 },
  { id: 'e9', name: 'Goalie', hp: 500, speed: 0.9, reward: 60, armor: 0.55, size: 1.6 },
  { id: 'e10', name: 'Flying Fire', hp: 140, speed: 2.8, reward: 28, flying: true, fire: true, size: 1.0 },
  { id: 'e11', name: 'Boss: Stanley', hp: 2500, speed: 0.5, reward: 400, armor: 0.4, boss: true, size: 2.4 },
];

// Soccer theme: Slower build-up, more HP, tactical positioning
export const SOCCER_ENEMIES: EnemyType[] = [
  { id: 'e1', name: 'Ball', hp: 55, speed: 2.2, reward: 10, size: 1.0 },
  { id: 'e2', name: 'Ball Runner', hp: 100, speed: 2.0, reward: 16, size: 1.1 },
  { id: 'e3', name: 'Striker', hp: 90, speed: 2.6, reward: 20, size: 1.05 },
  { id: 'e4', name: 'Defender', hp: 350, speed: 1.0, reward: 45, armor: 0.55, size: 1.6 },
  { id: 'e5', name: 'Fire Ball', hp: 140, speed: 1.9, reward: 24, fire: true, size: 1.05 },
  { id: 'e6', name: 'Flying Ball', hp: 70, speed: 2.8, reward: 22, flying: true, size: 0.9 },
  { id: 'e7', name: 'Playmaker', hp: 160, speed: 2.1, reward: 28, size: 1.15 },
  { id: 'e8', name: 'Midfielder', hp: 200, speed: 1.7, reward: 32, armor: 0.35, size: 1.25 },
  { id: 'e9', name: 'Heavy Ball', hp: 550, speed: 0.8, reward: 65, armor: 0.6, size: 1.7 },
  { id: 'e10', name: 'Flying Fire', hp: 150, speed: 2.5, reward: 30, flying: true, fire: true, size: 1.0 },
  { id: 'e11', name: 'Boss: Champion', hp: 3200, speed: 0.4, reward: 450, armor: 0.45, boss: true, size: 2.6 },
];
