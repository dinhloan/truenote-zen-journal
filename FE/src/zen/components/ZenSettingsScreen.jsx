import { Check, Eye, Heart, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export function ZenSettingsScreen() {
  const [backgroundIntensity, setBackgroundIntensity] = useState(60);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fontPreference, setFontPreference] = useState("balanced");

  return (
    <div className="fade-in mx-auto w-full max-w-2xl space-y-8 px-2 py-4 pb-20 md:px-0">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-deep-teal">Cài đặt thiết lập</h2>
        <p className="font-serif text-xs leading-relaxed text-stone-grey">
          Tinh chỉnh không gian tĩnh tâm của riêng bạn để đạt sự tập trung tối đa.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-stone-grey/15 bg-paper-cream p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-deep-teal">
            <Eye className="h-4 w-4 text-sage-green" />
            Không gian thị giác
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-stone-grey">
              <span>Độ phảng phất của sóng nền:</span>
              <span>{backgroundIntensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={backgroundIntensity}
              onChange={(event) => setBackgroundIntensity(Number(event.target.value))}
              className="h-1 w-full cursor-pointer rounded-lg bg-stone-grey/20 accent-sage-green"
            />
            <p className="text-[10px] italic leading-relaxed text-stone-grey">
              Giảm để đọc văn bản rõ hơn, tăng để nền chuyển động bồng bềnh và êm dịu hơn.
            </p>
          </div>

          <hr className="border-stone-grey/10" />

          <div className="space-y-3">
            <span className="block text-xs text-stone-grey">Mức độ thư giãn của chữ:</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "balanced", label: "Cân đối", desc: "Inter và Merriweather chuẩn mực" },
                { id: "spacious", label: "Thênh thang", desc: "Nhiều khoảng trắng để thở" }
              ].map((option) => {
                const active = fontPreference === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setFontPreference(option.id)}
                    className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all ${
                      active ? "border-sage-green bg-sage-green/5 shadow-sm" : "border-stone-grey/15 bg-white hover:border-stone-grey/30"
                    }`}
                  >
                    <div>
                      <span className="mb-1 block text-xs font-semibold text-on-surface">{option.label}</span>
                      <span className="block text-[10px] leading-tight text-stone-grey">{option.desc}</span>
                    </div>
                    {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-green" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-stone-grey/15 bg-paper-cream p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-deep-teal">
            {soundEnabled ? <Volume2 className="h-4 w-4 text-sage-green" /> : <VolumeX className="h-4 w-4 text-stone-grey" />}
            Âm thanh thiên nhiên
          </h3>
          <div className="flex items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="block text-xs font-medium text-on-surface">Bật tiếng mưa rơi nhẹ</span>
              <span className="block max-w-md text-[10px] leading-tight text-stone-grey">
                Âm thanh thư giãn giúp không gian viết dịu hơn.
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                soundEnabled ? "bg-sage-green text-white shadow-sm" : "bg-stone-grey/10 text-stone-grey hover:bg-stone-grey/20"
              }`}
            >
              {soundEnabled ? "Đang bật" : "Đang tắt"}
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-stone-grey/15 bg-paper-cream p-6 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-deep-teal">
            <Heart className="h-4 w-4 fill-amber-600 text-amber-600" />
            <span className="text-xs font-semibold">Về dự án Zen Journal</span>
          </div>
          <p className="mx-auto max-w-md font-serif text-xs leading-relaxed text-stone-grey">
            Một không gian viết tối giản kết hợp tinh thần quan sát và kiểm chứng nhận thức để bóc tách các niềm tin giới hạn.
          </p>
          <p className="pt-2 text-[9px] uppercase tracking-widest text-stone-grey/60">Phiên bản 1.1 - Thiết kế Stitch</p>
        </div>
      </div>
    </div>
  );
}
