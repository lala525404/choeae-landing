import { useState } from 'react';
import { motion } from 'motion/react';
import { BUDDY_PHRASES, DEFAULT_BUBLES_COLORS } from '../constants';
import { MessageSquare, Heart, RefreshCw, Send } from 'lucide-react';

interface QuotesPreviewProps {
  onQuoteSelect?: (quote: string) => void;
}

export default function QuotesPreview({ onQuoteSelect }: QuotesPreviewProps) {
  const [copiedText, setCopiedText] = useState<string>('');

  const displayPhrases = BUDDY_PHRASES;

  const handleCopyPhrase = (phrase: string) => {
    navigator.clipboard.writeText(phrase.replace(/[^\w\s가-힣~!?✨🌙👀🫵🚀🔥🤝🗿😎💀📈⚡🍀🏃🫠🤪💸🍻]/g, '').trim());
    setCopiedText(phrase);
    setTimeout(() => setCopiedText(''), 2050);

    if (onQuoteSelect) {
      onQuoteSelect(phrase);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-subtle-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="font-display font-black text-lg text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600 animate-pulse" />
            말풍선 대약진 대사관 Preview
          </h4>
          <p className="text-xs text-stone-605 dark:text-stone-400 mt-1 font-bold">
            카드 중 마음에 드는 응원/일침 문구를 물어물어 선택해 보세요! 클릭하면 버디에게 즉시 주입됩니다.
          </p>
        </div>
      </div>

      {/* Grid of customized speech bubble cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayPhrases.map((phrase, idx) => {
          // consistent mock color style selection
          const colorClass = DEFAULT_BUBLES_COLORS[idx % DEFAULT_BUBLES_COLORS.length];
          return (
            <motion.button
              id={`quote-bubble-${idx}`}
              key={phrase}
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCopyPhrase(phrase)}
              className={`p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 text-center font-display font-black text-xs md:text-sm shadow-subtle-sm hover:shadow-subtle-md cursor-pointer flex flex-col justify-between h-20 items-center relative group overflow-hidden ${colorClass}`}
            >
              <div className="flex-1 flex items-center justify-center text-black">
                <span className="leading-tight break-all font-black">{phrase}</span>
              </div>
              
              <div className="text-[9px] opacity-0 group-hover:opacity-100 transition duration-200 font-black mt-1 uppercase tracking-tight flex items-center gap-0.5 text-black">
                <Send className="w-2.5 h-2.5" />
                <span>주입하기</span>
              </div>

              {/* Speech bubble pointy arrow tail (mock) */}
              <div className="absolute right-4 bottom-[-1px] w-2 h-2 rotate-45 border-r border-b border-stone-200 dark:border-stone-850 bg-current text-white dark:text-stone-900 opacity-15" />
            </motion.button>
          );
        })}
      </div>

      {/* Live Toast alert */}
      {copiedText && (
        <div className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-between shadow-subtle-sm animate-bounce">
          <div className="flex items-center gap-2">
            <span>🎉</span>
            <span>그냥 바탕화면 버디에게 <strong>"{copiedText}"</strong> 대사를 무사히 강제 주입했습니다!</span>
          </div>
          <span className="text-[10px] bg-white/20 border border-white/20 px-2 py-0.5 rounded-md font-bold uppercase">버디 전용</span>
        </div>
      )}
    </div>
  );
}
