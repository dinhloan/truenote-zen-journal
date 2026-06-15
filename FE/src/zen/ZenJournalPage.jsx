import { Leaf, Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZenBackground } from "./components/ZenBackground.jsx";
import { ZenIntegrationScreen } from "./components/ZenIntegrationScreen.jsx";
import { ZenMapScreen } from "./components/ZenMapScreen.jsx";
import { ZenSettingsScreen } from "./components/ZenSettingsScreen.jsx";
import { ZenSidebar } from "./components/ZenSidebar.jsx";
import { ZenTodayScreen } from "./components/ZenTodayScreen.jsx";
import { ZenVerificationScreen } from "./components/ZenVerificationScreen.jsx";

const STORAGE_KEY = "zen_journal_state_v1";

const defaultState = {
  journalText: "",
  originalBelief: "",
  facts: [
    { id: "1", text: "Báo cáo nộp muộn khoảng 5 phút." },
    { id: "2", text: "Đồng nghiệp thoáng nhìn về khu vực bàn làm việc của tôi." }
  ],
  beliefIntensity: 4,
  evidence: "",
  alternatives: "",
  conclusionChecked: "not_enough",
  finalConclusion: "",
  awarenessTodayText: "Hôm nay mình nhận ra rằng một ánh nhìn thoáng qua không đủ để kết luận mình kém cỏi.",
  rememberText: "Sự tự tin không phải là không có nỗi sợ, mà là hành động nhẹ nhàng dù nỗi sợ vẫn còn ở đó.",
  tags: ["#giá_trị_bản_thân", "#công_việc"],
  traces: []
};

export function ZenJournalPage() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [journalState, setJournalState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    } catch (_error) {
      return defaultState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(journalState));
  }, [journalState]);

  const dateStr = useMemo(() => {
    const formatted = new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, []);

  function getScreenTitle() {
    return {
      today: "Hôm nay",
      verification: "Kiểm chứng nhận thức",
      integration: "Chốt nhận thức",
      map: "Bản đồ nhận thức",
      settings: "Cài đặt"
    }[currentScreen];
  }

  function proceedToVerification() {
    const draft = journalState.journalText.trim();
    if (!draft) return;
    const extractedBelief = draft.split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean)[0] || draft;
    setJournalState((state) => ({
      ...state,
      originalBelief: state.originalBelief || extractedBelief,
      finalConclusion:
        state.finalConclusion ||
        "Sự đánh giá hay im lặng của người khác chỉ phản chiếu một phần bối cảnh, không đủ để kết luận về giá trị của mình."
    }));
    setCurrentScreen("verification");
  }

  function saveTrace() {
    const newTrace = {
      id: `trace-${Date.now()}`,
      date: "Hôm nay",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      title: (journalState.finalConclusion || "Nhận thức mới").slice(0, 34),
      summary: journalState.awarenessTodayText || journalState.finalConclusion,
      isCompleted: true,
      tags: journalState.tags.map((tag) => tag.replace("#", "").toUpperCase())
    };
    setJournalState((state) => ({
      ...state,
      traces: [newTrace, ...state.traces],
      journalText: "",
      evidence: "",
      alternatives: ""
    }));
    setCurrentScreen("map");
  }

  return (
    <div className="zen-scope relative flex min-h-screen flex-col text-on-surface">
      <ZenBackground />
      <div className="flex min-h-screen flex-col md:flex-row">
        <ZenSidebar
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onExit={() => navigate("/")}
        />

        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 md:px-10">
          <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-stone-grey/5 bg-background/40 py-5 backdrop-blur-md md:py-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-all hover:bg-stone-grey/10 active:scale-90"
                aria-label="Mở menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-deep-teal md:text-xl">{getScreenTitle()}</h1>
                <p className="hidden text-[10px] font-medium tracking-wide text-stone-grey sm:block">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-sage-green/10 bg-sage-green/10 px-4 py-2 text-sage-green sm:flex">
                <Leaf className="h-4 w-4 animate-bounce text-sage-green" />
                <span className="text-xs font-bold">Dòng chảy 12 ngày</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-fixed-dim bg-sage-green/15 text-xs font-extrabold text-sage-green shadow-sm">
                AN
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col justify-center py-6 md:py-10">
            {currentScreen === "today" && (
              <ZenTodayScreen
                journalText={journalState.journalText}
                onJournalChange={(journalText) => setJournalState((state) => ({ ...state, journalText }))}
                onNext={proceedToVerification}
              />
            )}
            {currentScreen === "verification" && (
              <ZenVerificationScreen
                originalBelief={journalState.originalBelief}
                facts={journalState.facts}
                beliefIntensity={journalState.beliefIntensity}
                evidence={journalState.evidence}
                alternatives={journalState.alternatives}
                conclusionChecked={journalState.conclusionChecked}
                finalConclusion={journalState.finalConclusion}
                onFactsChange={(facts) => setJournalState((state) => ({ ...state, facts }))}
                onBeliefIntensityChange={(beliefIntensity) => setJournalState((state) => ({ ...state, beliefIntensity }))}
                onEvidenceChange={(evidence) => setJournalState((state) => ({ ...state, evidence }))}
                onAlternativesChange={(alternatives) => setJournalState((state) => ({ ...state, alternatives }))}
                onConclusionCheckedChange={(conclusionChecked) => setJournalState((state) => ({ ...state, conclusionChecked }))}
                onFinalConclusionChange={(finalConclusion) => setJournalState((state) => ({ ...state, finalConclusion }))}
                onBack={() => setCurrentScreen("today")}
                onNext={() => setCurrentScreen("integration")}
              />
            )}
            {currentScreen === "integration" && (
              <ZenIntegrationScreen
                originalBelief={journalState.originalBelief}
                finalConclusion={journalState.finalConclusion}
                awarenessTodayText={journalState.awarenessTodayText}
                rememberText={journalState.rememberText}
                tags={journalState.tags}
                onAwarenessTodayTextChange={(awarenessTodayText) => setJournalState((state) => ({ ...state, awarenessTodayText }))}
                onRememberTextChange={(rememberText) => setJournalState((state) => ({ ...state, rememberText }))}
                onTagsChange={(tags) => setJournalState((state) => ({ ...state, tags }))}
                onSaveTrace={saveTrace}
              />
            )}
            {currentScreen === "map" && <ZenMapScreen traces={journalState.traces} onFABClick={() => setCurrentScreen("today")} />}
            {currentScreen === "settings" && <ZenSettingsScreen />}
          </main>
        </div>
      </div>
    </div>
  );
}
