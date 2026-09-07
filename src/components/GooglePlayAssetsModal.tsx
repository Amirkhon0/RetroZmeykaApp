import React, { useState } from 'react';
import { X, Download, ExternalLink, Image, Smartphone, Check, Sparkles } from 'lucide-react';

interface GooglePlayAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GooglePlayAssetsModal: React.FC<GooglePlayAssetsModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const appName = "Змейка: Ретро Классика 3310";
  const shortDesc = "Та самая легендарная Змейка с кнопочных телефонов 3310. Офлайн, звук и ностальгия!";
  const fullDesc = `Вернитесь в эпоху легендарных кнопочных телефонов с аутентичной игрой «Змейка»! 

Мы бережно и до мельчайших деталей воссоздали ту самую культовую игру Snake с классического телефона 3310: монохромный LCD-экран, 8-битные звуки пищалки, тактильная отдача и фирменная динамика движения.

🎮 ОСОБЕННОСТИ ИГРЫ:
• Два режима корпуса:
  — Детальный кнопочный телефон 3310 с физическими клавишами.
  — Удобный сенсорный аркадный режим с крестовиной D-Pad.
• 3 игровых режима:
  — Классика (со стенами) — врезаться в край поля нельзя.
  — Без стен — сквозной проход через границы экрана.
  — Лабиринт — лабиринты с препятствиями для профи.
• Бонусные насекомые: собирайте жуков с таймером для удвоения очков!
• 5 цветовых ретро-тем: легендарный зелёный LCD 3310, оливковый Game Boy, тёплый янтарный Amber CRT, контрастный ч/б и Неон.
• 5 уровней скорости: от спокойной разминки до молниеносной реакции.
• Звук и виброотклик: оригинальные процедурные звуки 8-бит и мягкая вибрация клавиш.

📱 100% ОФЛАЙН И БЕЗ РЕГИСТРАЦИИ:
Играйте где угодно — в самолёте, в метро или на даче. Игра не требует интернета, не тратит трафик и запускается мгновенно.

Вспомните свой первый рекорд или установите новый прямо сейчас!`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col p-4 sm:p-5 shadow-2xl text-stone-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-emerald-400 leading-tight">
                Материалы для Google Play
              </h2>
              <p className="text-[11px] text-stone-400 font-mono">
                Картинка для описания, логотип и готовые тексты
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 py-3 pr-1 text-xs font-sans">
          {/* SECTION 1: Feature Graphic (Главная картинка описания 1024x500) */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-400" />
                <span className="font-bold font-mono text-emerald-300 text-xs uppercase">
                  Главная картинка описания (Feature Graphic)
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                1024 × 500 px
              </span>
            </div>

            <p className="text-[11px] text-stone-300">
              В Google Play Console в поле <strong>«Картинка для описания»</strong> (или <em>Feature Graphic</em>) требуется загрузить именно это изображение:
            </p>

            {/* Preview image */}
            <div className="rounded-lg overflow-hidden border border-stone-700 bg-stone-950">
              <img
                src="./feature-graphic.png"
                alt="Feature Graphic 1024x500"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="./feature-graphic.png"
                download="feature-graphic-1024x500.png"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs transition-all shadow-md active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                Скачать картинку (1024×500)
              </a>
              <a
                href="./feature-graphic.png"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Открыть в новой вкладке"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* SECTION 2: App Icon 512x512 */}
          <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="font-bold font-mono text-stone-200 text-xs uppercase">
                  Значок приложения (App Icon)
                </span>
              </div>
              <span className="text-[10px] font-mono bg-stone-800 text-stone-400 px-2 py-0.5 rounded">
                512 × 512 px
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="./icon-512.png"
                alt="App Icon 512"
                className="w-16 h-16 rounded-xl border border-stone-700 shadow-md shrink-0"
              />
              <div className="flex-1 space-y-1">
                <p className="text-[11px] text-stone-400">
                  Официальная иконка для витрины Google Play Console и значка на рабочем столе телефона.
                </p>
                <a
                  href="./icon-512.png"
                  download="icon-512.png"
                  className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-[11px] transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Скачать значок (512×512)
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 3: Text fields with One-Click Copy */}
          <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-950/60 space-y-3">
            <span className="font-bold font-mono text-stone-200 text-xs uppercase block">
              Тексты для анкеты Google Play
            </span>

            {/* Name */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1">
                <span>Название приложения (до 30 символов):</span>
                <button
                  onClick={() => copyToClipboard(appName, 'name')}
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  {copiedSection === 'name' ? <Check className="w-3 h-3" /> : null}
                  {copiedSection === 'name' ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <input
                readOnly
                value={appName}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 font-mono focus:outline-none"
              />
            </div>

            {/* Short Description */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1">
                <span>Краткое описание (до 80 символов):</span>
                <button
                  onClick={() => copyToClipboard(shortDesc, 'short')}
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  {copiedSection === 'short' ? <Check className="w-3 h-3" /> : null}
                  {copiedSection === 'short' ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <input
                readOnly
                value={shortDesc}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 font-mono focus:outline-none"
              />
            </div>

            {/* Full Description */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1">
                <span>Полное описание (Full Description):</span>
                <button
                  onClick={() => copyToClipboard(fullDesc, 'full')}
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  {copiedSection === 'full' ? <Check className="w-3 h-3" /> : null}
                  {copiedSection === 'full' ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={fullDesc}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-[11px] text-stone-300 font-mono resize-none focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono font-bold text-xs rounded-xl transition-colors"
          >
            ЗАКРЫТЬ
          </button>
        </div>
      </div>
    </div>
  );
};
