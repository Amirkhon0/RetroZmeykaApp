import React from 'react';
import { Direction, GameStatus } from '../types/game';
import { sound } from '../utils/audio';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

interface TouchControlsProps {
  onDirection: (dir: Direction) => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  status: GameStatus;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirection,
  onPauseToggle,
  onRestart,
  status,
}) => {
  const trigger = (action: () => void) => {
    sound.playKeyClick();
    action();
  };

  return (
    <div id="touch-dpad-controls" className="w-full max-w-[420px] mx-auto px-4 py-2 select-none">
      {/* Top action buttons (Pause, Restart) */}
      <div className="flex items-center justify-between mb-2 px-2">
        <button
          id="touch-btn-pause"
          onClick={() => trigger(onPauseToggle)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 active:bg-stone-700 rounded-xl border border-stone-700 text-stone-200 text-xs font-mono font-bold shadow transition-all active:scale-95"
        >
          {status === 'playing' ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{status === 'playing' ? 'ПАУЗА' : 'ИГРАТЬ'}</span>
        </button>

        <button
          id="touch-btn-restart"
          onClick={() => trigger(onRestart)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 active:bg-stone-700 rounded-xl border border-stone-700 text-stone-200 text-xs font-mono font-bold shadow transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>ЗАНОВО</span>
        </button>
      </div>

      {/* Cross D-Pad */}
      <div className="relative w-40 h-40 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
        {/* Center hub */}
        <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shadow-inner z-10 pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-stone-700" />
        </div>

        {/* UP Button */}
        <button
          id="dpad-up"
          onClick={() => trigger(() => onDirection('UP'))}
          className="absolute top-0 w-14 h-14 rounded-t-2xl bg-gradient-to-b from-stone-700 to-stone-800 active:from-stone-600 active:to-stone-700 border-t border-x border-stone-600 flex items-center justify-center text-stone-100 shadow-md active:scale-95"
          aria-label="Вверх"
        >
          <ChevronUp className="w-7 h-7 text-emerald-400 stroke-[3]" />
        </button>

        {/* DOWN Button */}
        <button
          id="dpad-down"
          onClick={() => trigger(() => onDirection('DOWN'))}
          className="absolute bottom-0 w-14 h-14 rounded-b-2xl bg-gradient-to-t from-stone-700 to-stone-800 active:from-stone-600 active:to-stone-700 border-b border-x border-stone-600 flex items-center justify-center text-stone-100 shadow-md active:scale-95"
          aria-label="Вниз"
        >
          <ChevronDown className="w-7 h-7 text-emerald-400 stroke-[3]" />
        </button>

        {/* LEFT Button */}
        <button
          id="dpad-left"
          onClick={() => trigger(() => onDirection('LEFT'))}
          className="absolute left-0 w-14 h-14 rounded-l-2xl bg-gradient-to-r from-stone-700 to-stone-800 active:from-stone-600 active:to-stone-700 border-l border-y border-stone-600 flex items-center justify-center text-stone-100 shadow-md active:scale-95"
          aria-label="Влево"
        >
          <ChevronLeft className="w-7 h-7 text-emerald-400 stroke-[3]" />
        </button>

        {/* RIGHT Button */}
        <button
          id="dpad-right"
          onClick={() => trigger(() => onDirection('RIGHT'))}
          className="absolute right-0 w-14 h-14 rounded-r-2xl bg-gradient-to-l from-stone-700 to-stone-800 active:from-stone-600 active:to-stone-700 border-r border-y border-stone-600 flex items-center justify-center text-stone-100 shadow-md active:scale-95"
          aria-label="Вправо"
        >
          <ChevronRight className="w-7 h-7 text-emerald-400 stroke-[3]" />
        </button>
      </div>

      <div className="mt-1 text-[10px] text-stone-500 font-mono text-center">
        Также можно свайпать прямо по экрану с игрой
      </div>
    </div>
  );
};
