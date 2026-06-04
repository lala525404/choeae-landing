import { motion } from 'motion/react';
import { RELEASE_NOTES } from '../constants';
import { Sparkle, ArrowRight, Check } from 'lucide-react';

export default function ReleaseNotesTimeline() {
  return (
    <div className="relative border-l border-stone-200 dark:border-stone-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-12 py-4">
      {RELEASE_NOTES.map((note, idx) => (
        <motion.div
          key={note.version}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="relative group"
        >
          {/* Circular icon node on the line */}
          <div className="absolute -left-[35px] md:-left-[44px] top-1 w-6 h-6 md:w-[34px] md:h-[34px] rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 flex items-center justify-center text-xs md:text-sm group-hover:bg-purple-50 dark:group-hover:bg-purple-950/40 transition-all duration-200 shadow-sm font-bold">
            {note.version.includes('🐱') || idx === RELEASE_NOTES.length - 1 ? '🐱' : '🐾'}
          </div>

          {/* Timeline content body */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-subtle-md hover:shadow-subtle-lg transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg md:text-xl text-stone-900 dark:text-stone-55">
                  {note.version}
                </span>
                {note.badge && (
                  <span className="text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/45 text-[#4F46E5] dark:text-indigo-350 border border-indigo-100/40 dark:border-indigo-900/30 shadow-none">
                    {note.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500">
                {note.date}
              </span>
            </div>

            <h4 className="font-sans font-black text-sm md:text-base text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-1.5 align-middle">
              <Sparkle className="w-4 h-4 text-purple-550" />
              <span>{note.title}</span>
            </h4>

            {/* Added list */}
            {note.additions && note.additions.length > 0 && (
              <div className="mb-4">
                <span className="block text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                  ✨ 주요 업데이트 추가 기능
                </span>
                <ul className="space-y-2">
                  {note.additions.map((add, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                      <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{add}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fixed list */}
            {note.fixes && note.fixes.length > 0 && (
              <div className="pt-3 border-t border-dashed border-stone-150 dark:border-stone-800">
                <span className="block text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                  🛠️ 개선 및 수정 오류
                </span>
                <ul className="space-y-1.5">
                  {note.fixes.map((fix, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-semibold">
                      <span className="mt-1 flex-shrink-0 text-[10px] text-amber-500 font-extrabold">✔</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
