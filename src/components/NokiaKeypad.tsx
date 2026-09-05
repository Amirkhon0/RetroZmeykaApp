import React from 'react';
import { Direction, GameStatus } from '../types/game';
import { sound } from '../utils/audio';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface NokiaKeypadProps {
  onDirection: (dir: Direction) => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  status: GameStatus;
  phoneAccent?: string;
}

export const NokiaKeypad: React.FC<NokiaKeypadProps> = ({
  onDirection,
  onPauseToggle,
  onRestart,
  status,
  phoneAccent = '#9fa8da',
}) => {
  const handleKey = (action: () => void) => {
    sound.playKeyClick();
    action();
  };

  return (
    <div
      id="nokia-tactile-keypad"
      className="w-full max-w-[380px] mx-auto px-2 sm:px-4 py-1.5 sm:py-2.5 flex flex-col items-center select-none"
    >
      {/* Upper Functional Row (Soft keys and Navi Key) */}
      <div className="w-full flex items-center justify-between gap-2 sm:gap-3 mb-1.5 sm:mb-2.5">
        {/* Left Soft key (Меню / Пауза) */}
        <button
          id="key-soft-left"
          onClick={() => handleKey(onPauseToggle)}
          className="phone-softkey flex-1 h-8 sm:h-9 bg-slate-700/80 hover:bg-slate-600 active:bg-slate-800 rounded-md flex items-center justify-center border-t border-white/20 text-slate-200 text-xs font-mono font-bold tracking-wider active:translate-y-0.5"
          title={status === 'playing' ? 'Пауза' : 'Продолжить'}
        >
          {status === 'playing' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="ml-1 text-[10px]">{status === 'playing' ? 'ПАУЗА' : 'СТАРТ'}</span>
        </button>

        {/* Central iconic wide Navi-key */}
        <button
          id="key-navi-center"
          onClick={() => handleKey(status === 'gameover' ? onRestart : onPauseToggle)}
          style={{ borderColor: phoneAccent }}
          className="phone-btn px-5 sm:px-6 h-8 sm:h-9 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full border flex flex-col items-center justify-center text-slate-100 shadow-md active:translate-y-0.5"
          title="Центральная клавиша навигации (ОК)"
        >
          <div className="w-4 h-0.5 bg-slate-300 rounded mb-0.5 opacity-80" />
          <span className="text-[10px] font-retro font-bold tracking-widest text-emerald-400">
            {status === 'gameover' ? 'НОВАЯ' : 'OK'}
          </span>
        </button>

        {/* Right Soft key (C / Назад / Рестарт) */}
        <button
          id="key-soft-right"
          onClick={() => handleKey(onRestart)}
          className="phone-softkey flex-1 h-8 sm:h-9 bg-slate-700/80 hover:bg-slate-600 active:bg-slate-800 rounded-md flex items-center justify-center border-t border-white/20 text-slate-200 text-xs font-mono font-bold tracking-wider active:translate-y-0.5"
          title="Сброс / Заново"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span className="text-[10px]">СБРОС</span>
        </button>
      </div>

      {/* Numeric 3x4 Keypad Grid */}
      <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2 text-slate-100">
        {/* ROW 1 */}
        {/* 1 */}
        <button
          id="key-1"
          onClick={() => handleKey(() => {})}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50"
        >
          <span className="text-xs sm:text-sm font-bold leading-none">1</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">. , '</span>
        </button>

        {/* 2 - UP */}
        <button
          id="key-2-up"
          onClick={() => handleKey(() => onDirection('UP'))}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border-2 border-emerald-500/50 text-emerald-300 hover:border-emerald-400"
          title="Вверх (2)"
        >
          <div className="flex items-center gap-0.5">
            <span className="text-xs sm:text-base font-bold leading-none">2</span>
            <ChevronUp className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-[8px] text-emerald-400 font-mono font-bold">ВВЕРХ</span>
        </button>

        {/* 3 */}
        <button
          id="key-3"
          onClick={() => handleKey(() => {})}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50"
        >
          <span className="text-xs sm:text-sm font-bold leading-none">3</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">DEF</span>
        </button>

        {/* ROW 2 */}
        {/* 4 - LEFT */}
        <button
          id="key-4-left"
          onClick={() => handleKey(() => onDirection('LEFT'))}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border-2 border-emerald-500/50 text-emerald-300 hover:border-emerald-400"
          title="Влево (4)"
        >
          <div className="flex items-center gap-0.5">
            <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span className="text-xs sm:text-base font-bold leading-none">4</span>
          </div>
          <span className="text-[8px] text-emerald-400 font-mono font-bold">ВЛЕВО</span>
        </button>

        {/* 5 - OK / PAUSE */}
        <button
          id="key-5-pause"
          onClick={() => handleKey(onPauseToggle)}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50 hover:bg-slate-700"
          title="Пауза (5)"
        >
          <span className="text-xs sm:text-base font-bold leading-none">5</span>
          <span className="text-[8px] text-amber-400 font-mono font-bold">ПАУЗА</span>
        </button>

        {/* 6 - RIGHT */}
        <button
          id="key-6-right"
          onClick={() => handleKey(() => onDirection('RIGHT'))}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border-2 border-emerald-500/50 text-emerald-300 hover:border-emerald-400"
          title="Вправо (6)"
        >
          <div className="flex items-center gap-0.5">
            <span className="text-xs sm:text-base font-bold leading-none">6</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-[8px] text-emerald-400 font-mono font-bold">ВПРАВО</span>
        </button>

        {/* ROW 3 */}
        {/* 7 */}
        <button
          id="key-7"
          onClick={() => handleKey(() => {})}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50"
        >
          <span className="text-xs sm:text-sm font-bold leading-none">7</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">PQRS</span>
        </button>

        {/* 8 - DOWN */}
        <button
          id="key-8-down"
          onClick={() => handleKey(() => onDirection('DOWN'))}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border-2 border-emerald-500/50 text-emerald-300 hover:border-emerald-400"
          title="Вниз (8)"
        >
          <div className="flex items-center gap-0.5">
            <span className="text-xs sm:text-base font-bold leading-none">8</span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          </div>
          <span className="text-[8px] text-emerald-400 font-mono font-bold">ВНИЗ</span>
        </button>

        {/* 9 */}
        <button
          id="key-9"
          onClick={() => handleKey(() => {})}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50"
        >
          <span className="text-xs sm:text-sm font-bold leading-none">9</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">WXYZ</span>
        </button>

        {/* ROW 4 */}
        {/* * */}
        <button
          id="key-star"
          onClick={() => handleKey(() => {})}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50"
        >
          <span className="text-xs sm:text-base font-bold leading-none">*</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">+</span>
        </button>

        {/* 0 */}
        <button
          id="key-0"
          onClick={() => handleKey(() => {})}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50"
        >
          <span className="text-xs sm:text-base font-bold leading-none">0</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">_</span>
        </button>

        {/* # */}
        <button
          id="key-hash"
          onClick={() => handleKey(() => {})}
          className="phone-btn h-9 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col items-center justify-center border border-slate-600/50"
        >
          <span className="text-xs sm:text-base font-bold leading-none">#</span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono">↑aA</span>
        </button>
      </div>

      <div className="mt-1 text-[9px] text-slate-400 font-mono text-center opacity-70">
        Управление: 2, 4, 6, 8 или свайпы по экрану
      </div>
    </div>
  );
};
