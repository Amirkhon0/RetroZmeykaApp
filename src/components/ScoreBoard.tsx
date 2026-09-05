import React from 'react';
import { ThemeColors, GameMode, GameStatus } from '../types/game';
import { Volume2, VolumeX, Smartphone, Gamepad2, Settings, Trophy } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  speed: number;
  snakeLength: number;
  gameMode: GameMode;
  status: GameStatus;
  theme: ThemeColors;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  layoutMode: 'phone' | 'touch';
  onToggleLayout: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  speed,
  snakeLength,
  gameMode,
  status,
  theme,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenStats,
  layoutMode,
  onToggleLayout,
}) => {
  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'wrap':
        return 'БЕЗ СТЕН';
      case 'walls':
        return 'СО СТЕНАМИ';
      case 'maze':
        return 'ЛАБИРИНТ';
    }
  };

  return (
    <div
      id="retro-scoreboard"
      style={{
        backgroundColor: theme.bg,
        color: theme.fg,
        borderColor: theme.wall,
      }}
      className="w-full max-w-[420px] mx-auto px-3 py-2 border-b-2 font-lcd tracking-wide transition-colors select-none"
    >
      {/* Top Retro Phone Status Bar (Signal bars, Title, Battery) */}
      <div className="flex items-center justify-between text-xs mb-1.5 opacity-90 border-b pb-1 border-current/20">
        {/* Signal Bars */}
        <div className="flex items-end gap-[2px] h-3.5" title="Сеть Nokia">
          <div className="w-[3px] h-1.5 bg-current" />
          <div className="w-[3px] h-2 bg-current" />
          <div className="w-[3px] h-2.5 bg-current" />
          <div className="w-[3px] h-3.5 bg-current" />
          <span className="text-[10px] ml-1 font-mono tracking-tighter">GSM</span>
        </div>

        {/* Game Mode / Status */}
        <div className="text-[11px] font-retro tracking-widest uppercase flex items-center gap-1.5">
          <span>{getModeLabel(gameMode)}</span>
          {status === 'paused' && (
            <span className="animate-pulse bg-current text-white px-1 py-0.2 text-[9px] rounded-xs" style={{ color: theme.bg }}>
              ПАУЗА
            </span>
          )}
        </div>

        {/* Battery Indicator */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono">100%</span>
          <div className="w-5 h-2.5 border border-current p-[1px] flex gap-[1px]">
            <div className="w-full h-full bg-current" />
          </div>
        </div>
      </div>

      {/* Main Score Metrics */}
      <div className="flex items-center justify-between font-mono">
        <div className="flex flex-col">
          <span className="text-[11px] tracking-wider uppercase opacity-80">СЧЕТ</span>
          <span className="text-2xl font-lcd font-bold leading-none">{score}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] tracking-wider uppercase opacity-80">ДЛИНА</span>
          <span className="text-xl font-lcd font-bold leading-none">{snakeLength}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] tracking-wider uppercase opacity-80">СКОРОСТЬ</span>
          <span className="text-xl font-lcd font-bold leading-none">{speed}</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[11px] tracking-wider uppercase opacity-80">РЕКОРД</span>
          <span className="text-2xl font-lcd font-bold leading-none">{highScore}</span>
        </div>
      </div>

      {/* Quick Action bar icons */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/20 text-xs">
        <button
          id="btn-sound-toggle"
          onClick={onToggleSound}
          className="flex items-center gap-1 hover:opacity-75 transition-opacity px-1.5 py-0.5 rounded"
          title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
          <span className="text-[11px]">{soundEnabled ? 'ЗВУК' : 'БЕЗ ЗВУКА'}</span>
        </button>

        <button
          id="btn-layout-toggle"
          onClick={onToggleLayout}
          className="flex items-center gap-1 hover:opacity-75 transition-opacity px-1.5 py-0.5 rounded"
          title="Переключить вид (Телефон / Сенсорный)"
        >
          {layoutMode === 'phone' ? <Smartphone className="w-3.5 h-3.5" /> : <Gamepad2 className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{layoutMode === 'phone' ? '3310' : 'ТАЧ'}</span>
        </button>

        <button
          id="btn-stats-modal"
          onClick={onOpenStats}
          className="flex items-center gap-1 hover:opacity-75 transition-opacity px-1.5 py-0.5 rounded"
          title="Статистика и рекорды"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span className="text-[11px]">РЕКОРДЫ</span>
        </button>

        <button
          id="btn-settings-modal"
          onClick={onOpenSettings}
          className="flex items-center gap-1 hover:opacity-75 transition-opacity px-1.5 py-0.5 rounded"
          title="Настройки"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="text-[11px]">ОПЦИИ</span>
        </button>
      </div>
    </div>
  );
};
