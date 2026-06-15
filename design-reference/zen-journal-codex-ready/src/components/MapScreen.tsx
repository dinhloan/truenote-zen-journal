import { useState, useEffect } from 'react';
import { AwarenessTrace } from '../types';
import { 
  BarChart2, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  HelpCircle as QuestionIcon,
  Flame,
  Search,
  Compass
} from 'lucide-react';

interface MapScreenProps {
  traces: AwarenessTrace[];
  onFABClick: () => void;
}

export default function MapScreen({ traces, onFABClick }: MapScreenProps) {
  // Built-in mock database of traits to show complete portfolio history
  const [activeTheme, setActiveTheme] = useState('#sợ_bị_bỏ_rơi');
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    // Soft delay to trigger beautiful transition of entry bars
    const t = setTimeout(() => setAnimateBars(true), 250);
    return () => clearTimeout(t);
  }, []);

  const recurringThemes = [
    { name: '#sợ_bị_bỏ_rơi', percentage: 42, color: 'bg-sage-green' },
    { name: '#áp_lực_thành_công', percentage: 28, color: 'bg-primary-container' },
    { name: '#nuối_tiếc_quá_khứ', percentage: 15, color: 'bg-secondary-container' },
    { name: '#khao_khát_tự_do', percentage: 10, color: 'bg-tertiary-fixed-dim' }
  ];

  const recentTraces: AwarenessTrace[] = [
    {
      id: 'trace-1',
      date: 'Hôm qua',
      time: '22:15',
      title: 'Cơn giận vô cớ',
      summary: 'Đã bóc tách được cơn giận với đồng nghiệp thực chất là sự ghen tị với sự tự tin của họ...',
      isCompleted: true,
      tags: ['TỰ THÂN', 'CHỐT']
    },
    {
      id: 'trace-2',
      date: '15 Thg 5',
      time: '08:30',
      title: 'Niềm tin giới hạn',
      summary: 'Mọi người sẽ chỉ yêu quý mình nếu mình làm hài lòng họ. Cần quan sát thêm sự phản kháng tinh tế khi nói lời từ chối...',
      isCompleted: false,
      tags: ['GIA ĐÌNH', 'ĐANG THEO DÕI']
    },
    {
      id: 'trace-3',
      date: '12 Thg 5',
      time: '23:00',
      title: 'Nhu cầu được công nhận',
      summary: 'Đã tìm thấy nguồn gốc sâu xa từ những năm học cấp 2. Cảm giác nhẹ lòng vô cùng sau khi viết sụp đổ sự tin này...',
      isCompleted: true,
      tags: ['QUÁ KHỨ', 'ĐÃ CHUYỂN HÓA']
    }
  ];

  // Merge runtime user saved entries to top of history
  const combinedTraces = [...traces, ...recentTraces];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 py-4 pb-24 fade-in space-y-12">
      
      {/* Upper Title Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sage-green">
          <Compass className="w-5 h-5" />
          <span className="font-sans font-bold tracking-widest text-[11px] uppercase">
            Bản đồ lưu trữ
          </span>
        </div>
        <h2 className="font-sans font-bold text-3xl text-deep-teal tracking-tight">
          Bản đồ nhận thức
        </h2>
        <p className="font-serif-content text-sm text-stone-grey leading-relaxed max-w-2xl">
          Khám phá các tầng sâu trong tâm trí bạn qua những dấu ấn tâm thức và sự chuyển dịch nhận thức được ghi lại qua thời gian.
        </p>
      </section>

      {/* Bento Grid layout */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Bento 1: Recurring Themes (7 cols) */}
        <div className="md:col-span-7 bg-paper-cream rounded-2xl p-6 md:p-8 border border-stone-grey/15 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow duration-350">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-grey uppercase tracking-widest font-semibold block">
                  Xu hướng
                </span>
                <h3 className="font-sans font-semibold text-lg text-deep-teal">
                  Chủ đề lặp lại
                </h3>
              </div>
              <BarChart2 className="w-5 h-5 text-sage-green" />
            </div>

            {/* List horizontal chart */}
            <div className="space-y-5 py-2">
              {recurringThemes.map((theme) => (
                <div key={theme.name} className="space-y-2">
                  <div className="flex justify-between font-sans text-xs font-semibold text-on-surface-variant">
                    <span 
                      onClick={() => setActiveTheme(theme.name)}
                      className={`cursor-pointer transition-colors ${activeTheme === theme.name ? 'text-sage-green font-bold' : 'hover:text-primary'}`}
                    >
                      {theme.name}
                    </span>
                    <span>{theme.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-grey/15 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${theme.color} rounded-full transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)`} 
                      style={{ width: animateBars ? `${theme.percentage}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-stone-grey mt-4 flex items-center gap-1.5 leading-none">
            <Flame className="w-3.5 h-3.5 text-sage-green" />
            Báo cáo lặp lại dựa trên bóc tách 14 ngày qua
          </div>
        </div>

        {/* Bento 2: Word Cloud Mood Block (5 cols) */}
        <div className="md:col-span-5 bg-deep-teal text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm group hover:scale-[1.01] transition-transform duration-300">
          {/* Circular abstract glass effect */}
          <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-sage-green/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] text-primary-fixed-dim uppercase tracking-widest font-semibold block">
                Tâm trạng nổi bật
              </span>
              <h3 className="font-sans font-semibold text-lg text-white">
                Trạng thái hiện tại
              </h3>
            </div>

            {/* Tag Cloud list */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3.5 py-1.5 bg-white/10 rounded-full font-sans text-xs hover:bg-white/20 transition-colors cursor-default">
                Căng thẳng
              </span>
              <span className="px-4.5 py-2.5 bg-sage-green rounded-full font-sans font-bold text-sm tracking-wide hover:scale-105 transition-transform duration-300 cursor-default shadow-sm text-white">
                Phát triển
              </span>
              <span className="px-3 py-1 bg-white/5 rounded-full font-sans text-[11px] opacity-60 cursor-default">
                Lo âu
              </span>
              <span className="px-3.5 py-2 bg-primary-container/40 rounded-full font-sans text-xs cursor-default">
                Chấp nhận
              </span>
              <span className="px-3.5 py-1.5 bg-white/10 rounded-full font-sans text-xs cursor-default">
                Hy vọng
              </span>
              <span className="px-4 py-2 bg-white/10 rounded-full font-sans font-semibold text-xs cursor-default">
                Chữa lành
              </span>
            </div>
          </div>

          <button className="relative z-10 mt-8 flex items-center gap-2 text-primary-fixed-dim hover:text-white font-sans font-medium text-xs transition-colors self-start group">
            <span>Xem chi tiết từ khóa</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </section>

      {/* Evolution Timeline Section */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-stone-grey/15 space-y-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="font-sans font-semibold text-deep-teal text-lg">
                Sự tiến hóa của chủ đề
              </h4>
              <span className="bg-sage-green/10 text-sage-green px-3 py-1 rounded-full font-sans font-semibold text-xs leading-none">
                {activeTheme}
              </span>
            </div>
            <p className="font-serif-content text-stone-grey text-xs">
              Hành trình chuyển hóa tâm thức của bạn dưới dòng thời gian tự nhiên
            </p>
          </div>

          {/* Timeline switch buttons */}
          <div className="flex gap-2">
            <button 
              className="w-10 h-10 rounded-full border border-stone-grey/20 flex items-center justify-center hover:bg-surface-container-low transition-colors text-stone-grey"
              aria-label="Sau"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="w-10 h-10 rounded-full border border-stone-grey/20 flex items-center justify-center hover:bg-surface-container-low transition-colors text-deep-teal font-bold"
              aria-label="Tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive line graph visual mockup */}
        <div className="relative pt-16 pb-8 px-2">
          {/* Axis horizontal dotted line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-stone-grey/25 -translate-y-1/2" />
          
          <div className="relative flex justify-between items-center min-h-[140px]">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center group relative">
              <div className="w-3.5 h-3.5 rounded-full bg-error border-4 border-white shadow-sm z-10 group-hover:scale-125 transition-transform cursor-pointer" />
              <span className="text-[11px] font-sans text-stone-grey mt-3 block">Ngày 01</span>
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-stone-grey/15 p-3 rounded-lg shadow-md w-40 z-20 text-center">
                <p className="font-serif-content text-[11px] text-stone-grey italic">
                  "Nghẹt thở lo lắng khi công việc không kịp hạn nộp..."
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center group relative">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border-4 border-white shadow-sm z-10 group-hover:scale-125 transition-transform cursor-pointer" />
              <span className="text-[11px] font-sans text-stone-grey mt-3 block">Ngày 04</span>
              
              <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-stone-grey/15 p-3 rounded-lg shadow-md w-40 z-20 text-center">
                <p className="font-serif-content text-[11px] text-stone-grey italic">
                  "Im lặng thu mình không muốn thảo luận..."
                </p>
              </div>
            </div>

            {/* Step 3 (Interactive Pivot Point highlighted) */}
            <div className="flex flex-col items-center group relative">
              <div className="w-6 h-6 rounded-full bg-sage-green border-4 border-white shadow-md z-10 relative" />
              <span className="text-xs font-sans text-on-surface font-semibold mt-3 block">Ngày 08</span>
              
              {/* Persistent Callout Banner strictly matching the design */}
              <div className="absolute bottom-full mb-3 bg-paper-cream border border-sage-green/30 px-4 py-3 rounded-xl w-52 z-20 text-center shadow-sm">
                <span className="text-[9px] text-sage-green uppercase font-sans font-extrabold tracking-widest block text-center mb-1">
                  Bước ngoặt nhận thức
                </span>
                <p className="font-serif-content text-[11px] text-deep-teal font-medium leading-snug">
                  "Nhận ra nỗi sợ này bắt nguồn từ việc mình tự bỏ rơi chính mình."
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center group relative">
              <div className="w-3.5 h-3.5 rounded-full bg-sage-green/60 border-4 border-white shadow-sm z-10 group-hover:scale-125 transition-transform cursor-pointer" />
              <span className="text-[11px] font-sans text-stone-grey mt-3 block">Ngày 11</span>
              
              <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-stone-grey/15 p-3 rounded-lg shadow-md w-40 z-20 text-center">
                <p className="font-serif-content text-[11px] text-stone-grey italic">
                  "Bắt đầu học cách bình tâm một mình..."
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center group relative">
              <div className="w-3.5 h-3.5 rounded-full bg-sage-green border-4 border-white shadow-sm z-10 group-hover:scale-125 transition-transform cursor-pointer" />
              <span className="text-[11px] font-sans text-stone-grey mt-3 block">Hôm nay</span>
              
              <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-stone-grey/15 p-3 rounded-lg shadow-md w-40 z-20 text-center">
                <p className="font-serif-content text-[11px] text-stone-grey italic">
                  "Đón nhận sự trân trọng từ đồng nghiệp!"
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trailing awareness entries list */}
      <section className="space-y-6">
        <h3 className="font-sans font-semibold text-deep-teal text-lg">
          Dấu ấn tâm thức gần đây
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combinedTraces.map((trace) => (
            <div 
              key={trace.id}
              className="bg-surface-container-low/80 rounded-2xl p-6 border border-stone-grey/10 hover:border-sage-green/30 hover:bg-white transition-all duration-300 shadow-sm cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-sans text-stone-grey">
                  <span>{trace.date}, {trace.time}</span>
                  {trace.isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-sage-green shrink-0 bg-white rounded-full" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-stone-grey/40 shrink-0" />
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-deep-teal text-base leading-snug">
                    {trace.title}
                  </h4>
                  <p className="font-serif-content text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {trace.summary}
                  </p>
                </div>
              </div>

              {/* Tags panel inside cards */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-stone-grey/5 mt-4">
                {trace.tags.map((tg) => (
                  <span 
                    key={tg} 
                    className={`px-2 py-0.5 rounded text-[9px] font-sans font-extrabold tracking-wider
                      ${tg === 'TỰ THÂN' || tg === 'QUÁ KHỨ'
                        ? 'bg-sage-green/10 text-sage-green'
                        : tg === 'CHỐT' || tg === 'ĐÃ CHUYỂN HÓA'
                        ? 'bg-primary-container/10 text-primary-container'
                        : 'bg-stone-grey/10 text-stone-grey'
                      }`}
                  >
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button for prompt insertion */}
      <button
        onClick={onFABClick}
        className="fixed right-6 bottom-24 md:right-8 md:bottom-8 w-14 h-14 bg-deep-teal hover:bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer group"
        aria-label="Tạo dòng tự vấn mới"
      >
        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
      </button>

    </div>
  );
}
