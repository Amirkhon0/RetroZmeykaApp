import React, { useEffect, useRef } from 'react';
import { Point, Direction, BonusItem, GameMode, GameStatus, ThemeColors } from '../types/game';
import { GRID_SIZE_X, GRID_SIZE_Y } from '../utils/constants';

interface SnakeCanvasProps {
  snake: Point[];
  food: Point;
  bonus: BonusItem | null;
  walls: Point[];
  direction: Direction;
  gameMode: GameMode;
  status: GameStatus;
  theme: ThemeColors;
  score: number;
  highScore: number;
  onRestart: () => void;
  onResume: () => void;
  onSwipe: (dir: Direction) => void;
}

export const SnakeCanvas: React.FC<SnakeCanvasProps> = ({
  snake,
  food,
  bonus,
  walls,
  direction,
  gameMode,
  status,
  theme,
  score,
  highScore,
  onRestart,
  onResume,
  onSwipe,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Render game frame on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physical pixel size vs display size
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear background with theme color
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const cellW = displayWidth / GRID_SIZE_X;
    const cellH = displayHeight / GRID_SIZE_Y;
    const padding = 1; // 1px pixel gap for authentic LCD matrix

    // Subtle LCD dot matrix background grid
    ctx.fillStyle = theme.gridLine;
    for (let x = 0; x < GRID_SIZE_X; x++) {
      for (let y = 0; y < GRID_SIZE_Y; y++) {
        ctx.fillRect(x * cellW + padding, y * cellH + padding, cellW - padding * 2, cellH - padding * 2);
      }
    }

    // Draw solid border walls if game mode is 'walls'
    if (gameMode === 'walls') {
      ctx.fillStyle = theme.wall;
      // Top & bottom
      for (let x = 0; x < GRID_SIZE_X; x++) {
        drawPixelBlock(ctx, x, 0, cellW, cellH, padding, theme.wall);
        drawPixelBlock(ctx, x, GRID_SIZE_Y - 1, cellW, cellH, padding, theme.wall);
      }
      // Left & right
      for (let y = 0; y < GRID_SIZE_Y; y++) {
        drawPixelBlock(ctx, 0, y, cellW, cellH, padding, theme.wall);
        drawPixelBlock(ctx, GRID_SIZE_X - 1, y, cellW, cellH, padding, theme.wall);
      }
    }

    // Draw maze walls
    if (walls.length > 0) {
      walls.forEach((w) => {
        drawPixelBlock(ctx, w.x, w.y, cellW, cellH, padding, theme.wall);
      });
    }

    // Draw regular food (classic pixel apple with dot stem)
    drawFood(ctx, food.x, food.y, cellW, cellH, theme.food);

    // Draw bonus insect if active
    if (bonus) {
      const isFlashing = bonus.timeLeft < 3000 && Math.floor(bonus.timeLeft / 200) % 2 === 0;
      if (!isFlashing) {
        drawBonusBug(ctx, bonus.x, bonus.y, cellW, cellH, theme.bonus);
      }
    }

    // Draw snake body
    for (let i = snake.length - 1; i > 0; i--) {
      const seg = snake[i];
      drawPixelBlock(ctx, seg.x, seg.y, cellW, cellH, padding, theme.snakeBody);
    }

    // Draw snake head with directional eyes
    if (snake.length > 0) {
      const head = snake[0];
      drawSnakeHead(ctx, head.x, head.y, cellW, cellH, direction, theme);
    }

    // Bonus countdown bar at bottom edge if active
    if (bonus) {
      const progress = Math.max(0, bonus.timeLeft / bonus.duration);
      const barH = 3;
      ctx.fillStyle = theme.bonus;
      ctx.fillRect(0, displayHeight - barH, displayWidth * progress, barH);
    }

    // Overlay screen when paused
    if (status === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      ctx.fillStyle = theme.bg;
      ctx.strokeStyle = theme.fg;
      ctx.lineWidth = 2;
      const boxW = 180;
      const boxH = 64;
      const bx = (displayWidth - boxW) / 2;
      const by = (displayHeight - boxH) / 2;
      ctx.fillRect(bx, by, boxW, boxH);
      ctx.strokeRect(bx, by, boxW, boxH);

      ctx.fillStyle = theme.fg;
      ctx.font = 'bold 16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ПАУЗА', displayWidth / 2, displayHeight / 2 - 8);

      ctx.font = '12px "VT323", monospace';
      ctx.fillText('Нажмите для продолжения', displayWidth / 2, displayHeight / 2 + 16);
    }

    // Overlay screen when gameover
    if (status === 'gameover') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      const isNewRecord = score > 0 && score >= highScore;
      ctx.fillStyle = theme.bg;
      ctx.strokeStyle = theme.fg;
      ctx.lineWidth = 2;
      const boxW = 220;
      const boxH = 100;
      const bx = (displayWidth - boxW) / 2;
      const by = (displayHeight - boxH) / 2;
      ctx.fillRect(bx, by, boxW, boxH);
      ctx.strokeRect(bx, by, boxW, boxH);

      ctx.fillStyle = theme.fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 14px "Press Start 2P", monospace';
      ctx.fillText('КОНЕЦ ИГРЫ', displayWidth / 2, by + 22);

      ctx.font = '16px "VT323", monospace';
      ctx.fillText(`СЧЕТ: ${score}`, displayWidth / 2, by + 46);

      if (isNewRecord) {
        ctx.font = 'bold 12px "Press Start 2P", monospace';
        ctx.fillText('★ НОВЫЙ РЕКОРД! ★', displayWidth / 2, by + 68);
      } else {
        ctx.font = '14px "VT323", monospace';
        ctx.fillText(`РЕКОРД: ${highScore}`, displayWidth / 2, by + 66);
      }

      ctx.font = '13px "VT323", monospace';
      ctx.fillText('Нажмите чтобы играть снова', displayWidth / 2, by + 86);
    }

    ctx.restore();
  }, [snake, food, bonus, walls, direction, gameMode, status, theme, score, highScore]);

  // Touch handlers for fluid mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;

    if (status === 'gameover') {
      onRestart();
      return;
    }
    if (status === 'paused') {
      onResume();
      return;
    }

    // Minimum swipe threshold (15px)
    if (dist >= 15 && dt < 800) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(dy > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  const handleClick = () => {
    if (status === 'gameover') {
      onRestart();
    } else if (status === 'paused') {
      onResume();
    }
  };

  return (
    <div
      ref={containerRef}
      id="snake-canvas-container"
      className="relative w-full aspect-square max-w-[420px] mx-auto rounded-md overflow-hidden cursor-pointer shadow-inner touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        id="snake-viewport-canvas"
        className="w-full h-full block"
      />
      {/* Scanline CRT / LCD texture overlay */}
      <div className="absolute inset-0 pointer-events-none lcd-scanlines opacity-25" />
    </div>
  );
};

