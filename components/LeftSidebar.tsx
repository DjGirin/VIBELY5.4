import React from 'react';
import { SparklesIcon, MessageSquareIcon, MusicIcon, DoorOpenIcon, SettingsIcon } from './icons';

type Page = 'stage' | 'friends' | 'music' | 'settings' | 'messages' | 'profile' | 'threadDetail' | 'followList' | 'projectDetail' | 'dashboard' | 'projects' | 'teams' | 'studio' | 'ai_tools' | 'backstage' | 'room' | 'openProjects';

interface LeftSidebarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  hasBadge?: boolean;
}> = ({ icon, label, isActive, onClick, hasBadge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-md'
        : 'hover:bg-light-bg text-light-text-secondary hover:text-light-text-primary'
    }`}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span className="font-semibold">{label}</span>
    </div>
    {hasBadge && <div className="w-2 h-2 bg-brand-pink-accent rounded-full"></div>}
  </button>
);

interface NavItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasBadge?: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onNavigate, currentPage }) => {
  // 네비게이션 순서: Stage → Messages → Music → BackStage
  const mainNavItems: NavItemType[] = [
    { id: 'stage', label: 'Stage', icon: <SparklesIcon className="w-6 h-6" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquareIcon className="w-6 h-6" />, hasBadge: true },
    { id: 'music', label: 'Music', icon: <MusicIcon className="w-6 h-6" /> },
    { id: 'backstage', label: 'BackStage', icon: <DoorOpenIcon className="w-6 h-6" /> },
  ];

  const bottomNavItems: NavItemType[] = [
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
  ];

  // 활성 상태 체크 (backstage는 dashboard, projects, teams, room, openProjects 포함)
  const isActive = (id: string) => {
    if (id === 'backstage') {
      return ['backstage', 'dashboard', 'projects', 'teams', 'room', 'openProjects'].includes(currentPage);
    }
    if (id === 'stage') {
      return currentPage === 'stage' || currentPage === 'threadDetail';
    }
    return currentPage === id;
  };

  return (
    <aside className="hidden md:flex flex-col w-56 p-4 sticky top-16 h-[calc(100vh-4rem)]">
      {/* 메인 네비게이션 */}
      <nav className="space-y-1 flex-1">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.id)}
            onClick={() => onNavigate(item.id as Page)}
            hasBadge={item.hasBadge}
          />
        ))}
      </nav>

      {/* 하단 네비게이션 */}
      <div className="border-t border-light-border pt-4 mt-4 space-y-1">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.id)}
            onClick={() => onNavigate(item.id as Page)}
          />
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;
