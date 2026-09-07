/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Point,
  Direction,
  BonusItem,
  GameStatus,
  GameSettings,
  GameStats,
} from './types/game';
import {
  GRID_SIZE_X,
  GRID_SIZE_Y,
  THEMES,
  calculateTickInterval,
  getMazeWalls,
} from './utils/constants';
import { sound } from './utils/audio';
import { SnakeCanvas } from './components/SnakeCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { NokiaKeypad } from './components/NokiaKeypad';
import { TouchControls } from './components/TouchControls';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const DEFAULT_SETTINGS: GameSettings = {
  speed: 5,
  dynamicSpeed: true,
  gameMode: 'wrap',
  theme: 'nokia',
  layoutMode: 'phone',
  soundEnabled: true,
  vibrationEnabled: true,
};

const DEFAULT_STATS: GameStats = {
  highScore: 0,
  gamesPlayed: 0,
  applesEaten: 0,
  maxSnakeLength: 3,
};

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('snake_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Load stats from localStorage
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('snake_stats');
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Core Game State
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [bonus, setBonus] = useState<BonusItem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>('idle');

  // Input direction buffer (prevents rapid 180-degree self-collisions)
  const dirQueueRef = useRef<Direction[]>([]);
  const currentDirRef = useRef<Direction>('RIGHT');
  currentDirRef.current = direction;

  // Refs for current mutable state in game loop
  const snakeRef = useRef<Point[]>(snake);
  snakeRef.current = snake;

  const foodRef = useRef<Point>(food);
  foodRef.current = food;

  const bonusRef = useRef<BonusItem | null>(bonus);
  bonusRef.current = bonus;

  const scoreRef = useRef<number>(score);
  scoreRef.current = score;

  const statusRef = useRef<GameStatus>(status);
  statusRef.current = status;

  const foodsCountRef = useRef<number>(0);
  const walls = getMazeWalls(settings.gameMode);

  // Sync sound setting to audio utility
  useEffect(() => {
    sound.setSoundEnabled(settings.soundEnabled);
    sound.setVibrationEnabled(settings.vibrationEnabled);
  }, [settings.soundEnabled, settings.vibrationEnabled]);

  // Persist settings
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('snake_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Persist stats
  const saveStats = useCallback((updated: GameStats) => {
    setStats(updated);
    try {
      localStorage.setItem('snake_stats', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  // Helper to generate food position not on snake or walls
  const generateNewFood = useCallback(
    (currentSnake: Point[], currentBonus: BonusItem | null): Point => {
      const occupied = new Set<string>();
      currentSnake.forEach((p) => occupied.add(`${p.x},${p.y}`));
      walls.forEach((w) => occupied.add(`${w.x},${w.y}`));
      if (currentBonus) occupied.add(`${currentBonus.x},${currentBonus.y}`);

      const minX = settings.gameMode === 'walls' ? 1 : 0;
      const maxX = settings.gameMode === 'walls' ? GRID_SIZE_X - 2 : GRID_SIZE_X - 1;
      const minY = settings.gameMode === 'walls' ? 1 : 0;
      const maxY = settings.gameMode === 'walls' ? GRID_SIZE_Y - 2 : GRID_SIZE_Y - 1;

      const freeCells: Point[] = [];
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          if (!occupied.has(`${x},${y}`)) {
            freeCells.push({ x, y });
          }
        }
      }

      if (freeCells.length === 0) return { x: 0, y: 0 };
      const randomIndex = Math.floor(Math.random() * freeCells.length);
      return freeCells[randomIndex];
    },
    [settings.gameMode, walls]
  );

  // Direction changer with input queue buffer
  const handleDirectionChange = useCallback((newDir: Direction) => {
    const queue = dirQueueRef.current;
    const lastDir = queue.length > 0 ? queue[queue.length - 1] : currentDirRef.current;

    // Reject opposing direction (cannot reverse into yourself)
    const isOpposite =
      (newDir === 'UP' && lastDir === 'DOWN') ||
      (newDir === 'DOWN' && lastDir === 'UP') ||
      (newDir === 'LEFT' && lastDir === 'RIGHT') ||
      (newDir === 'RIGHT' && lastDir === 'LEFT');

    if (!isOpposite && queue.length < 2) {
      queue.push(newDir);
    }

    // Auto-start game if in idle state
    if (statusRef.current === 'idle') {
      setStatus('playing');
    }
  }, []);

  // Reset / Start new game
  const handleRestart = useCallback(() => {
    sound.playKeyClick();
    const newSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirQueueRef.current = [];
    currentDirRef.current = 'RIGHT';
    setDirection('RIGHT');
    setSnake(newSnake);
    setScore(0);
    setBonus(null);
    foodsCountRef.current = 0;

    const initialFood = generateNewFood(newSnake, null);
    setFood(initialFood);
    setStatus('playing');
  }, [generateNewFood]);

  // Pause / Resume toggle
  const handlePauseToggle = useCallback(() => {
    sound.playKeyClick();
    if (statusRef.current === 'idle' || statusRef.current === 'gameover') {
      handleRestart();
    } else if (statusRef.current === 'playing') {
      setStatus('paused');
    } else if (statusRef.current === 'paused') {
      setStatus('playing');
    }
  }, [handleRestart]);

  // Handle Game Over
  const triggerGameOver = useCallback(() => {
    sound.playCrash();
    setStatus('gameover');

    const finalScore = scoreRef.current;
    const currentSnakeLen = snakeRef.current.length;
    const isNewHighScore = finalScore > stats.highScore;

    if (isNewHighScore && finalScore > 0) {
      sound.playHighScore();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }

    saveStats({
      highScore: Math.max(stats.highScore, finalScore),
      gamesPlayed: stats.gamesPlayed + 1,
      applesEaten: stats.applesEaten + foodsCountRef.current,
      maxSnakeLength: Math.max(stats.maxSnakeLength, currentSnakeLen),
    });
  }, [stats, saveStats]);

  // Main Game Loop
  useEffect(() => {
    if (status !== 'playing') return;

    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      // Dequeue next direction if available
      let nextDir = currentDirRef.current;
      if (dirQueueRef.current.length > 0) {
        nextDir = dirQueueRef.current.shift()!;
        currentDirRef.current = nextDir;
        setDirection(nextDir);
      }

      const currentSnake = snakeRef.current;
      const head = currentSnake[0];
      let newX = head.x;
      let newY = head.y;

      if (nextDir === 'UP') newY -= 1;
      else if (nextDir === 'DOWN') newY += 1;
      else if (nextDir === 'LEFT') newX -= 1;
      else if (nextDir === 'RIGHT') newX += 1;

      // Handle Wall and Wrap Boundaries
      if (settings.gameMode === 'wrap') {
        newX = (newX + GRID_SIZE_X) % GRID_SIZE_X;
        newY = (newY + GRID_SIZE_Y) % GRID_SIZE_Y;
      } else if (settings.gameMode === 'walls') {
        if (newX <= 0 || newX >= GRID_SIZE_X - 1 || newY <= 0 || newY >= GRID_SIZE_Y - 1) {
          triggerGameOver();
          return;
        }
      } else if (settings.gameMode === 'maze') {
        if (newX < 0 || newX >= GRID_SIZE_X || newY < 0 || newY >= GRID_SIZE_Y) {
          triggerGameOver();
          return;
        }
        // Check collision with maze walls
        const hitMazeWall = walls.some((w) => w.x === newX && w.y === newY);
        if (hitMazeWall) {
          triggerGameOver();
          return;
        }
      }

      // Check self-collision (exclude tail tip because it will move unless eating)
      const isEating = newX === foodRef.current.x && newY === foodRef.current.y;
      const isEatingBonus =
        bonusRef.current && newX === bonusRef.current.x && newY === bonusRef.current.y;

      const bodyToCheck = isEating ? currentSnake : currentSnake.slice(0, -1);
      const hitSelf = bodyToCheck.some((seg) => seg.x === newX && seg.y === newY);
      if (hitSelf) {
        triggerGameOver();
        return;
      }

      const newHead: Point = { x: newX, y: newY };
      const newSnake = [newHead, ...currentSnake];

      // Eating regular food
      if (isEating) {
        sound.playEatFood();
        foodsCountRef.current += 1;
        const pts = 10 * settings.speed;
        const newScore = scoreRef.current + pts;
        setScore(newScore);

        // Check if bonus bug should spawn (every 5 apples)
        let activeBonus = bonusRef.current;
        if (foodsCountRef.current % 5 === 0 && !activeBonus) {
          sound.playBonusSpawn();
          const bonusPos = generateNewFood(newSnake, null);
          activeBonus = {
            x: bonusPos.x,
            y: bonusPos.y,
            timeLeft: 10000,
            duration: 10000,
            points: 50 * settings.speed,
          };
          setBonus(activeBonus);
        }

        const newFoodPos = generateNewFood(newSnake, activeBonus);
        setFood(newFoodPos);
      } else if (isEatingBonus && bonusRef.current) {
        // Eating bonus bug
        sound.playEatBonus();
        const bonusPts = bonusRef.current.points;
        setScore((prev) => prev + bonusPts);
        setBonus(null);
        newSnake.pop(); // snake does not grow from bonus, only points!
      } else {
        // Normal move
        newSnake.pop();
      }

      setSnake(newSnake);

      // Schedule next tick
      const interval = calculateTickInterval(
        settings.speed,
        newSnake.length,
        settings.dynamicSpeed
      );
      timeoutId = setTimeout(tick, interval);
    };

    const initialInterval = calculateTickInterval(
      settings.speed,
      snakeRef.current.length,
      settings.dynamicSpeed
    );
    timeoutId = setTimeout(tick, initialInterval);

    return () => clearTimeout(timeoutId);
  }, [status, settings.speed, settings.dynamicSpeed, settings.gameMode, walls, generateNewFood, triggerGameOver]);

  // Bonus countdown timer
  useEffect(() => {
    if (status !== 'playing' || !bonus) return;

    const timer = setInterval(() => {
      setBonus((prev) => {
        if (!prev) return null;
        const nextTime = prev.timeLeft - 200;
        if (nextTime <= 0) return null;
        return { ...prev, timeLeft: nextTime };
      });
    }, 200);

    return () => clearInterval(timer);
  }, [status, bonus]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scroll on arrow keys / space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
        case 'Numpad8':
          handleDirectionChange('UP');
          break;
        case 'ArrowDown':
        case 'KeyS':
        case 'Numpad2':
          handleDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
        case 'KeyA':
        case 'Numpad4':
          handleDirectionChange('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
        case 'Numpad6':
          handleDirectionChange('RIGHT');
          break;
        case 'Space':
        case 'KeyP':
        case 'Numpad5':
          handlePauseToggle();
          break;
        case 'KeyR':
        case 'Enter':
          handleRestart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionChange, handlePauseToggle, handleRestart]);

  const currentTheme = THEMES[settings.theme];

  return (
    <main className="h-full h-[100dvh] w-full bg-stone-950 flex flex-col items-center justify-center p-1 sm:p-2 pt-[max(0.25rem,env(safe-area-inset-top))] pb-[max(0.25rem,env(safe-area-inset-bottom))] text-stone-100 font-sans select-none overflow-hidden">
      {/* Main Game Shell */}
      {settings.layoutMode === 'phone' ? (
        /* ================= AUTHENTIC NOKIA 3310 PHONE BODY ================= */
        <div
          id="phone-casing"
          style={{
            backgroundColor: currentTheme.phoneBody,
            borderColor: '#182030',
          }}
          className="w-full max-w-[390px] rounded-[36px] p-2.5 sm:p-3.5 border-4 shadow-2xl flex flex-col items-center justify-between transition-colors relative my-auto shrink"
        >
          {/* Top Speaker Earpiece Grille & Metallic Logo */}
          <div className="w-full flex flex-col items-center pt-0.5 pb-1 sm:pb-2">
            {/* Earpiece slit */}
            <div className="flex gap-1.5 mb-1 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-inner" />
              <div className="w-6 h-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-inner" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-inner" />
            </div>

            {/* Silver NOKIA Badge */}
            <div
              style={{ color: currentTheme.phoneAccent }}
              className="text-[11px] sm:text-xs font-mono font-black tracking-[0.25em] opacity-90 drop-shadow"
            >
              NOKIA
            </div>
          </div>

          {/* Screen Outer Bezel */}
          <div
            id="screen-outer-bezel"
            style={{
              backgroundColor: currentTheme.bezelBg,
              borderColor: currentTheme.bezelBorder,
            }}
            className="w-full rounded-[18px] p-2 sm:p-2.5 border-2 shadow-inner"
          >
            {/* Scoreboard and Status Bar */}
            <ScoreBoard
              score={score}
              highScore={stats.highScore}
              speed={settings.speed}
              snakeLength={snake.length}
              gameMode={settings.gameMode}
              status={status}
              theme={currentTheme}
              soundEnabled={settings.soundEnabled}
              onToggleSound={() => {
                const next = !settings.soundEnabled;
                handleUpdateSettings({ soundEnabled: next });
                sound.setSoundEnabled(next);
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenStats={() => setIsStatsOpen(true)}
              layoutMode={settings.layoutMode}
              onToggleLayout={() =>
                handleUpdateSettings({
                  layoutMode: settings.layoutMode === 'phone' ? 'touch' : 'phone',
                })
              }
            />

            {/* Snake Matrix Screen Canvas */}
            <div className="mt-1">
              <SnakeCanvas
                snake={snake}
                food={food}
                bonus={bonus}
                walls={walls}
                direction={direction}
                gameMode={settings.gameMode}
                status={status}
                theme={currentTheme}
                score={score}
                highScore={stats.highScore}
                onRestart={handleRestart}
                onResume={handlePauseToggle}
                onSwipe={handleDirectionChange}
              />
            </div>
          </div>

          {/* Nokia Keypad */}
          <div className="w-full mt-1 sm:mt-1.5">
            <NokiaKeypad
              onDirection={handleDirectionChange}
              onPauseToggle={handlePauseToggle}
              onRestart={handleRestart}
              status={status}
              phoneAccent={currentTheme.phoneAccent}
            />
          </div>
        </div>
      ) : (
        /* ================= MODERN ARCADE TOUCH SCREEN ================= */
        <div
          id="touch-arcade-casing"
          className="w-full max-w-[400px] bg-stone-900 border border-stone-800 rounded-3xl p-2.5 sm:p-3 shadow-2xl flex flex-col items-center justify-between my-auto shrink"
        >
          {/* LCD Screen Container */}
          <div
            id="screen-arcade-bezel"
            style={{
              backgroundColor: currentTheme.bezelBg,
              borderColor: currentTheme.bezelBorder,
            }}
            className="w-full rounded-2xl p-2 sm:p-2.5 border-2 shadow-inner"
          >
            <ScoreBoard
              score={score}
              highScore={stats.highScore}
              speed={settings.speed}
              snakeLength={snake.length}
              gameMode={settings.gameMode}
              status={status}
              theme={currentTheme}
              soundEnabled={settings.soundEnabled}
              onToggleSound={() => {
                const next = !settings.soundEnabled;
                handleUpdateSettings({ soundEnabled: next });
                sound.setSoundEnabled(next);
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenStats={() => setIsStatsOpen(true)}
              layoutMode={settings.layoutMode}
              onToggleLayout={() =>
                handleUpdateSettings({
                  layoutMode: settings.layoutMode === 'phone' ? 'touch' : 'phone',
                })
              }
            />

            <div className="mt-1">
              <SnakeCanvas
                snake={snake}
                food={food}
                bonus={bonus}
                walls={walls}
                direction={direction}
                gameMode={settings.gameMode}
                status={status}
                theme={currentTheme}
                score={score}
                highScore={stats.highScore}
                onRestart={handleRestart}
                onResume={handlePauseToggle}
                onSwipe={handleDirectionChange}
              />
            </div>
          </div>

          {/* Virtual D-pad controls */}
          <div className="w-full mt-1 sm:mt-2">
            <TouchControls
              onDirection={handleDirectionChange}
              onPauseToggle={handlePauseToggle}
              onRestart={handleRestart}
              status={status}
            />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenPrivacyPolicy={() => {
          setIsSettingsOpen(false);
          setIsPrivacyOpen(true);
        }}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Stats & Records Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={() => {
          saveStats(DEFAULT_STATS);
        }}
      />
    </main>
  );
}
