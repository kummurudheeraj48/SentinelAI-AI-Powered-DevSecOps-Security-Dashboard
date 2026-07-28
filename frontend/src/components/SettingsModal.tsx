import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; title: string; avatarUrl?: string };
  onUpdateUser: (updated: { name: string; title: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [refreshRate, setRefreshRate] = useState('5s');
  const [autoPr, setAutoPr] = useState(true);
  const [snortStream, setSnortStream] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({ name, title });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0a0502]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="immersive-card border border-[#ff5c26]/30 rounded-2xl p-6 w-full max-w-xl space-y-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#ff5c26]/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5c26]">settings</span>
            <h3 className="text-lg font-serif font-bold text-[#f2e7e0]">SOC Operations Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#c2b2a8] hover:text-[#f2e7e0] text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* User Profile Info */}
          <div className="p-4 bg-[#140b06]/80 rounded-xl border border-[#ff5c26]/20 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#ff5c26] uppercase tracking-wider">
              Analyst Credentials
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#c2b2a8] font-mono block mb-1">Analyst Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0502] border border-[#ff5c26]/30 rounded-lg px-3 py-1.5 text-xs text-[#f2e7e0] focus:outline-none focus:border-[#ff5c26]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#c2b2a8] font-mono block mb-1">Clearance Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0502] border border-[#ff5c26]/30 rounded-lg px-3 py-1.5 text-xs text-[#f2e7e0] focus:outline-none focus:border-[#ff5c26]"
                />
              </div>
            </div>
          </div>

          {/* Telemetry & Refresh */}
          <div className="p-4 bg-[#140b06]/80 rounded-xl border border-[#ff5c26]/20 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#ffb199] uppercase tracking-wider">
              Telemetry Stream Settings
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#f2e7e0] font-medium">Snort IDS Telemetry Refresh Rate</p>
                <p className="text-[11px] text-[#c2b2a8]">Interval for active subnet log polling</p>
              </div>
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                className="bg-[#0a0502] border border-[#ff5c26]/30 rounded-lg px-3 py-1 text-xs text-[#f2e7e0]"
              >
                <option value="2s">Real-time (2s)</option>
                <option value="5s">Standard (5s)</option>
                <option value="15s">Interval (15s)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#ff5c26]/15">
              <div>
                <p className="text-xs text-[#f2e7e0] font-medium">Live Nmap Subnet Streaming</p>
                <p className="text-[11px] text-[#c2b2a8]">Auto-discover active port changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={snortStream}
                  onChange={(e) => setSnortStream(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#22130b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff5c26]"></div>
              </label>
            </div>
          </div>

          {/* Automation Rules */}
          <div className="p-4 bg-[#140b06]/80 rounded-xl border border-[#ff5c26]/20 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#ff8c82] uppercase tracking-wider">
              Automated AI Guardrails
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#f2e7e0] font-medium">Auto-PR Generation for Critical CVEs</p>
                <p className="text-[11px] text-[#c2b2a8]">Automatically draft GitHub Pull Requests with Gemini fixes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPr}
                  onChange={(e) => setAutoPr(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#22130b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff5c26]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#ff5c26]/20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#ff5c26]/30 text-xs text-[#c2b2a8] hover:text-[#f2e7e0] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-br from-[#ff5c26] to-[#d9410d] text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-[#ff5c26]/20 cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
