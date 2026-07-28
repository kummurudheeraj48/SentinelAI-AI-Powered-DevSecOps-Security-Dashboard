import React, { useState } from 'react';
import { ViewTab, SecurityFinding, ActiveHost, SnortLogEvent } from './types';
import { initialFindings, initialActiveHosts, initialSnortLogs } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopAppBar } from './components/TopAppBar';
import { CodeVulnerabilitiesView } from './components/CodeVulnerabilitiesView';
import { OverviewDashboardView } from './components/OverviewDashboardView';
import { NetworkIdsView } from './components/NetworkIdsView';
import { AiAssistantView } from './components/AiAssistantView';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('vulnerabilities');
  const [findings, setFindings] = useState<SecurityFinding[]>(initialFindings);
  const [activeHosts, setActiveHosts] = useState<ActiveHost[]>(initialActiveHosts);
  const [snortLogs, setSnortLogs] = useState<SnortLogEvent[]>(initialSnortLogs);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState({
    name: 'Analyst_01',
    title: 'Level 4 Clearance',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyFix = (findingId: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: 'Resolved' } : f))
    );
    showToast(`Vulnerability ${findingId} status set to Resolved.`);
  };

  const handleRescanCodebase = () => {
    showToast('Initiating SAST/DAST/Secrets Scanner across repository...');
    setTimeout(() => {
      showToast('Scan complete. 128 findings indexed.');
    }, 1500);
  };

  const handleRescanSubnet = () => {
    showToast('Rescanning local subnets (10.0.0.0/16)...');
    setTimeout(() => {
      showToast('Subnet scan complete. 24 active hosts discovered.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-[#f2e7e0] flex font-sans selection:bg-[#ff5c26]/30 relative overflow-x-hidden">
      {/* Immersive UI Ambient Canvas Background Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff5c26]/15 via-[#0a0502]/90 to-[#0a0502] -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#ff5c26]/8 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-1/4 w-[400px] h-[400px] bg-[#ffb199]/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#18100a]/95 backdrop-blur-xl border border-[#ff5c26]/60 text-[#f2e7e0] px-4 py-3 rounded-xl shadow-2xl shadow-[#ff5c26]/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 font-mono text-xs">
          <span className="material-symbols-outlined text-[#ff5c26]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Fixed Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentUser={currentUser}
      />

      {/* Right Main Layout Workspace */}
      <div className="flex-1 ml-[260px] flex flex-col min-w-0">
        {/* Sticky Header Bar */}
        <TopAppBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNotifications={() => showToast('Displaying active system alerts')}
          unreadCount={3}
        />

        {/* View Container */}
        <main className="mt-16 flex-1 bg-transparent min-h-[calc(100vh-64px)] overflow-x-hidden">
          {activeTab === 'vulnerabilities' && (
            <CodeVulnerabilitiesView
              findings={findings}
              searchQuery={searchQuery}
              onApplyFix={handleApplyFix}
              onRescan={handleRescanCodebase}
            />
          )}

          {activeTab === 'overview' && (
            <OverviewDashboardView
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'network' && (
            <NetworkIdsView
              hosts={activeHosts}
              snortLogs={snortLogs}
              searchQuery={searchQuery}
              onRescanSubnet={handleRescanSubnet}
            />
          )}

          {activeTab === 'assistant' && (
            <AiAssistantView
              onApplyWafPatch={() => showToast('WAF Rule #8841-B deployed to Edge Gateway.')}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          showToast('Analyst credentials updated.');
        }}
      />
    </div>
  );
};

export default App;
