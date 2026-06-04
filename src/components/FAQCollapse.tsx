import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_ITEMS } from '../constants';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQRowProps {
  key?: any;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQRow({ question, answer, isOpen, onToggle, index }: FAQRowProps) {
  return (
    <div className="border border-stone-200/80 dark:border-stone-850 bg-stone-50 dark:bg-stone-950/40 p-4 rounded-2xl mb-4 shadow-sm">
      <button
        id={`faq-btn-${index}`}
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 font-display font-bold text-stone-850 dark:text-stone-100 hover:text-purple-600 dark:hover:text-purple-400 group transition duration-200 cursor-pointer"
      >
        <span className="flex items-start gap-2.5 text-base md:text-lg">
          <span className="text-purple-500 font-extrabold font-mono">Q.</span>
          <span className="leading-snug">{question}</span>
        </span>
        <span className="mt-1 flex-shrink-0">
          <ChevronDown 
            className={`w-5 h-5 text-stone-500 dark:text-stone-400 group-hover:text-purple-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-purple-500' : ''
            }`} 
          />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 pl-7 text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-bold border-t border-stone-150 dark:border-stone-850 mt-3">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQCollapse() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first is open default

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-subtle-lg">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-stone-950 text-purple-600 flex items-center justify-center font-bold shadow-sm">
          <HelpCircle className="w-5 h-5 text-purple-500" />
        </div>
        <h4 className="font-display font-black text-lg text-stone-900 dark:text-stone-50">
          자주 묻는 질문 (FAQ)
        </h4>
      </div>

      <div className="mt-4">
        {FAQ_ITEMS.map((item, idx) => (
          <FAQRow
            key={idx}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === idx}
            onToggle={() => handleToggle(idx)}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
