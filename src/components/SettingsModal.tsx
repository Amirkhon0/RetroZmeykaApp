import React, { useState } from 'react';
import { GameSettings, ThemeType, GameMode } from '../types/game';
import { THEMES } from '../utils/constants';
import { sound } from '../utils/audio';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Volume2,
  VolumeX,
  Smartphone,
  Check,
  Download,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  if (!isOpen) return null;

  const handleSoundToggle = () => {
    const next = !settings.soundEnabled;
    sound.setSoundEnabled(next);
    onUpdateSettings({ soundEnabled: next });
    if (next) sound.playEatFood();
  };

  const handleVibrationToggle = () => {
    const next = !settings.vibrationEnabled;
    sound.setVibrationEnabled(next);
    onUpdateSettings({ vibrationEnabled: next });
    if (next) sound.vibrate(50);
  };

  return (
    <div
      id="modal-settings-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="modal-settings-content"
        className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-4 sm:p-5 shadow-2xl text-stone-100 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-retro text-emerald-400">НАСТРОЙКИ</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              PRO
            </span>
          </div>
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-3.5 space-y-4">
          {/* Full Screen & Immersive Display Section */}
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                Экран и Режим игры
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                GOOGLE PLAY READY
              </span>
            </div>

            <div className="w-full">
              {/* Fullscreen Button */}
              <button
                onClick={() => {
                  sound.playKeyClick();
                  onToggleFullscreen();
                }}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  isFullscreen
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                    : 'border-stone-700 bg-stone-800/80 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-stone-400" />
                  )}
                  <div>
                    <p className="text-xs font-bold font-mono">На весь экран (Full Screen)</p>
                    <p className="text-[9px] text-stone-400">
                      {isFullscreen ? 'Полноэкранный режим активен' : 'Скрыть системные панели браузера'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {isFullscreen ? 'ВКЛ' : 'ВКЛЮЧИТЬ'}
                </span>
              </button>
            </div>

            {/* Verification Checklist */}
            <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 gap-1.5 text-[10px] font-mono text-stone-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> PWA Standalone
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Без адресной строки
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Офлайн режим
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Сенсор + Клавиатура
              </span>
            </div>
          </div>

          {/* PWA Install Banner */}
          {!isInstalled && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-300 font-retro">УСТАНОВИТЬ НА ТЕЛЕФОН</p>
                <p className="text-[10px] text-stone-400 mt-0.5 font-mono">
                  Запуск как отдельное приложение без браузера
                </p>
              </div>
              {isInstallable ? (
                <button
                  id="pwa-install-button"
                  onClick={install}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold font-mono rounded-lg transition-colors shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>СКАЧАТЬ</span>
                </button>
              ) : isIOS ? (
                <button
                  id="pwa-ios-guide-btn"
                  onClick={() => setShowIOSPrompt(true)}
                  className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-400 text-xs font-mono rounded-lg border border-emerald-500/40 transition-colors"
                >
                  Инструкция iOS
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-mono">Готово к установке</span>
              )}
            </div>
          )}

          {/* iOS Prompt Guide */}
          {showIOSPrompt && (
            <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 text-xs font-mono space-y-2">
              <p className="font-bold text-amber-400">Как установить на iPhone / iPad:</p>
              <p className="text-stone-300">
                1. Нажмите кнопку «Поделиться» (иконка квадрата со стрелкой вверх) в Safari.<br />
                2. Прокрутите список вниз и выберите «На экран „Домой“».
              </p>
              <button
                onClick={() => setShowIOSPrompt(false)}
                className="w-full py-1 bg-stone-700 text-stone-200 rounded text-[11px]"
              >
                Понятно
              </button>
            </div>
          )}

          {/* Color Theme Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2">
              Тема дисплея
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeType[]).map((themeKey) => {
                const item = THEMES[themeKey];
                const isSelected = settings.theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => {
                      sound.playKeyClick();
                      onUpdateSettings({ theme: themeKey });
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-stone-800 ring-1 ring-emerald-400'
                        : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md border border-black/30 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <div className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: item.fg }} />
                    </div>
                    <span className="text-xs font-mono truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layout Mode (Phone 3310 vs Modern Touch Screen) */}
          <div>
            <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2">
              Внешний вид игры
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playKeyClick();
                  onUpdateSettings({ layoutMode: 'phone' });
                }}
                className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
                  settings.layoutMode === 'phone'
                    ? 'border-emerald-400 bg-stone-800 ring-1 ring-emerald-400'
                    : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">Корпус 3310</span>
                  {settings.layoutMode === 'phone' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Кнопочный телефон с клавиатурой 2-4-6-8
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playKeyClick();
                  onUpdateSettings({ layoutMode: 'touch' });
                }}
                className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
                  settings.layoutMode === 'touch'
                    ? 'border-emerald-400 bg-stone-800 ring-1 ring-emerald-400'
                    : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">Сенсорный тач</span>
                  {settings.layoutMode === 'touch' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Сенсорный D-Pad и свайпы
                </span>
              </button>
            </div>
          </div>

          {/* Game Mode (Wrap, Walls, Maze) */}
          <div>
            <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2">
              Режим игры
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'wrap', title: 'Без стен', desc: 'Сквозь экран' },
                { id: 'walls', title: 'Со стенами', desc: 'Классика' },
                { id: 'maze', title: 'Лабиринт', desc: 'Препятствия' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playKeyClick();
                    onUpdateSettings({ gameMode: m.id as GameMode });
                  }}
                  className={`p-2 rounded-xl border flex flex-col gap-0.5 text-left transition-all ${
                    settings.gameMode === m.id
                      ? 'border-emerald-400 bg-stone-800 ring-1 ring-emerald-400'
                      : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">{m.title}</span>
                  <span className="text-[9px] text-stone-400 font-mono">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selection (1 to 9) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">
                Скорость (1 - 9)
              </label>
              <span className="text-xs font-retro text-emerald-400 font-bold">
                УРОВЕНЬ {settings.speed}
              </span>
            </div>
            <input
              id="settings-speed-range"
              type="range"
              min="1"
              max="9"
              value={settings.speed}
              onChange={(e) => {
                const speed = Number(e.target.value);
                sound.playKeyClick();
                onUpdateSettings({ speed });
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
              <span>Медленно</span>
              <span>Стандарт (5)</span>
              <span>Молния</span>
            </div>

            {/* Dynamic speed toggle */}
            <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dynamicSpeed}
                onChange={(e) => {
                  sound.playKeyClick();
                  onUpdateSettings({ dynamicSpeed: e.target.checked });
                }}
                className="rounded accent-emerald-500 w-4 h-4"
              />
              <span className="text-xs font-mono text-stone-300">
                Авто-ускорение по мере роста змейки
              </span>
            </label>
          </div>

          {/* Audio & Vibration */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
            <button
              onClick={handleSoundToggle}
              className={`p-2.5 rounded-xl border flex items-center justify-between font-mono text-xs transition-all ${
                settings.soundEnabled
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                  : 'border-stone-800 bg-stone-900 text-stone-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>8-Бит Звук</span>
              </div>
              <span className="text-[10px] uppercase font-bold">
                {settings.soundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
              </span>
            </button>

            <button
              onClick={handleVibrationToggle}
              className={`p-2.5 rounded-xl border flex items-center justify-between font-mono text-xs transition-all ${
                settings.vibrationEnabled
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                  : 'border-stone-800 bg-stone-900 text-stone-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Вибрация</span>
              </div>
              <span className="text-[10px] uppercase font-bold">
                {settings.vibrationEnabled ? 'ВКЛ' : 'ВЫКЛ'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800">
          <button
            id="btn-apply-settings"
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-retro text-xs rounded-xl transition-all shadow-md active:scale-98"
          >
            ПРИМЕНИТЬ И ИГРАТЬ
          </button>
        </div>
      </div>
    </div>
  );
};
