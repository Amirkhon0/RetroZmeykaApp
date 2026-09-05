export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export type ThemeType = 'nokia' | 'gameboy' | 'amber' | 'mono' | 'neon';

export interface ThemeColors {
  id: ThemeType;
  name: string;
  bg: string;
  fg: string;
  snakeHead: string;
  snakeBody: string;
  food: string;
  bonus: string;
  wall: string;
  gridLine: string;
  bezelBg: string;
  bezelBorder: string;
  phoneBody: string;
  phoneAccent: string;
}

export type LayoutMode = 'phone' | 'touch';

export type GameMode = 'wrap' | 'walls' | 'maze';

export interface BonusItem {
  x: number;
  y: number;
  timeLeft: number; // in milliseconds
  duration: number;
  points: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface GameStats {
  highScore: number;
  gamesPlayed: number;
  applesEaten: number;
  maxSnakeLength: number;
}

export interface GameSettings {
  speed: number; // 1 (slow, ~160ms) to 9 (fast, ~50ms)
  dynamicSpeed: boolean; // speeds up as snake grows
  gameMode: GameMode;
  theme: ThemeType;
  layoutMode: LayoutMode;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
