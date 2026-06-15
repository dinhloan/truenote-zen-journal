import { useState } from 'react';
import { Sparkles, Brain, Heart, Tag, Plus, X, ArrowRight, Check } from 'lucide-react';

interface IntegrationScreenProps {
  originalBelief: string;
  finalConclusion: string;
  awarenessTodayText: string;
  rememberText: string;
  tags: string[];

  onAwarenessTodayTextChange: (text: string) => void;
  onRememberTextChange: (text: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSaveTrace: () => void;
}

export default function IntegrationScreen({
  originalBelief,
  finalConclusion,
  awarenessTodayText,
  rememberText,
  tags,
  onAwarenessTodayTextChange,
  onRememberTextChange,
  onTagsChange,
  onSaveTrace
}: IntegrationScreenProps) {
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const sanitized = newTagInput.trim().startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
    if (!tags.includes(sanitized)) {
      onTagsChange([...tags, sanitized]);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 py-4 pb-20 fade-in space-y-12">
      {/* Result Status Header bar */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="bg-sage-green/10 text-sage-green px-4 py-1.5 rounded-full font-sans font-semibold text-xs tracking-wide">
            Đã chốt nhận thức
          </span>
          <div className="h-px flex-1 bg-stone-grey/25" />
        </div>

        {/* Dynamic Belief Comparison Double Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Belief Card */}
          <div className="bg-paper-cream border border-stone-grey/20 p-6 md:p-8 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-3">
              <span className="text-[10px] text-stone-grey uppercase tracking-widest font-semibold block">
                Niềm tin cũ
              </span>
              <h3 className="font-serif-content text-base md:text-lg text-on-surface leading-relaxed">
                "{originalBelief || 'Tôi không đủ giỏi để dẫn dắt dự án này.'}"
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans text-stone-grey font-medium">
                <span>Mức độ tin tưởng khi viết</span>
                <span>85%</span>
              </div>
              <div className="w-full h-2 bg-stone-grey/15 rounded-full overflow-hidden">
                <div className="h-full bg-stone-grey/35 w-[85%] rounded-full" />
              </div>
            </div>
          </div>

          {/* New Awareness Card */}
          <div className="bg-white border border-sage-green/30 p-6 md:p-8 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="w-10 h-10 text-sage-green opacity-15" />
            </div>

            <div className="space-y-3 relative z-10">
              <span className="text-[10px] text-sage-green uppercase tracking-widest font-semibold block flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sage-green" />
                Nhận thức mới
              </span>
              <h3 className="font-serif-content text-base md:text-lg text-deep-teal font-medium leading-relaxed">
                "{finalConclusion || 'Kinh nghiệm của tôi là giá trị cốt lõi cho nhóm.'}"
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans text-sage-green font-bold">
                <span>Mức độ tin sau phân tích</span>
                <span className="flex items-center gap-1">
                  20% <span className="text-[10px] text-stone-grey font-normal">(Đã giảm)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-stone-grey/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sage-green rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: '20%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured inputs to document awareness */}
      <section className="space-y-8">
        
        {/* Paragraph: Today's detailed perception */}
        <div className="space-y-3">
          <label className="font-sans font-semibold text-deep-teal text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary shrink-0" />
            Nhận thức hôm nay
          </label>
          <textarea
            value={awarenessTodayText}
            onChange={(e) => onAwarenessTodayTextChange(e.target.value)}
            className="w-full min-h-[140px] p-5 bg-paper-cream border-none rounded-2xl focus:ring-1 focus:ring-sage-green/30 font-serif-content text-sm md:text-base leading-relaxed text-on-surface resize-none placeholder:text-stone-grey/50 transition-all custom-scrollbar"
            placeholder="Khoảnh khắc nào đã làm thay đổi thực sự suy nghĩ của bạn?"
          />
        </div>

        {/* Paragraph: Wisdom note to remember */}
        <div className="space-y-3">
          <label className="font-sans font-semibold text-deep-teal text-base flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary shrink-0" />
            Điều mình muốn ghi nhớ
          </label>
          <textarea
            value={rememberText}
            onChange={(e) => onRememberTextChange(e.target.value)}
            className="w-full min-h-[110px] p-5 bg-paper-cream border-none rounded-2xl focus:ring-1 focus:ring-sage-green/30 font-serif-content text-sm md:text-base leading-relaxed italic text-on-surface resize-none placeholder:text-stone-grey/50 transition-all custom-scrollbar"
            placeholder="Thông điệp thông thái nào bạn muốn gửi cho phiên bản tương lai của mình khi gặp lại hoàn cảnh này?"
          />
        </div>

      </section>

      {/* Editable Tag cloud & Closing triggers */}
      <section className="space-y-8 pt-4">
        
        {/* Associated theme tags section */}
        <div className="space-y-3">
          <p className="font-sans font-medium text-xs text-stone-grey uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Chủ đề liên kết
          </p>

          <div className="flex flex-wrap gap-2.5 items-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full border border-primary/25 text-primary font-sans font-medium text-xs flex items-center gap-2 hover:bg-primary-container/10 transition-colors"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-amber-700 transition-colors"
                  aria-label={`Xóa tag ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {isAddingTag ? (
              <div className="flex items-center gap-1 bg-white border border-sage-green rounded-full px-3 py-1 text-xs">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="tên tag..."
                  className="bg-transparent border-none p-0 outline-none text-xs w-20 focus:ring-0"
                  autoFocus
                />
                <button 
                  onClick={handleAddTag} 
                  className="text-sage-green hover:text-deep-teal" 
                  type="button"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsAddingTag(false)} 
                  className="text-stone-grey hover:text-amber-700" 
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="px-4 py-2 rounded-full border border-dashed border-stone-grey/40 text-stone-grey font-sans font-medium text-xs flex items-center gap-1.5 hover:border-primary/60 hover:text-primary transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm tag
              </button>
            )}
          </div>
        </div>

        {/* Final Saving Action Buttons */}
        <div className="flex justify-center pt-10">
          <button
            onClick={onSaveTrace}
            className="group relative flex items-center justify-center gap-3 px-12 py-5 bg-deep-teal hover:bg-primary text-white rounded-full font-sans font-semibold text-sm md:text-base tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 pointer-events-auto cursor-pointer overflow-hidden"
          >
            <span className="relative z-10">Lưu dấu ấn tâm thức</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            <div className="absolute inset-0 bg-sage-green scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-in-out -z-0" />
          </button>
        </div>

      </section>

    </div>
  );
}
