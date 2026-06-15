import { useState } from 'react';
import { Volume2, VolumeX, Eye, Info, Shield, HelpCircle, Heart, Check } from 'lucide-react';

export default function SettingsScreen() {
  const [backgroundIntensity, setBackgroundIntensity] = useState(60);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fontPreference, setFontPreference] = useState<'balanced' | 'spacious'>('balanced');

  return (
    <div className="w-full max-w-2xl mx-auto px-2 md:px-0 py-4 pb-20 fade-in space-y-8">
      {/* Settings Header */}
      <div className="space-y-1">
        <h2 className="font-sans font-bold text-2xl text-deep-teal tracking-tight">Cài đặt thiết lập</h2>
        <p className="font-serif-content text-xs text-stone-grey leading-relaxed">
          Tinh chỉnh không gian tĩnh tâm của riêng bạn để đạt sự tập trung tối đa.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Card Section: Visuals */}
        <div className="bg-paper-cream border border-stone-grey/15 rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="font-sans font-semibold text-sm text-deep-teal flex items-center gap-2">
            <Eye className="w-4 h-4 text-sage-green" />
            Không gian thị giác
          </h3>

          {/* WebGL Opacity slide control */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-sans text-stone-grey">
              <span>Độ phản phất của sóng nền:</span>
              <span>{backgroundIntensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={backgroundIntensity}
              onChange={(e) => setBackgroundIntensity(Number(e.target.value))}
              className="w-full accent-sage-green h-1 bg-stone-grey/20 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-stone-grey italic leading-relaxed">
              * Giảm độ phản phất giúp đọc văn bản Merriweather rõ hơn, tăng lên giúp chuyển động bồng bềnh êm dịu hơn.
            </p>
          </div>

          <hr className="border-stone-grey/10" />

          {/* Sizing choices */}
          <div className="space-y-3">
            <span className="text-xs font-sans text-stone-grey block">Mức độ thưa giãn của chữ (Khoảng cách dòng):</span>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'balanced' as const, label: 'Cân đối (1.75x)', desc: 'Inter & Merriweather chuẩn mực' },
                { id: 'spacious' as const, label: 'Thênh thang (2.1x)', desc: 'Nhiều khoảng trắng để thở' }
              ].map((opt) => {
                const active = fontPreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFontPreference(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-start justify-between cursor-pointer
                      ${active 
                        ? 'border-sage-green bg-sage-green/5 shadow-sm' 
                        : 'border-stone-grey/15 bg-white hover:border-stone-grey/30'
                      }`}
                  >
                    <div>
                      <span className="font-sans font-semibold text-xs text-on-surface block mb-1">{opt.label}</span>
                      <span className="text-[10px] text-stone-grey leading-tight block">{opt.desc}</span>
                    </div>
                    {active && <Check className="w-4 h-4 text-sage-green shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Section: Audio */}
        <div className="bg-paper-cream border border-stone-grey/15 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-sans font-semibold text-sm text-deep-teal flex items-center gap-2">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sage-green" /> : <VolumeX className="w-4 h-4 text-stone-grey" />}
             m thanh thiên nhiên
          </h3>

          <div className="flex items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-sans text-on-surface block font-medium">Bật tiếng mưa rơi gõ cửa nhẹ</span>
              <span className="text-[10px] text-stone-grey leading-tight block max-w-md">
                m thanh lẹt kẹt thư giãn giúp kích hoạt sóng não Alpha, lý tưởng cho quá trình phân bóc tâm trí.
              </span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2 rounded-lg font-sans font-medium text-xs transition-all cursor-pointer
                ${soundEnabled 
                  ? 'bg-sage-green text-white shadow-sm' 
                  : 'bg-stone-grey/10 text-stone-grey hover:bg-stone-grey/20'
                }`}
            >
              {soundEnabled ? 'Đang bật' : 'Đang tắt'}
            </button>
          </div>
        </div>

        {/* Card Section: About License */}
        <div className="bg-paper-cream border border-stone-grey/15 rounded-2xl p-6 space-y-4 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1.5 text-deep-teal">
            <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span className="font-sans font-semibold text-xs">Về dự án Zen Journal</span>
          </div>
          <p className="font-serif-content text-stone-grey text-xs leading-relaxed max-w-md mx-auto">
            Được phát triển từ nền tảng triết học tối giản kết hợp liệu pháp nhận thức hành vi (CBT) để bóc tách các niềm tin giới hạn, mang lại cuộc sống tự chủ an yên.
          </p>
          <p className="text-[9px] text-stone-grey/60 font-sans uppercase tracking-widest pt-2">
            Phiên bản 1.1 • Thiết kế Stitch phục cổ
          </p>
        </div>

      </div>
    </div>
  );
}
