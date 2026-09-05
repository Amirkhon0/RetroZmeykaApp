import { ThemeColors, ThemeType, Point, GameMode } from '../types/game';

export const GRID_SIZE_X = 20;
export const GRID_SIZE_Y = 20;

export const THEMES: Record<ThemeType, ThemeColors> = {
  nokia: {
    id: 'nokia',
    name: 'Nokia 3310',
    bg: '#9bbc0f',
    fg: '#0f380f',
    snakeHead: '#0f380f',
    snakeBody: '#0f380f',
    food: '#0f380f',
    bonus: '#0f380f',
    wall: '#0f380f',
    gridLine: 'rgba(15, 56, 15, 0.08)',
    bezelBg: '#8bac0f',
    bezelBorder: '#306230',
    phoneBody: '#2a3b5c', // Classic Nokia navy blue
    phoneAccent: '#9fa8da',
  },
  gameboy: {
    id: 'gameboy',
    name: 'Game Boy',
    bg: '#8bac0f',
    fg: '#0f380f',
    snakeHead: '#0f380f',
    snakeBody: '#306230',
    food: '#0f380f',
    bonus: '#8b0000',
    wall: '#0f380f',
    gridLine: 'rgba(15, 56, 15, 0.08)',
    bezelBg: '#7b9c0e',
    bezelBorder: '#285228',
    phoneBody: '#c4c2ba', // Game Boy classic off-white
    phoneAccent: '#8b1d40',
  },
  amber: {
    id: 'amber',
    name: 'Янтарь CRT',
    bg: '#1a1103',
    fg: '#ffb000',
    snakeHead: '#ffc83b',
    snakeBody: '#ff9900',
    food: '#ffdd55',
    bonus: '#ff3b30',
    wall: '#d97706',
    gridLine: 'rgba(255, 176, 0, 0.06)',
    bezelBg: '#231805',
    bezelBorder: '#78350f',
    phoneBody: '#292524',
    phoneAccent: '#f59e0b',
  },
  mono: {
    id: 'mono',
    name: 'Монохром',
    bg: '#d1d5db',
    fg: '#111827',
    snakeHead: '#000000',
    snakeBody: '#1f2937',
    food: '#111827',
    bonus: '#4b5563',
    wall: '#111827',
    gridLine: 'rgba(0, 0, 0, 0.06)',
    bezelBg: '#9ca3af',
    bezelBorder: '#4b5563',
    phoneBody: '#1e293b',
    phoneAccent: '#64748b',
  },
  neon: {
    id: 'neon',
    name: 'Неон Кибер',
    bg: '#090d16',
    fg: '#10b981',
    snakeHead: '#34d399',
    snakeBody: '#059669',
    food: '#ec4899',
    bonus: '#fbbf24',
    wall: '#6366f1',
    gridLine: 'rgba(16, 185, 129, 0.08)',
    bezelBg: '#0f172a',
    bezelBorder: '#1e293b',
    phoneBody: '#111827',
    phoneAccent: '#38bdf8',
  },
};

// Calculate game tick interval in ms given speed level (1 = 170ms, 9 = 50ms)
export function calculateTickInterval(speedLevel: number, snakeLength: number, dynamic: boolean): number {
  const baseSpeed = 180 - speedLevel * 14; // speed 1 -> 166ms, speed 5 -> 110ms, speed 9 -> 54ms
  if (!dynamic) return Math.max(45, baseSpeed);
  // With dynamic speed: every 4 snake segments decrease interval by 2ms
  const reduction = Math.min(40, Math.floor((snakeLength - 3) / 3) * 2);
  return Math.max(40, baseSpeed - reduction);
}

// Predefined maze walls for Maze game mode
export function getMazeWalls(mode: GameMode): Point[] {
  if (mode !== 'maze') return [];
  const walls: Point[] = [];

  // 4 corner barriers like classic Nokia Snake II labyrinth
  for (let i = 3; i <= 6; i++) {
    walls.push({ x: 4, y: i });
    walls.push({ x: 15, y: i });
    walls.push({ x: 4, y: 19 - i });
    walls.push({ x: 15, y: 19 - i });
  }

  // Center plus/divider with gap
  for (let x = 8; x <= 11; x++) {
    walls.push({ x, y: 6 });
    walls.push({ x, y: 13 });
  }

  return walls;
}
