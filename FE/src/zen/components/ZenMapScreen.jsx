import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Compass,
  Flame,
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";

const recurringThemes = [
  { name: "#sợ_bị_bỏ_rơi", percentage: 42, color: "bg-sage-green" },
  { name: "#áp_lực_thành_công", percentage: 28, color: "bg-primary-container" },
  { name: "#nuối_tiếc_quá_khứ", percentage: 15, color: "bg-secondary-container" },
  { name: "#khao_khát_tự_do", percentage: 10, color: "bg-tertiary-fixed-dim" }
];

const demoTraces = [
  {
    id: "trace-1",
    date: "Hôm qua",
    time: "22:15",
    title: "Cơn giận vô cớ",
    summary: "Đã bóc tách được cơn giận với đồng nghiệp thực chất là sự ghen tị với sự tự tin của họ.",
    isCompleted: true,
    tags: ["TỰ THÂN", "CHỐT"]
  },
  {
    id: "trace-2",
    date: "15 Thg 5",
    time: "08:30",
    title: "Niềm tin giới hạn",
    summary: "Mọi người sẽ chỉ yêu quý mình nếu mình làm hài lòng họ. Cần quan sát thêm phản kháng khi nói lời từ chối.",
    isCompleted: false,
    tags: ["GIA ĐÌNH", "ĐANG THEO DÕI"]
  },
  {
    id: "trace-3",
    date: "12 Thg 5",
    time: "23:00",
    title: "Nhu cầu được công nhận",
    summary: "Đã tìm thấy nguồn gốc sâu xa từ những năm học cấp 2. Cảm giác nhẹ lòng sau khi viết sụp đổ niềm tin này.",
    isCompleted: true,
    tags: ["QUÁ KHỨ", "ĐÃ CHUYỂN HÓA"]
  }
];

