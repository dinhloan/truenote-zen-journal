import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CheckSquare,
  HelpCircle,
  Lightbulb,
  PlusCircle,
  Trash2
} from "lucide-react";
import { useState } from "react";

export function ZenVerificationScreen({
  originalBelief,
  facts,
  beliefIntensity,
  evidence,
  alternatives,
  conclusionChecked,
  finalConclusion,
  onFactsChange,
  onBeliefIntensityChange,
  onEvidenceChange,
  onAlternativesChange,
  onConclusionCheckedChange,
  onFinalConclusionChange,
  onBack,
  onNext
}) {
  const [newFactInput, setNewFactInput] = useState("");

  function addFact() {
    if (!newFactInput.trim()) return;
    onFactsChange([...facts, { id: String(Date.now()), text: newFactInput.trim() }]);
    setNewFactInput("");
  }

  return (
    <div className="fade-in mx-auto w-full max-w-4xl space-y-12 px-2 py-4 pb-20 md:px-0">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="block text-[11px] font-semibold uppercase tracking-widest text-sage-green">
          Bước 03: Phân tích tâm trí
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-deep-teal">Nhìn nhận sự thật</h2>
        <p className="font-serif text-sm leading-relaxed text-stone-grey">
          Bình tĩnh đối chiếu những gì thực tế đã xảy ra với những gì tâm trí đang diễn giải.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-2">
        <section className="flex flex-col justify-between rounded-2xl border border-stone-grey/15 bg-paper-cream p-6 shadow-sm md:p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sage-green">
              <CheckSquare className="h-5 w-5 shrink-0" />
              <h3 className="text-lg font-semibold text-deep-teal">Thực tế ghi nhận</h3>
            </div>
            <p className="font-serif text-xs text-stone-grey">
              Những dữ kiện khách quan, trung thực. Không chứa suy đoán cảm xúc.
            </p>

            <div className="space-y-3">
              {facts.map((fact) => (
                <div
                  key={fact.id}
                  className="group flex items-start gap-3 rounded-xl border border-stone-grey/10 bg-white p-3 transition-shadow focus-within:border-sage-green/40 focus-within:shadow-sm"
                >
                  <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-green" />
                  <input
                    type="text"
                    value={fact.text}
                    onChange={(event) =>
                      onFactsChange(facts.map((item) => (item.id === fact.id ? { ...item, text: event.target.value } : item)))
                    }
                    className="w-full border-none bg-transparent p-0 font-serif text-sm text-on-surface focus:outline-none focus:ring-0"
                    placeholder="Ghi nhận hành động..."
                  />
                  <button
                    onClick={() => onFactsChange(facts.filter((item) => item.id !== fact.id))}
                    className="p-0.5 text-stone-grey/40 transition-all hover:text-error md:opacity-0 md:group-hover:opacity-100"
                    aria-label="Xóa sự thật"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newFactInput}
                  onChange={(event) => setNewFactInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && addFact()}
                  placeholder="Thêm một sự thật khách quan khác..."
                  className="flex-1 rounded-xl border border-stone-grey/25 bg-white px-3 py-2 font-serif text-sm focus:border-sage-green focus:outline-none focus:ring-1 focus:ring-sage-green/20"
                />
                <button type="button" onClick={addFact} className="rounded-xl p-2 text-sage-green hover:bg-sage-green/10">
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-2xl border border-stone-grey/15 bg-surface-container-low p-6 shadow-sm md:p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-tertiary">
              <BrainCircuit className="h-5 w-5 shrink-0" />
              <h3 className="text-lg font-semibold text-deep-teal">Điều mình đang tin</h3>
            </div>
            <p className="font-serif text-xs text-stone-grey">
              Giả thuyết mà tâm trí vẽ dựng lên để phản ứng lại hoàn cảnh bên ngoài.
            </p>
            <div className="flex min-h-[110px] items-center justify-center rounded-xl border border-stone-grey/10 bg-white/80 p-5">
              <p className="text-center font-serif text-sm italic leading-relaxed text-on-surface-variant">
                "{originalBelief || "Câu chuyện đầu tiên trong nhật ký sẽ trở thành niềm tin cần kiểm chứng."}"
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <label className="block text-xs font-medium text-on-surface-variant">
                Mức độ tin tưởng hiện tại của bạn:
              </label>
              <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-widest text-stone-grey">
                <span>Hoài nghi</span>
                <span>Tuyệt đối tin</span>
              </div>
              <div className="relative flex items-center justify-between px-2 py-4">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-stone-grey/20" />
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onBeliefIntensityChange(value)}
                    className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
                      value <= beliefIntensity
                        ? "border-sage-green bg-sage-green text-white shadow-sm"
                        : "border-stone-grey/30 bg-white text-stone-grey hover:border-sage-green/50"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <p className="text-right text-xs font-medium text-sage-green">
                Cường độ: <span className="text-sm font-extrabold">{beliefIntensity * 20}%</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-8 pt-4">
        <ZenQuestion
          label="Cơ sở nào khiến bạn tin vào điều này?"
          value={evidence}
          onChange={onEvidenceChange}
          placeholder="Ví dụ: Sếp ít nói chuyện với mình dạo gần đây..."
        />
        <ZenQuestion
          label="Có khả năng nào khác đang xảy ra không?"
          value={alternatives}
          onChange={onAlternativesChange}
          placeholder="Ví dụ: Người kia đang bận, mệt, hoặc có việc riêng..."
        />

        <div className="space-y-6 rounded-2xl border border-stone-grey/15 bg-surface-container-low p-6 md:p-8">
          <h4 className="text-base font-semibold text-deep-teal">Cơ sở này đã đủ để kết luận chưa?</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { id: "enough", label: "Đã đủ kết luận", desc: "Tôi tin chắc sự việc là vậy", icon: CheckCircle2 },
              { id: "not_enough", label: "Chưa đủ dữ kiện", desc: "Vẫn còn giả thuyết khác", icon: HelpCircle },
              { id: "unsure", label: "Chưa chắc chắn", desc: "Cần quan sát thêm", icon: HelpCircle }
            ].map((option) => {
              const Icon = option.icon;
              const checked = conclusionChecked === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer flex-col items-center rounded-xl border-2 p-5 text-center transition-all ${
                    checked ? "border-sage-green bg-sage-green/5 shadow-sm" : "border-stone-grey/15 bg-white hover:border-stone-grey/35"
                  }`}
                >
                  <input
                    type="radio"
                    name="conclusion"
                    className="sr-only"
                    checked={checked}
                    onChange={() => onConclusionCheckedChange(option.id)}
                  />
                  <Icon className={`mb-2 h-5 w-5 ${checked ? "text-sage-green" : "text-stone-grey/55"}`} />
                  <span className="mb-1 block text-xs font-semibold text-on-surface">{option.label}</span>
                  <span className="text-[10px] leading-snug text-stone-grey/70">{option.desc}</span>
                </label>
              );
            })}
          </div>
        </div>

        <ZenQuestion
          label="Kết luận cuối cùng sau khi kiểm chứng:"
          value={finalConclusion}
          onChange={onFinalConclusionChange}
          placeholder="Ghi lại sự thật mới sau khi đã phân tích khách quan..."
          prominent
        />

        <div className="flex gap-3 rounded-xl border border-sage-green/10 bg-sage-green/5 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-sage-green" />
          <div>
            <h5 className="text-xs font-bold text-deep-teal">Mẹo thanh lọc nhận thức</h5>
            <p className="font-serif text-xs leading-relaxed text-stone-grey">
              Tránh những từ tuyệt đối như "luôn luôn", "tồi tệ", "kém cỏi". Chỉ mô tả chuỗi hành vi dưới ánh mắt khách quan.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-grey/10 pt-6 sm:flex-row">
          <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 text-xs font-medium text-stone-grey hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Quay lại bước trước
          </button>
          <button
            onClick={onNext}
            disabled={!finalConclusion.trim()}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-10 py-4 text-xs font-medium tracking-wider shadow-md transition-all sm:w-auto ${
              finalConclusion.trim()
                ? "bg-primary text-white hover:bg-deep-teal active:scale-95"
                : "cursor-not-allowed bg-stone-grey/25 text-stone-grey/50"
            }`}
          >
            Tiếp tục chốt nhận thức
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ZenQuestion({ label, value, onChange, placeholder, prominent = false }) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-base font-semibold text-deep-teal">
        <span className="inline-block h-6 w-1.5 shrink-0 rounded-full bg-sage-green" />
        {label}
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full resize-none font-serif text-sm leading-relaxed transition-all placeholder:text-stone-grey/40 focus:border-sage-green focus:ring-sage-green/10 ${
          prominent
            ? "min-h-[120px] rounded-2xl border border-stone-grey/20 bg-paper-cream p-6 italic focus:ring-2 md:text-base"
            : "min-h-[100px] border-0 border-b border-stone-grey/25 bg-paper-cream p-4 focus:ring-0"
        }`}
        placeholder={placeholder}
      />
    </div>
  );
}
