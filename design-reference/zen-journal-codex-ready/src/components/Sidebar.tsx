import { ScreenType } from '../types';
import { BookOpen, History, BrainCircuit, Settings, Sparkles, X } from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentScreen, onScreenChange, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    {
      id: 'today' as ScreenType,
      label: 'Hôm nay',
      icon: BookOpen,
      desc: 'Khoảnh khắc hiện tại'
    },
    {
      id: 'verification' as ScreenType,
      label: 'Nhìn lại (Kiểm chứng)',
      icon: History,
      desc: 'Phân tách suy nghĩ'
    },
    {
      id: 'map' as ScreenType,
      label: 'Bản đồ nhận thức',
      icon: BrainCircuit,
      desc: 'Xu hướng tâm trí'
    },
    {
      id: 'settings' as ScreenType,
      label: 'Cài đặt',
      icon: Settings,
      desc: 'Giao diện & Tài khoản'
    }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-paper-cream/95 backdrop-blur-md z-[70] 
          transition-transform duration-500 ease-out border-r border-stone-grey/15 flex flex-col shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          md:sticky md:h-screen md:top-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-stone-grey/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sage-green flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans font-semibold tracking-tight text-lg text-deep-teal block">
                Zen Journal
              </span>
              <span className="text-[10px] text-stone-grey uppercase tracking-widest font-medium">
                Tâm trí an nhiên
              </span>
            </div>
          </div>
          
          <button 
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-grey/10 text-stone-grey transition-colors"
            onClick={onClose}
            aria-label="Đóng Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || 
              (item.id === 'verification' && currentScreen === 'integration'); // Treat integration as nested or related
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onScreenChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left group
                  ${isActive
                    ? 'bg-sage-green/10 text-sage-green font-semibold shadow-sm'
                    : 'text-stone-grey hover:bg-surface-container hover:text-on-surface'
                  }`}
              >
                <div className={`p-2 rounded-lg transition-colors duration-300
                  ${isActive ? 'bg-sage-green/20' : 'bg-transparent group-hover:bg-stone-grey/10'}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-medium text-sm block">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-stone-grey/60 font-normal group-hover:text-stone-grey block">
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Profile User Footer Info */}
        <div className="p-6 border-t border-stone-grey/10 bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-sage-green/20 bg-sage-green/15 text-sage-green flex items-center justify-center font-sans font-extrabold text-xs">
              AN
            </div>
            <div>
              <p className="font-sans font-semibold text-sm text-on-surface">An Nhiên</p>
              <p className="text-[10px] text-sage-green font-medium uppercase tracking-widest flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage-green animate-pulse" />
                Dòng chảy vàng
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
