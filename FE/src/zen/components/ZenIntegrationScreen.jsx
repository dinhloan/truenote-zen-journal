import { ArrowRight, Brain, Check, Heart, Plus, Sparkles, Tag, X } from "lucide-react";
import { useState } from "react";

export function ZenIntegrationScreen({
  originalBelief,
  finalConclusion,
  awarenessTodayText,
  rememberText,
  tags,
  onAwarenessTodayTextChange,
  onRememberTextChange,
  onTagsChange,
  onSaveTrace
}) {
  const [newTagInput, setNewTagInput] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  function addTag() {
    const value = newTagInput.trim();
    if (!value) return;
    const tag = value.startsWith("#") ? value : `#${value}`;
    if (!tags.includes(tag)) onTagsChange([...tags, tag]);
    setNewTagInput("");
    setAddingTag(false);
  }

  return (
    <div className="fade-in mx-auto w-full max-w-4xl space-y-12 px-2 py-4 pb-20 md:px-0">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-sage-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-sage-green">
            Đã chốt nhận thức
          </span>
          <div className="h-px flex-1 bg-stone-grey/25" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <BeliefCard label="Niềm tin cũ" value={originalBelief || "Tôi không đủ giỏi để dẫn dắt dự án này."} muted percent={85} />
          <BeliefCard label="Nhận thức mới" value={finalConclusion || "Kinh nghiệm của tôi là giá trị cốt lõi cho nhóm."} percent={20} />
        </div>
      </section>

      <section className="space-y-8">
        <TextBlock
          icon={Brain}
          label="Nhận thức hôm nay"
          value={awarenessTodayText}
          onChange={onAwarenessTodayTextChange}
          placeholder="Khoảnh khắc nào đã làm thay đổi thực sự suy nghĩ của bạn?"
        />
        <TextBlock
          icon={Heart}
          label="Điều mình muốn ghi nhớ"
          value={rememberText}
          onChange={onRememberTextChange}
          placeholder="Thông điệp nào bạn muốn gửi cho phiên bản tương lai?"
          italic
        />
      </section>

      <section className="space-y-8 pt-4">
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-grey">
            <Tag className="h-3.5 w-3.5" />
            Chủ đề liên kết
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 rounded-full border border-primary/25 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary-container/10"
              >
                {tag}
                <button onClick={() => onTagsChange(tags.filter((item) => item !== tag))} aria-label={`Xóa tag ${tag}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {addingTag ? (
              <div className="flex items-center gap-1 rounded-full border border-sage-green bg-white px-3 py-1 text-xs">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(event) => setNewTagInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && addTag()}
                  placeholder="tên tag..."
                  className="w-20 border-none bg-transparent p-0 text-xs outline-none focus:ring-0"
                  autoFocus
                />
                <button onClick={addTag} className="text-sage-green">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setAddingTag(false)} className="text-stone-grey">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingTag(true)}
                className="flex items-center gap-1.5 rounded-full border border-dashed border-stone-grey/40 px-4 py-2 text-xs font-medium text-stone-grey hover:border-primary/60 hover:text-primary"
              >
                <Plus className="h-3.5 w-3.5" />
                Thêm tag
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-10">
          <button
            onClick={onSaveTrace}
            className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-deep-teal px-12 py-5 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-primary hover:shadow-xl active:scale-[0.98] md:text-base"
          >
            <span className="relative z-10">Lưu dấu ấn tâm thức</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            <div className="absolute inset-0 scale-x-0 bg-sage-green transition-transform duration-700 ease-in-out group-hover:scale-x-100" />
          </button>
        </div>
      </section>
    </div>
  );
}

function BeliefCard({ label, value, percent, muted = false }) {
  return (
    <div
      className={`relative flex flex-col justify-between space-y-6 overflow-hidden rounded-2xl border p-6 md:p-8 ${
        muted ? "border-stone-grey/20 bg-paper-cream" : "border-sage-green/30 bg-white shadow-sm"
      }`}
    >
      {!muted && (
        <div className="absolute right-0 top-0 p-4">
          <Sparkles className="h-10 w-10 text-sage-green opacity-15" />
        </div>
      )}
      <div className="relative z-10 space-y-3">
        <span className={`block text-[10px] font-semibold uppercase tracking-widest ${muted ? "text-stone-grey" : "text-sage-green"}`}>
          {label}
        </span>
        <h3 className={`font-serif text-base leading-relaxed md:text-lg ${muted ? "text-on-surface" : "font-medium text-deep-teal"}`}>
          "{value}"
        </h3>
      </div>
      <div className="space-y-2">
        <div className={`flex justify-between text-xs font-bold ${muted ? "text-stone-grey" : "text-sage-green"}`}>
          <span>{muted ? "Mức tin khi viết" : "Mức tin sau phân tích"}</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-grey/10">
          <div className={`h-full rounded-full ${muted ? "bg-stone-grey/35" : "bg-sage-green"}`} style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

function TextBlock({ icon: Icon, label, value, onChange, placeholder, italic = false }) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-base font-semibold text-deep-teal">
        <Icon className="h-5 w-5 shrink-0 text-primary" />
        {label}
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full resize-none rounded-2xl border-none bg-paper-cream p-5 font-serif text-sm leading-relaxed text-on-surface placeholder:text-stone-grey/50 focus:ring-1 focus:ring-sage-green/30 md:text-base ${
          italic ? "min-h-[110px] italic" : "min-h-[140px]"
        }`}
        placeholder={placeholder}
      />
    </div>
  );
}