export function ZenMapScreen({ traces, onFABClick }) {
  const [activeTheme, setActiveTheme] = useState("#sợ_bị_bỏ_rơi");
  const [animateBars, setAnimateBars] = useState(false);
  const combinedTraces = [...traces, ...demoTraces];

  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fade-in mx-auto w-full max-w-4xl space-y-12 px-2 py-4 pb-24 md:px-0">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sage-green">
          <Compass className="h-5 w-5" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Bản đồ lưu trữ</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-deep-teal">Bản đồ nhận thức</h2>
        <p className="max-w-2xl font-serif text-sm leading-relaxed text-stone-grey">
          Khám phá các tầng sâu trong tâm trí qua những dấu ấn và sự chuyển dịch nhận thức được ghi lại theo thời gian.
        </p>
      </section>

      <section className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12">
        <div className="rounded-2xl border border-stone-grey/15 bg-paper-cream p-6 shadow-sm transition-shadow hover:shadow-md md:col-span-7 md:p-8">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-stone-grey">Xu hướng</span>
                <h3 className="text-lg font-semibold text-deep-teal">Chủ đề lặp lại</h3>
              </div>
              <BarChart2 className="h-5 w-5 text-sage-green" />
            </div>

            <div className="space-y-5 py-2">
              {recurringThemes.map((theme) => (
                <div key={theme.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                    <button
                      onClick={() => setActiveTheme(theme.name)}
                      className={`${activeTheme === theme.name ? "font-bold text-sage-green" : "hover:text-primary"}`}
                    >
                      {theme.name}
                    </button>
                    <span>{theme.percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-grey/15">
                    <div
                      className={`h-full rounded-full ${theme.color} transition-all duration-1000`}
                      style={{ width: animateBars ? `${theme.percentage}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[10px] leading-none text-stone-grey">
            <Flame className="h-3.5 w-3.5 text-sage-green" />
            Báo cáo lặp lại dựa trên bóc tách 14 ngày qua
          </div>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-deep-teal p-6 text-white shadow-sm transition-transform hover:scale-[1.01] md:col-span-5 md:p-8">
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-sage-green/20 blur-2xl" />
          <div className="relative z-10 space-y-6">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-primary-fixed-dim">
                Tâm trạng nổi bật
              </span>
              <h3 className="text-lg font-semibold text-white">Trạng thái hiện tại</h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Căng thẳng", "Phát triển", "Lo âu", "Chấp nhận", "Hy vọng", "Chữa lành"].map((word, index) => (
                <span
                  key={word}
                  className={`rounded-full font-sans ${
                    index === 1
                      ? "bg-sage-green px-4 py-2.5 text-sm font-bold shadow-sm"
                      : "bg-white/10 px-3.5 py-1.5 text-xs"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
          <button className="relative z-10 mt-8 flex items-center gap-2 self-start text-xs font-medium text-primary-fixed-dim hover:text-white">
            Xem chi tiết từ khóa
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      <section className="space-y-8 rounded-2xl border border-stone-grey/15 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="text-lg font-semibold text-deep-teal">Sự tiến hóa của chủ đề</h4>
              <span className="rounded-full bg-sage-green/10 px-3 py-1 text-xs font-semibold leading-none text-sage-green">
                {activeTheme}
              </span>
            </div>
            <p className="font-serif text-xs text-stone-grey">Hành trình chuyển hóa tâm thức dưới dòng thời gian tự nhiên</p>
          </div>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-grey/20 text-stone-grey hover:bg-surface-container-low">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-grey/20 text-deep-teal hover:bg-surface-container-low">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative px-2 pb-8 pt-16">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 border-t border-dashed border-stone-grey/25" />
          <div className="relative flex min-h-[140px] items-center justify-between">
            {["Ngày 01", "Ngày 04", "Ngày 08", "Ngày 11", "Hôm nay"].map((label, index) => (
              <div key={label} className="group relative flex flex-col items-center">
                <div
                  className={`z-10 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${
                    index === 2 ? "h-6 w-6 bg-sage-green shadow-md" : "h-3.5 w-3.5 bg-sage-green/70"
                  }`}
                />
                <span className={`mt-3 block font-sans ${index === 2 ? "text-xs font-semibold text-on-surface" : "text-[11px] text-stone-grey"}`}>
                  {label}
                </span>
                {index === 2 && (
                  <div className="absolute bottom-full z-20 mb-3 w-52 rounded-xl border border-sage-green/30 bg-paper-cream px-4 py-3 text-center shadow-sm">
                    <span className="mb-1 block text-center text-[9px] font-extrabold uppercase tracking-widest text-sage-green">
                      Bước ngoặt nhận thức
                    </span>
                    <p className="font-serif text-[11px] font-medium leading-snug text-deep-teal">
                      "Nhận ra nỗi sợ này bắt nguồn từ việc mình tự bỏ rơi chính mình."
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-deep-teal">Dấu ấn tâm thức gần đây</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {combinedTraces.map((trace) => (
            <div
              key={trace.id}
              className="flex cursor-pointer flex-col justify-between rounded-2xl border border-stone-grey/10 bg-surface-container-low/80 p-6 shadow-sm transition-all hover:border-sage-green/30 hover:bg-white"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-grey">
                  <span>
                    {trace.date}, {trace.time}
                  </span>
                  {trace.isCompleted ? <CheckCircle2 className="h-4 w-4 text-sage-green" /> : <Circle className="h-4 w-4 text-stone-grey/40" />}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold leading-snug text-deep-teal">{trace.title}</h4>
                  <p className="line-clamp-3 font-serif text-xs leading-relaxed text-on-surface-variant">{trace.summary}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-stone-grey/5 pt-4">
                {trace.tags.map((tag) => (
                  <span key={tag} className="rounded bg-sage-green/10 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-sage-green">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={onFABClick}
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg transition-all hover:scale-105 hover:bg-primary active:scale-95 md:bottom-8 md:right-8"
        aria-label="Tạo dòng tự vấn mới"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
