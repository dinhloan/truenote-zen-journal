import { useState } from 'react';
import { FactItem } from '../types';
import { CheckCircle2, HelpCircle, ArrowLeft, ArrowRight, Lightbulb, Trash2, PlusCircle, CheckSquare, BrainCircuit } from 'lucide-react';

interface VerificationScreenProps {
  originalBelief: string;
  facts: FactItem[];
  beliefIntensity: number;
  evidence: string;
  alternatives: string;
  conclusionChecked: 'enough' | 'not_enough' | 'unsure';
  finalConclusion: string;
  
  onFactsChange: (facts: FactItem[]) => void;
  onBeliefIntensityChange: (intensity: number) => void;
  onEvidenceChange: (text: string) => void;
  onAlternativesChange: (text: string) => void;
  onConclusionCheckedChange: (type: 'enough' | 'not_enough' | 'unsure') => void;
  onFinalConclusionChange: (text: string) => void;
  
  onBack: () => void;
  onNext: () => void;
}

export default function VerificationScreen({
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
}: VerificationScreenProps) {
  const [newFactInput, setNewFactInput] = useState('');

  const handleAddFact = () => {
    if (!newFactInput.trim()) return;
    const newItem: FactItem = {
      id: Date.now().toString(),
      text: newFactInput.trim()
    };
    onFactsChange([...facts, newItem]);
    setNewFactInput('');
  };

  const handleRemoveFact = (id: string) => {
    onFactsChange(facts.filter(f => f.id !== id));
  };

  const handleUpdateFactText = (id: string, text: string) => {
    onFactsChange(
      facts.map(f => (f.id === id ? { ...f, text } : f))
    );
  };

  const getIntensityLabel = (val: number) => {
    return `${val * 20}%`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 py-4 pb-20 fade-in space-y-12">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="font-sans font-semibold tracking-widest text-[11px] text-sage-green uppercase block">
          Bước 03: Phân tách tâm trí
        </span>
        <h2 className="font-sans font-bold text-3xl text-deep-teal tracking-tight">
          Nhìn nhận sự thật
        </h2>
        <p className="font-serif-content text-sm text-stone-grey leading-relaxed">
          Hãy bình tĩnh đối chiếu những gì thực tế đã xảy ra với những gì tâm trí bạn đang diễn giải.
        </p>
      </div>

      {/* Split Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        
        {/* Left Side: Fact (Reality) */}
        <section className="bg-paper-cream rounded-2xl p-6 md:p-8 border border-stone-grey/15 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sage-green">
              <CheckSquare className="w-5 h-5 shrink-0" />
              <h3 className="font-sans font-semibold text-lg text-deep-teal">Thực tế ghi nhận</h3>
            </div>
            
            <p className="font-serif-content text-stone-grey text-xs">
              Những dữ kiện khách quan, trung thực (như máy ảnh ghi lại được). Không chứa suy đoán cảm xúc.
            </p>

            {/* List of facts */}
            <div className="space-y-3">
              {facts.map((fact) => (
                <div 
                  key={fact.id} 
                  className="group flex items-start gap-3 p-3 bg-white rounded-xl border border-stone-grey/10 transition-shadow focus-within:border-sage-green/40 focus-within:shadow-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-green mt-2.5 shrink-0" />
                  <input
                    type="text"
                    value={fact.text}
                    onChange={(e) => handleUpdateFactText(fact.id, e.target.value)}
                    className="w-full border-none focus:outline-none focus:ring-0 p-0 font-serif-content text-sm text-on-surface bg-transparent"
                    placeholder="Ghi nhận hành động..."
                  />
                  <button 
                    onClick={() => handleRemoveFact(fact.id)}
                    className="md:opacity-0 md:group-hover:opacity-100 text-stone-grey/40 hover:text-error transition-all p-0.5"
                    aria-label="Xóa sự thật"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add Fact Mini Form */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newFactInput}
                  onChange={(e) => setNewFactInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFact()}
                  placeholder="Thêm một sự thật khách quan khác..."
                  className="flex-1 bg-white border border-stone-grey/25 rounded-xl px-3 py-2 text-sm font-serif-content focus:outline-none focus:border-sage-green focus:ring-1 focus:ring-sage-green/20"
                />
                <button
                  type="button"
                  onClick={handleAddFact}
                  className="p-2 text-sage-green hover:bg-sage-green/10 rounded-xl transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6 pt-6 border-t border-stone-grey/10 md:block hidden">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sage-green mt-0.5 shrink-0" />
              <p className="font-serif-content text-stone-grey text-xs">
                Chỉ ghi sự kiện xảy ra rõ ràng mang tính vật lý.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sage-green mt-0.5 shrink-0" />
              <p className="font-serif-content text-stone-grey text-xs">
                Tránh phán xét hay đính kèm tính từ cảm xúc chủ quan.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Mind Interpretation (Belief) */}
        <section className="bg-surface-container-low rounded-2xl p-6 md:p-8 border border-stone-grey/15 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-tertiary">
              <BrainCircuit className="w-5 h-5 shrink-0" />
              <h3 className="font-sans font-semibold text-lg text-deep-teal font-medium">Điều mình đang tin</h3>
            </div>

            <p className="font-serif-content text-stone-grey text-xs">
              Mông lung, giả thiết mà tâm trí vẽ dựng lên để phản ứng lại hoàn cảnh bên ngoài.
            </p>

            <div className="bg-white/80 p-5 rounded-xl border border-stone-grey/10 min-h-[110px] flex items-center justify-center">
              <p className="font-serif-content text-on-surface-variant italic text-sm text-center leading-relaxed">
                "{originalBelief || 'Ấn nút điền nhật ký mẫu ở màn Hôm nay để tự động đồng hóa câu chuyện.'}"
              </p>
            </div>

            {/* Belief Slider circle select */}
            <div className="pt-4 space-y-4">
              <label className="font-sans font-medium text-xs text-on-surface-variant block">
                Mức độ tin tưởng hiện tại của bạn:
              </label>
              
              <div className="flex items-center justify-between px-1 text-[10px] text-stone-grey uppercase tracking-widest font-semibold">
                <span>Hoài nghi</span>
                <span>Tuyệt đối tin</span>
              </div>

              <div className="flex justify-between items-center relative py-4 px-2">
                <div className="absolute left-0 right-0 h-0.5 bg-stone-grey/20 top-1/2 -translate-y-1/2 -z-0" />
                
                {[1, 2, 3, 4, 5].map((val) => {
                  const isActive = val <= beliefIntensity;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => onBeliefIntensityChange(val)}
                      className={`w-10 h-10 rounded-full border-2 font-sans font-semibold text-sm z-10 flex items-center justify-center transition-all duration-300 cursor-pointer
                        ${isActive 
                          ? 'bg-sage-green border-sage-green text-white shadow-sm' 
                          : 'bg-white border-stone-grey/30 text-stone-grey hover:border-sage-green/50'
                        }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              <p className="text-right font-sans font-medium text-xs text-sage-green">
                Cường độ: <span className="font-extrabold text-sm">{getIntensityLabel(beliefIntensity)}</span>
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Verification Questionnaire Form */}
      <div className="space-y-8 pt-4">
        {/* Question 1 */}
        <div className="space-y-3">
          <label className="font-sans font-semibold text-base text-deep-teal flex items-center gap-2">
            <span className="w-1.5 h-6 bg-sage-green rounded-full inline-block shrink-0" />
            Cơ sở nào khiến bạn tin vào điều này?
          </label>
          <textarea
            value={evidence}
            onChange={(e) => onEvidenceChange(e.target.value)}
            className="w-full bg-paper-cream border-0 border-b border-stone-grey/25 focus:ring-0 focus:border-sage-green p-4 font-serif-content text-sm min-h-[100px] transition-colors resize-none placeholder:text-stone-grey/40"
            placeholder="Ví dụ: 'Sếp ít nói chuyện với mình dạo gần đây, thường ngắt lời hoặc mặt có vẻ nghiêm khắc...'"
          />
        </div>

        {/* Question 2 */}
        <div className="space-y-3">
          <label className="font-sans font-semibold text-base text-deep-teal flex items-center gap-2">
            <span className="w-1.5 h-6 bg-sage-green rounded-full inline-block shrink-0" />
            Có khả năng nào khác đang xảy ra không? (Cách nhìn rộng lượng hơn)
          </label>
          <textarea
            value={alternatives}
            onChange={(e) => onAlternativesChange(e.target.value)}
            className="w-full bg-paper-cream border-0 border-b border-stone-grey/25 focus:ring-0 focus:border-sage-green p-4 font-serif-content text-sm min-h-[100px] transition-colors resize-none placeholder:text-stone-grey/40"
            placeholder="Ví dụ: 'Sếp đang có rất nhiều việc bận cuối tháng, hoặc đang có nỗi lo gia đình riêng làm phân tán tâm trí, không liên quan đến chất lượng báo cáo...'"
          />
        </div>

        {/* Question 3 - Bento Style Grid Cards */}
        <div className="bg-surface-container-low rounded-2xl p-6 md:p-8 border border-stone-grey/15 space-y-6">
          <h4 className="font-sans font-semibold text-deep-teal text-base">
            Cơ sở này đã đủ để kết luận chưa?
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'enough' as const,
                label: 'Đã đủ kết luận',
                desc: 'Tôi tin chắc là sự việc đúng là vậy',
                icon: CheckCircle2
              },
              {
                id: 'not_enough' as const,
                label: 'Chưa đủ dữ kiện',
                desc: 'Vẫn còn nhiều giả thuyết khác mở ra',
                icon: HelpCircle
              },
              {
                id: 'unsure' as const,
                label: 'Chưa chắc chắn',
                desc: 'Cần quan sát thêm một thời gian nữa',
                icon: HelpCircle
              }
            ].map((opt) => {
              const checked = conclusionChecked === opt.id;
              const OptIcon = opt.icon;
              return (
                <label 
                  key={opt.id}
                  className={`flex-1 flex flex-col items-center text-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${checked 
                      ? 'border-sage-green bg-sage-green/5 shadow-sm' 
                      : 'border-stone-grey/15 bg-white hover:border-stone-grey/35'
                    }`}
                >
                  <input
                    type="radio"
                    name="conclusion_check"
                    checked={checked}
                    onChange={() => onConclusionCheckedChange(opt.id)}
                    className="sr-only"
                  />
                  <OptIcon className={`w-5 h-5 mb-2 ${checked ? 'text-sage-green' : 'text-stone-grey/55'}`} />
                  <span className="font-sans font-semibold text-xs text-on-surface block mb-1">{opt.label}</span>
                  <span className="text-[10px] text-stone-grey/70 leading-snug">{opt.desc}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Final Reflection conclusion */}
        <div className="space-y-3">
          <label className="font-sans font-semibold text-base text-deep-teal flex items-center gap-2">
            <span className="w-1.5 h-6 bg-sage-green rounded-full inline-block shrink-0" />
            Kết luận cuối cùng của bạn sau khi kiểm chứng:
          </label>
          <textarea
            value={finalConclusion}
            onChange={(e) => onFinalConclusionChange(e.target.value)}
            className="w-full bg-paper-cream border border-stone-grey/20 rounded-2xl p-6 font-serif-content text-sm md:text-base leading-relaxed focus:ring-2 focus:ring-sage-green/10 focus:border-sage-green min-h-[120px] transition-all resize-none italic"
            placeholder="Ghi lại sự thật mới sau khi đã bình tâm phân tích khách quan..."
          />
        </div>

        {/* Atmospheric Pro Tip Banner */}
        <div className="p-4 rounded-xl bg-sage-green/5 border border-sage-green/10 flex gap-3">
          <Lightbulb className="w-5 h-5 text-sage-green shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-sans font-bold text-deep-teal text-xs">Mẹo thanh lọc nhận thức</h5>
            <p className="font-serif-content text-stone-grey text-xs leading-relaxed">
              Hãy cố gắng tránh những từ mang tính tuyệt biến hay trừng phạt bản thân như "luôn luôn", "tồi tệ", "kém cỏi". Chỉ mô tả chuỗi hành vi dưới ánh mắt khách quan.
            </p>
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-grey/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 text-stone-grey hover:text-primary transition-colors font-sans font-medium text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại bước trước
          </button>
          
          <button
            onClick={onNext}
            disabled={!finalConclusion.trim()}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-full font-sans font-medium text-xs tracking-wider shadow-md transition-all duration-300 group cursor-pointer
              ${finalConclusion.trim()
                ? 'bg-primary text-white hover:bg-deep-teal hover:shadow-lg active:scale-95'
                : 'bg-stone-grey/25 text-stone-grey/50 hover:shadow-none cursor-not-allowed'
              }`}
          >
            Tiếp tục chốt nhận thức
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
