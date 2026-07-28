import React, { useState } from 'react';
import { ViewTab } from '../types';

interface TopAppBarProps {
  activeTab: ViewTab;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  unreadCount = 3,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'vulnerabilities':
        return 'Search security findings...';
      case 'network':
        return 'Search network intelligence...';
      case 'assistant':
        return 'Search threat database...';
      case 'overview':
      default:
        return 'Search infrastructure, IPs, or logs...';
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'vulnerabilities':
        return 'Security Findings';
      case 'network':
        return 'Network Intelligence';
      case 'assistant':
        return 'AI Security Co-pilot';
      case 'overview':
      default:
        return 'Overview Dashboard';
    }
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-[#0a0502]/80 backdrop-blur-2xl border-b border-[#ff5c26]/20 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <h2 className="font-serif font-bold text-xl text-[#f2e7e0] whitespace-nowrap hidden sm:block tracking-wide">
          {getTitle()}
        </h2>

        {/* Command Search Bar */}
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c2b2a8] text-lg group-focus-within:text-[#ff5c26] transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full bg-[#140b06]/90 border border-[#ff5c26]/25 rounded-xl pl-10 pr-12 py-1.5 text-xs sm:text-sm text-[#f2e7e0] placeholder-[#c2b2a8]/50 focus:outline-none focus:border-[#ff5c26]/60 transition-all shadow-inner"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#22130b] px-1.5 py-0.5 rounded text-[#ffb199] border border-[#ff5c26]/20 font-mono hidden md:inline-block">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        {/* System Status Indicator */}
        <div className="flex items-center gap-2">
          {activeTab === 'network' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#ff5c26] animate-pulse glow-orange"></span>
              <span className="font-mono text-xs text-[#ffb199]">IDS ENGINE: ACTIVE</span>
            </>
          ) : activeTab === 'assistant' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#ff5c26] pulse-dot"></span>
              <span className="font-mono text-xs text-[#ffb199]">SYSTEM READY</span>
            </>
          ) : (
            <>
              <span className="text-[#c2b2a8] text-xs font-mono hidden lg:inline">SYSTEM STATUS:</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[#ffb199] font-mono text-xs">NOMINAL</span>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              if (onOpenNotifications) onOpenNotifications();
            }}
            title="Notifications"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#22130b] text-[#c2b2a8] hover:text-[#ff5c26] transition-colors relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff5c26] rounded-full border-2 border-[#0a0502] animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => alert("Optical Telemetry Lens: All system cameras and log streams active.")}
            title="Optical Lens Telemetry"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#22130b] text-[#c2b2a8] hover:text-[#ff5c26] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">lens</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotificationMenu && (
            <div className="absolute top-12 right-0 w-80 bg-[#18100a]/95 backdrop-blur-2xl border border-[#ff5c26]/30 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-3 border-b border-[#ff5c26]/20">
                <h4 className="text-xs font-bold text-[#ffb199] uppercase tracking-wider font-mono">
                  Active Alerts ({unreadCount})
                </h4>
                <button
                  onClick={() => setShowNotificationMenu(false)}
                  className="text-xs text-[#c2b2a8] hover:text-[#f2e7e0]"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3 mt-3 max-h-60 overflow-y-auto pr-1">
                <div className="p-2.5 rounded-lg bg-[#22130b] border-l-2 border-[#ff3b30]">
                  <p className="text-xs font-bold text-[#ff8c82]">CVE-2023-4122 Critical Finding</p>
                  <p className="text-[11px] text-[#c2b2a8] mt-0.5">Unauthorized API access in auth_controller.py</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#22130b] border-l-2 border-[#ff5c26]">
                  <p className="text-xs font-bold text-[#ffb199]">Snort IDS Event Triggered</p>
                  <p className="text-[11px] text-[#c2b2a8] mt-0.5">Apache Struts RCE attempt detected on web-fe-01</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#22130b] border-l-2 border-[#f59e0b]">
                  <p className="text-xs font-bold text-[#fde68a]">Subnet Scan Complete</p>
                  <p className="text-[11px] text-[#c2b2a8] mt-0.5">24 active hosts discovered on 10.0.0.0/16</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
