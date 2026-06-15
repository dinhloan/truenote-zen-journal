import { AlertCircle, ArrowRight, PenTool, Sparkles } from "lucide-react";

const sampleJournal =
  "Hôm nay mình cảm thấy thật sự tồi tệ. Đồng nghiệp nhìn mình với ánh mắt phán xét khi mình nộp báo cáo muộn 5 phút. Mình chắc chắn họ đang nghĩ mình là người lười biếng và kém cỏi. Cả buổi chiều mình không thể tập trung làm việc vì cứ mãi quanh quẩn trong những ý nghĩ đó.";

export function ZenTodayScreen({ journalText, onJournalChange, onNext }) {
  return (
    <div className="fade-in mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-4 backdrop-blur-sm">
        <Sparkles className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <h4 className="text-sm font-medium text-amber-900">Khoảnh khắc tự vấn</h4>
          <p className="mt-1 font-serif text-xs leading-relaxed text-amber-800/80">
            Viết ra tất cả những suy nghĩ lộn xộn trong đầu bạn. Đừng lọc hay chỉnh sửa. Để chúng trôi tự do lên trang giấy.
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col bg-transparent">
        <textarea
          value={journalText}
          onChange={(event) => onJournalChange(event.target.value)}
          className="min-h-[350px] w-full flex-1 resize-none border-none bg-transparent py-2 font-serif text-lg leading-relaxed text-on-surface placeholder:text-stone-grey/40 focus:outline-none focus:ring-0 md:text-xl"
          placeholder="Hôm nay trong bạn đang có gì?"
          spellCheck={false}
          autoFocus
        />

        {journalText.trim().length === 0 && (
          <div className="absolute bottom-4 right-0">
            <button
              onClick={() => onJournalChange(sampleJournal)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-sage-green/30 px-3 py-1.5 text-xs text-sage-green transition-all hover:bg-sage-green/10 hover:text-deep-teal"
            >
              <PenTool className="h-3.5 w-3.5" />
              Dùng nhật ký mẫu trong thiết kế
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 border-t border-stone-grey/10 pt-8">
        {journalText.trim().length < 10 && (
          <p className="flex items-center gap-1.5 text-[11px] text-stone-grey">
            <AlertCircle className="h-3 w-3" />
            Hãy chia sẻ ít nhất 10 ký tự để bắt đầu phân tích tâm trí
          </p>
        )}

        <button
          onClick={onNext}
          disabled={journalText.trim().length < 10}
          className={`group relative flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide shadow-md transition-all duration-300 ${
            journalText.trim().length >= 10
              ? "bg-primary text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              : "cursor-not-allowed bg-stone-grey/25 text-stone-grey/50 shadow-none"
          }`}
        >
          <span className="relative z-10">Dừng lại và nhìn rõ hơn</span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          {journalText.trim().length >= 10 && (
            <div className="absolute inset-0 scale-x-0 bg-sage-green transition-transform duration-700 ease-in-out group-hover:scale-x-100" />
          )}
        </button>
      </div>
    </div>
  );
}