// Helper: draw pixel block with 1px inset
function drawPixelBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pad: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x * w + pad, y * h + pad, w - pad * 2, h - pad * 2);
}

// Helper: draw authentic pixel food
function drawFood(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  const px = x * w;
  const py = y * h;
  ctx.fillStyle = color;

  // Pixel apple shape
  ctx.fillRect(px + w * 0.2, py + h * 0.25, w * 0.6, h * 0.65);
  // Stem
  ctx.fillRect(px + w * 0.45, py + h * 0.08, w * 0.12, h * 0.2);
}

// Helper: draw bonus insect / bug
function drawBonusBug(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  const px = x * w;
  const py = y * h;
  ctx.fillStyle = color;

  // Bug body
  ctx.fillRect(px + w * 0.2, py + h * 0.2, w * 0.6, h * 0.6);
  // Legs / antennae
  ctx.fillRect(px + w * 0.1, py + h * 0.3, w * 0.1, h * 0.1);
  ctx.fillRect(px + w * 0.8, py + h * 0.3, w * 0.1, h * 0.1);
  ctx.fillRect(px + w * 0.1, py + h * 0.6, w * 0.1, h * 0.1);
  ctx.fillRect(px + w * 0.8, py + h * 0.6, w * 0.1, h * 0.1);
  // Antennae
  ctx.fillRect(px + w * 0.25, py + h * 0.08, w * 0.1, h * 0.12);
  ctx.fillRect(px + w * 0.65, py + h * 0.08, w * 0.1, h * 0.12);
}

// Helper: draw snake head with directional eyes
function drawSnakeHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  dir: Direction,
  theme: ThemeColors
) {
  const px = x * w;
  const py = y * h;

  // Main head block
  ctx.fillStyle = theme.snakeHead;
  ctx.fillRect(px + 1, py + 1, w - 2, h - 2);

  // Directional eyes in background color
  ctx.fillStyle = theme.bg;
  const eyeSize = Math.max(2, Math.floor(w * 0.18));

  if (dir === 'UP') {
    ctx.fillRect(px + w * 0.25, py + h * 0.2, eyeSize, eyeSize);
    ctx.fillRect(px + w * 0.6, py + h * 0.2, eyeSize, eyeSize);
  } else if (dir === 'DOWN') {
    ctx.fillRect(px + w * 0.25, py + h * 0.65, eyeSize, eyeSize);
    ctx.fillRect(px + w * 0.6, py + h * 0.65, eyeSize, eyeSize);
  } else if (dir === 'LEFT') {
    ctx.fillRect(px + w * 0.2, py + h * 0.25, eyeSize, eyeSize);
    ctx.fillRect(px + w * 0.2, py + h * 0.6, eyeSize, eyeSize);
  } else {
    // RIGHT
    ctx.fillRect(px + w * 0.65, py + h * 0.25, eyeSize, eyeSize);
    ctx.fillRect(px + w * 0.65, py + h * 0.6, eyeSize, eyeSize);
  }
}
