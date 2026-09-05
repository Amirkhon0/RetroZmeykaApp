import React from 'react';
import { GameStats } from '../types/game';
import { sound } from '../utils/audio';
import { X, Trophy, Flame, Apple, RefreshCw } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    if (window.confirm('Сбросить все рекорды и статистику?')) {
      sound.playKeyClick();
      onResetStats();
    }
  };

  return (
    <div
      id="modal-stats-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="modal-stats-content"
        className="w-full max-w-sm bg-stone-900 border border-stone-700 rounded-2xl p-5 shadow-2xl text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-retro text-amber-400">РЕКОРДЫ</h2>
          </div>
          <button
            id="btn-close-stats"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 font-mono">
          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Лучший рекорд</div>
                <div className="text-lg font-bold text-amber-300 font-lcd leading-tight">{stats.highScore} очков</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Максимальная длина</div>
                <div className="text-lg font-bold text-emerald-300 font-lcd leading-tight">{stats.maxSnakeLength} звеньев</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Apple className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Всего съедено яблок</div>
                <div className="text-lg font-bold text-rose-300 font-lcd leading-tight">{stats.applesEaten} шт.</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Сыграно партий</div>
                <div className="text-lg font-bold text-blue-300 font-lcd leading-tight">{stats.gamesPlayed} игр</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-800 flex gap-2">
          <button
            id="btn-reset-stats"
            onClick={handleReset}
            className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-300 text-xs font-mono rounded-xl border border-stone-700 transition-colors"
          >
            Сбросить рекорды
          </button>
          <button
            id="btn-close-stats-action"
            onClick={onClose}
            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs rounded-xl transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
