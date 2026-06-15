import { useState, useEffect } from 'react';
import { PenTool, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface TodayScreenProps {
  journalText: string;
  onJournalChange: (text: string) => void;
  onNext: () => void;
}

export default function TodayScreen({ journalText, onJournalChange, onNext }: TodayScreenProps) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formatted = now.toLocaleDateString('vi-VN', options);
    // Capitalize first letter of the weekday
    setDateStr(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  const handleFillDemo = () => {
    onJournalChange(
      "Hôm nay mình cảm thấy thật sự tồi tệ. Đồng nghiệp nhìn mình với ánh mắt phán xét khi mình nộp báo cáo muộn 5 phút. Mình chắc chắn họ đang nghĩ mình là kẻ lười biếng và kém cỏi. Cả buổi chiều mình không thể tập trung làm được việc gì vì cứ mãi quẩn quanh trong những ý nghĩ đó. Cảm giác như mọi người đang cô lập mình..."
    );
  };

  return (
    <div className="flex flex-col flex-1 fade-in max-w-2xl mx-auto w-full">
      {/* Upper Zen Message Banner */}
      <div className="mb-8 p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex items-start gap-3 backdrop-blur-sm">
        <Sparkles className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
        <div>
          <h4 className="font-sans font-medium text-amber-900 text-sm">Khoảnh khắc tự vấn</h4>
          <p className="font-serif-content text-amber-800/80 text-xs leading-relaxed mt-1">
            Viết ra tất cả những suy nghĩ lộn xộn trong đầu bạn. Đừng lọc hay chỉnh sửa. Để chúng trôi tự do lên trang giấy.
          </p>
        </div>
      </div>

      {/* Main Journal Canvas Interface */}
      <div className="flex-1 flex flex-col bg-transparent relative">
        <textarea
          value={journalText}
          onChange={(e) => onJournalChange(e.target.value)}
          className="w-full flex-1 bg-transparent border-none text-on-surface focus:outline-none focus:ring-0 font-serif-content text-lg md:text-xl leading-relaxed resize-none min-h-[350px] placeholder:text-stone-grey/40 cursor-text py-2"
          placeholder="Hôm nay trong bạn đang có gì?"
          spellCheck={false}
          autoFocus
        />

        {/* Quick Demo Helper for Sandbox Play */}
        {journalText.trim().length === 0 && (
          <div className="absolute right-0 bottom-4">
            <button
              onClick={handleFillDemo}
              className="text-xs font-sans text-sage-green hover:text-deep-teal hover:bg-sage-green/10 px-3 py-1.5 rounded-lg border border-dashed border-sage-green/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              Dùng nhật ký mẫu trong hình thiết kế
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation Action Area */}
      <div className="mt-8 pt-8 border-t border-stone-grey/10 flex flex-col items-center gap-4">
        {journalText.trim().length < 10 && (
          <p className="text-[11px] text-stone-grey flex items-center gap-1.5 opacity-80">
            <AlertCircle className="w-3 h-3" />
            Hãy chia sẻ ít nhất 10 ký tự để bắt đầu phân tách tâm trí
          </p>
        )}
        <button
          onClick={onNext}
          disabled={journalText.trim().length < 10}
          className={`group relative flex items-center gap-3 px-8 py-4 rounded-full font-sans font-medium text-sm tracking-wide shadow-md transition-all duration-300 overflow-hidden cursor-pointer
            ${journalText.trim().length >= 10
              ? 'bg-primary text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-stone-grey/25 text-stone-grey/50 cursor-not-allowed shadow-none'
            }`}
        >
          <span className="relative z-10 font-sans">Dừng lại và nhìn rõ hơn</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
          
          {/* Internal flow gradient overlay */}
          {journalText.trim().length >= 10 && (
            <div className="absolute inset-0 bg-sage-green scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-in-out -z-0" />
          )}
        </button>
      </div>
    </div>
  );
}
