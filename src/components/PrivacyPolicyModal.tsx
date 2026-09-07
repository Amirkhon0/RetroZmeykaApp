import React from 'react';
import { X, ShieldCheck, ExternalLink } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col p-4 sm:p-5 shadow-2xl text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-emerald-400 leading-tight">
                Политика конфиденциальности
              </h2>
              <p className="text-[10px] text-stone-400 font-mono">
                Игра «Змейка» • 100% офлайн и безопасность
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-3 pr-1 space-y-3 text-xs text-stone-300 font-sans leading-relaxed">
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
            <strong>Главное:</strong> Приложение <strong>не собирает</strong>, <strong>не хранит</strong> и <strong>не передаёт</strong> никакие персональные данные третьим лицам.
          </div>

          <div>
            <h3 className="font-bold text-stone-200 font-mono text-xs mb-1">
              1. Персональные данные
            </h3>
            <p className="text-stone-400 text-[11px]">
              В игре отсутствует регистрация, сбор email, имени или телефонов. Приложению не нужны системные разрешения (камера, микрофон, контакты, файлы или геолокация).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-200 font-mono text-xs mb-1">
              2. Локальные рекорды и настройки
            </h3>
            <p className="text-stone-400 text-[11px]">
              Ваш максимальный счёт, количество съеденных яблок и выбранная цветовая тема хранятся исключительно в памяти вашего браузера/телефона (LocalStorage). Эти данные не отправляются ни на какие серверы.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-200 font-mono text-xs mb-1">
              3. Отсутствие трекеров и рекламы
            </h3>
            <p className="text-stone-400 text-[11px]">
              Приложение не использует сторонние рекламные сети, аналитические трекеры или скрытый сбор статистики.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-200 font-mono text-xs mb-1">
              4. Контакты
            </h3>
            <p className="text-stone-400 text-[11px]">
              По любым вопросам вы можете написать разработчику:{' '}
              <a
                href="mailto:amirkhonamirkhon@gmail.com"
                className="text-emerald-400 hover:underline"
              >
                amirkhonamirkhon@gmail.com
              </a>
            </p>
          </div>

          <div className="pt-1">
            <a
              href="./privacy.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:underline"
            >
              <span>Открыть отдельную страницу документа (privacy.html)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
