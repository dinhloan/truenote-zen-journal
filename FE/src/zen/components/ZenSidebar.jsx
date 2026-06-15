import { BookOpen, BrainCircuit, History, Settings, Sparkles, X } from "lucide-react";

const menuItems = [
  { id: "today", label: "Hôm nay", icon: BookOpen, desc: "Khoảnh khắc hiện tại" },
  { id: "verification", label: "Nhìn lại", icon: History, desc: "Phân tích suy nghĩ" },
  { id: "map", label: "Bản đồ nhận thức", icon: BrainCircuit, desc: "Xu hướng tâm trí" },
  { id: "settings", label: "Cài đặt", icon: Settings, desc: "Giao diện và tài khoản" }
];

export function ZenSidebar({ currentScreen, onScreenChange, isOpen, onClose, onExit }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-on-background/20 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-[280px] flex-col border-r border-stone-grey/15 bg-paper-cream/95 shadow-xl backdrop-blur-md transition-transform duration-500 md:sticky md:top-0 md:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-grey/10 p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-green text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-lg font-semibold tracking-tight text-deep-teal">Zen Journal</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-stone-grey">
                Tâm trí an nhiên
              </span>
            </div>
          </div>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-grey hover:bg-stone-grey/10 md:hidden"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentScreen === item.id || (item.id === "verification" && currentScreen === "integration");

            return (
              <button
                key={item.id}
                onClick={() => {
                  onScreenChange(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all duration-300 ${
                  active
                    ? "bg-sage-green/10 font-semibold text-sage-green shadow-sm"
                    : "text-stone-grey hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <div className={`rounded-lg p-2 ${active ? "bg-sage-green/20" : "group-hover:bg-stone-grey/10"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-[11px] font-normal text-stone-grey/70">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-stone-grey/10 bg-surface-container-low/50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-green/20 bg-sage-green/15 text-xs font-extrabold text-sage-green">
              AN
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">An Nhiên</p>
              <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-sage-green">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage-green" />
                Dòng chảy vàng
              </p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="w-full rounded-xl border border-stone-grey/20 px-4 py-2 text-xs font-semibold text-deep-teal hover:bg-white"
          >
            Quay về TrueNote
          </button>
        </div>
      </aside>
    </>
  );
}
