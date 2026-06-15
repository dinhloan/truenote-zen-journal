import { useState, useEffect } from 'react';
import { ScreenType, FactItem, AwarenessTrace, JournalState } from './types';
import ZenBackground from './components/ZenBackground';
import Sidebar from './components/Sidebar';
import TodayScreen from './components/TodayScreen';
import VerificationScreen from './components/VerificationScreen';
import IntegrationScreen from './components/IntegrationScreen';
import MapScreen from './components/MapScreen';
import SettingsScreen from './components/SettingsScreen';
import { Menu, Leaf } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'zen_journal_state_v1';

// Initial dummy facts matching the mock preview image
const DEFAULT_FACTS: FactItem[] = [
  { id: '1', text: 'Báo cáo nộp muộn tương ứng khoảng 5 phút dôi dư.' },
  { id: '2', text: 'Đồng nghiệp hướng mắt thoáng nhìn về khu vực bàn làm việc của tôi.' }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('today');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateStr, setDateStr] = useState('');

  // Initial state setup with local storage persistence
  const [journalState, setJournalState] = useState<JournalState>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }

    return {
      journalText: '',
      originalBelief: '',
      facts: DEFAULT_FACTS,
      beliefIntensity: 4, // 80%
      evidence: '',
      alternatives: '',
      conclusionChecked: 'not_enough',
      finalConclusion: '',
      oldBelief: 'Tôi không đủ giỏi để dẫn dắt dự án này.',
      newAwarenessText: 'Hôm nay khi họp nhóm, tôi nhận ra rằng những lo lắng của mình về việc "không đủ giỏi" thực chất chỉ là nỗi sợ bị phán xét, chứ không phải năng lực thực tế.',
      rememberText: 'Sự tự tin không phải là không có nỗi sợ, mà là hành động bất chấp nỗi sợ. Mình có giá trị riêng và không cần phải hoàn hảo để được tôn trọng.',
      tags: ['#giá_trị_bản_thân', '#công_việc'],
      traces: []
    };
  });

  // Keep state synchronized to local storage automatically
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(journalState));
    } catch (e) {
      console.error('Error writing localStorage:', e);
    }
  }, [journalState]);

  // Compute Vietnamese localized date values for top bar
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formatted = now.toLocaleDateString('vi-VN', options);
    setDateStr(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  // Sync journal draft update
  const handleJournalChange = (text: string) => {
    setJournalState(prev => ({ ...prev, journalText: text }));
  };

  // Logic to process text draft and pass to verification steps
  const handleProceedToVerification = () => {
    const draft = journalState.journalText.trim();
    if (!draft) return;

    // Smartly extract the first sentence as the core belief to examine
    const sentences = draft.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    const extractedBelief = sentences[0] || draft;

    setJournalState(prev => ({
      ...prev,
      originalBelief: prev.originalBelief || extractedBelief,
      // Autofill final conclusion with a restorative perspective if empty
      finalConclusion: prev.finalConclusion || `Sự đánh giá hay im lặng của đồng nghiệp phản chiếu bối cảnh riêng của họ, năng lực thực tế của tôi không đột ngột bốc hơi chỉ vì muộn 5 phút.`
    }));

    setCurrentScreen('verification');
  };

  const handleSaveCognitiveTrace = () => {
    const newTrace: AwarenessTrace = {
      id: `trace-saved-${Date.now()}`,
      date: 'Hôm nay',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      title: journalState.finalConclusion.slice(0, 32) + (journalState.finalConclusion.length > 32 ? '...' : ''),
      summary: journalState.awarenessTodayText || journalState.finalConclusion,
      isCompleted: true,
      tags: [...journalState.tags.map(t => t.replace('#', '').toUpperCase())]
    };

    setJournalState(prev => ({
      ...prev,
      traces: [newTrace, ...prev.traces],
      // Reset daily drafts after safe archiving, keeping configuration intact
      journalText: '',
      evidence: '',
      alternatives: ''
    }));

    // Head directly to the visual cognitive charts
    setCurrentScreen('map');
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'today': return 'Hôm nay';
      case 'verification': return 'Kiểm chứng nhận thức';
      case 'integration': return 'Chốt nhận thức';
      case 'map': return 'Bản đồ nhận thức';
      case 'settings': return 'Cài đặt';
      default: return 'Tâm trí';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-on-surface select-none md:select-text">
      {/* 1. Dynamic Organic WebGL Background Layer */}
      <ZenBackground />

      {/* 2. Visual Layout Shell structure */}
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* Persistent Desktop Sidebar Drawer / Mobile sliding bar */}
        <Sidebar
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Root content container body */}
        <div className="flex-1 flex flex-col px-4 md:px-10 max-w-[1200px] mx-auto w-full">
          
          {/* Universal Header - top bar bar */}
          <header className="flex justify-between items-center w-full py-5 md:py-8 sticky top-0 bg-background/40 backdrop-blur-md z-40 border-b border-stone-grey/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-grey/10 text-primary active:scale-90 transition-all cursor-pointer"
                aria-label="Mở Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="font-sans font-extrabold text-lg md:text-xl text-deep-teal tracking-tight">
                  {getScreenTitle()}
                </h1>
                <p className="hidden xs:block font-sans text-[10px] text-stone-grey font-medium tracking-wide">
                  {dateStr}
                </p>
              </div>
            </div>

            {/* Right side Badge state & User photo */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-sage-green/10 text-sage-green px-4 py-2 rounded-full border border-sage-green/10">
                <Leaf className="w-4 h-4 text-sage-green animate-bounce" />
                <span className="font-sans font-bold text-xs">Dòng chảy 12 ngày</span>
              </div>

              <div className="w-10 h-10 rounded-full border-2 border-primary-fixed-dim shadow-sm bg-sage-green/15 text-sage-green flex items-center justify-center font-sans font-extrabold text-xs">
                AN
              </div>
            </div>
          </header>

          {/* Core Screen Routing Content Area */}
          <main className="flex-1 flex flex-col justify-center py-6 md:py-10">
            {currentScreen === 'today' && (
              <TodayScreen
                journalText={journalState.journalText}
                onJournalChange={handleJournalChange}
                onNext={handleProceedToVerification}
              />
            )}

            {currentScreen === 'verification' && (
              <VerificationScreen
                originalBelief={journalState.originalBelief}
                facts={journalState.facts}
                beliefIntensity={journalState.beliefIntensity}
                evidence={journalState.evidence}
                alternatives={journalState.alternatives}
                conclusionChecked={journalState.conclusionChecked}
                finalConclusion={journalState.finalConclusion}
                
                onFactsChange={(facts) => setJournalState(prev => ({ ...prev, facts }))}
                onBeliefIntensityChange={(intensity) => setJournalState(prev => ({ ...prev, beliefIntensity: intensity }))}
                onEvidenceChange={(evidence) => setJournalState(prev => ({ ...prev, evidence }))}
                onAlternativesChange={(alternatives) => setJournalState(prev => ({ ...prev, alternatives }))}
                onConclusionCheckedChange={(cc) => setJournalState(prev => ({ ...prev, conclusionChecked: cc }))}
                onFinalConclusionChange={(fc) => setJournalState(prev => ({ ...prev, finalConclusion: fc }))}
                
                onBack={() => setCurrentScreen('today')}
                onNext={() => setCurrentScreen('integration')}
              />
            )}

            {currentScreen === 'integration' && (
              <IntegrationScreen
                originalBelief={journalState.originalBelief}
                finalConclusion={journalState.finalConclusion}
                awarenessTodayText={journalState.awarenessTodayText || journalState.newAwarenessText}
                rememberText={journalState.rememberText}
                tags={journalState.tags}
                
                onAwarenessTodayTextChange={(text) => setJournalState(prev => ({ ...prev, awarenessTodayText: text }))}
                onRememberTextChange={(text) => setJournalState(prev => ({ ...prev, rememberText: text }))}
                onTagsChange={(tags) => setJournalState(prev => ({ ...prev, tags }))}
                onSaveTrace={handleSaveCognitiveTrace}
              />
            )}

            {currentScreen === 'map' && (
              <MapScreen
                traces={journalState.traces}
                onFABClick={() => setCurrentScreen('today')}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen />
            )}
          </main>

        </div>
      </div>

      {/* 3. Bottom Tabs Switch Navigation (Mobile screen sizes only) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 rounded-2xl bg-white/80 backdrop-blur-lg border border-stone-grey/15 shadow-lg z-50 flex justify-around items-center px-2">
        {[
          { id: 'today' as ScreenType, label: 'Hôm nay', icon: 'edit_note' },
          { id: 'verification' as ScreenType, label: 'Nhìn lại', icon: 'history' },
          { id: 'map' as ScreenType, label: 'Bản đồ', icon: 'query_stats' },
          { id: 'settings' as ScreenType, label: 'Cài đặt', icon: 'settings' }
        ].map((tab) => {
          const isActive = currentScreen === tab.id || (tab.id === 'verification' && currentScreen === 'integration');
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all duration-300 relative cursor-pointer active:scale-95
                ${isActive ? 'text-sage-green font-bold bg-sage-green/5' : 'text-stone-grey opacity-75'}`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {tab.icon}
              </span>
              <span className="text-[10px] font-sans font-semibold tracking-wide">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-sage-green animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
