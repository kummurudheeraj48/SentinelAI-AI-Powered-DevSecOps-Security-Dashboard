import React from 'react';
import { ViewTab } from '../types';

interface SidebarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenSettings: () => void;
  currentUser: { name: string; title: string; avatarUrl?: string };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  currentUser,
}) => {
  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-[#120b07]/90 backdrop-blur-2xl border-r border-[#ff5c26]/20 flex flex-col py-6 z-50 select-none">
      {/* Brand Header */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-[#ff5c26] to-[#d9410d] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff5c26]/30">
          <span
            className="material-symbols-outlined text-[#0a0502] text-xl font-bold"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            security
          </span>
        </div>
        <div>
          <h1 className="text-[22px] font-serif font-bold text-[#f2e7e0] leading-none tracking-tight">
            SentinelAI
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#ffb199] font-mono font-medium mt-1">
            SOC Operations
          </p>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 space-y-1.5">
        <button
          onClick={() => onTabChange('overview')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'overview'
              ? 'text-[#ffb199] font-bold bg-[#ff5c26]/15 border-r-2 border-[#ff5c26] shadow-sm shadow-[#ff5c26]/10'
              : 'text-[#c2b2a8] hover:text-[#f2e7e0] hover:bg-[#ff5c26]/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-[14px]">Overview</span>
        </button>

        <button
          onClick={() => onTabChange('vulnerabilities')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'vulnerabilities'
              ? 'text-[#ffb199] font-bold bg-[#ff5c26]/15 border-r-2 border-[#ff5c26] shadow-sm shadow-[#ff5c26]/10'
              : 'text-[#c2b2a8] hover:text-[#f2e7e0] hover:bg-[#ff5c26]/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">security</span>
          <span className="text-[14px]">Code Vulnerabilities</span>
        </button>

        <button
          onClick={() => onTabChange('network')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'network'
              ? 'text-[#ffb199] font-bold bg-[#ff5c26]/15 border-r-2 border-[#ff5c26] shadow-sm shadow-[#ff5c26]/10'
              : 'text-[#c2b2a8] hover:text-[#f2e7e0] hover:bg-[#ff5c26]/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">hub</span>
          <span className="text-[14px]">Network & IDS</span>
        </button>

        <button
          onClick={() => onTabChange('assistant')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'assistant'
              ? 'text-[#ffb199] font-bold bg-[#ff5c26]/15 border-r-2 border-[#ff5c26] shadow-sm shadow-[#ff5c26]/10'
              : 'text-[#c2b2a8] hover:text-[#f2e7e0] hover:bg-[#ff5c26]/10'
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={activeTab === 'assistant' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            smart_toy
          </span>
          <span className="text-[14px]">AI Assistant</span>
        </button>
      </nav>

      {/* Footer Navigation */}
      <div className="px-3 space-y-1 mt-auto pt-6 border-t border-[#ff5c26]/15">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[#c2b2a8] hover:text-[#f2e7e0] hover:bg-[#ff5c26]/10 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-[14px]">Settings</span>
        </button>

        <button
          onClick={() => alert("SentinelAI Security Support Hotline: +1 (800) 555-SOC2 / soc-support@sentinelai.internal")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[#c2b2a8] hover:text-[#f2e7e0] hover:bg-[#ff5c26]/10 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="text-[14px]">Support</span>
        </button>

        {/* User Profile */}
        <div className="mt-4 px-3 py-3 flex items-center gap-3 rounded-xl bg-[#1a110b]/80 border border-[#ff5c26]/20">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#ff5c26]/50 bg-[#28150c] flex items-center justify-center text-[#ffb199] font-bold text-xs shrink-0 shadow-sm shadow-[#ff5c26]/20">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              currentUser.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-bold text-[#f2e7e0] truncate">{currentUser.name}</p>
            <p className="text-[10px] text-[#c2b2a8] truncate font-mono">{currentUser.title}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
