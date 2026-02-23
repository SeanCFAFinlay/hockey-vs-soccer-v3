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

export const HOCKEY_ENEMIES: EnemyType[] = [
  { id: 'e1', name: 'Puck', hp: 50, speed: 2.4, reward: 10, size: 1.0 },
  { id: 'e2', name: 'Hot Puck', hp: 70, speed: 2.0, reward: 15, fire: true, size: 1.0 },
  { id: 'e3', name: 'Flying Puck', hp: 45, speed: 2.8, reward: 12, flying: true, size: 0.9 },
  { id: 'e4', name: 'Heavy Puck', hp: 250, speed: 0.7, reward: 35, armor: 0.4, size: 1.4 },
  { id: 'e5', name: 'Inferno Puck', hp: 400, speed: 0.55, reward: 55, fire: true, armor: 0.3, size: 1.5 },
  { id: 'e6', name: 'Flying Fire', hp: 120, speed: 2.2, reward: 25, flying: true, fire: true, size: 1.0 },
  { id: 'e7', name: 'Boss Puck', hp: 2500, speed: 0.35, reward: 350, armor: 0.35, boss: true, size: 2.2 },
];

export const SOCCER_ENEMIES: EnemyType[] = [
  { id: 'e1', name: 'Ball', hp: 45, speed: 2.5, reward: 10, size: 1.0 },
  { id: 'e2', name: 'Fire Ball', hp: 65, speed: 2.1, reward: 15, fire: true, size: 1.0 },
  { id: 'e3', name: 'Flying Ball', hp: 40, speed: 3.0, reward: 12, flying: true, size: 0.9 },
  { id: 'e4', name: 'Heavy Ball', hp: 280, speed: 0.65, reward: 35, armor: 0.45, size: 1.4 },
  { id: 'e5', name: 'Inferno Ball', hp: 450, speed: 0.5, reward: 55, fire: true, armor: 0.35, size: 1.5 },
  { id: 'e6', name: 'Flying Fire', hp: 130, speed: 2.3, reward: 25, flying: true, fire: true, size: 1.0 },
  { id: 'e7', name: 'Boss Ball', hp: 2800, speed: 0.32, reward: 400, armor: 0.38, boss: true, size: 2.2 },
];
