import React, { useState, useEffect, useRef } from 'react';
import { ActiveHost, SnortLogEvent } from '../types';

interface NetworkIdsViewProps {
  hosts: ActiveHost[];
  snortLogs: SnortLogEvent[];
  searchQuery: string;
  onRescanSubnet: () => void;
}

export const NetworkIdsView: React.FC<NetworkIdsViewProps> = ({
  hosts,
  snortLogs: initialLogs,
  searchQuery,
  onRescanSubnet,
}) => {
  const [logs, setLogs] = useState<SnortLogEvent[]>(initialLogs);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedHostModal, setSelectedHostModal] = useState<ActiveHost | null>(null);
  const [showAllHostsModal, setShowAllHostsModal] = useState(false);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter hosts by search query
  const filteredHosts = hosts.filter(
    (h) =>
      searchQuery === '' ||
      h.ip.includes(searchQuery) ||
      h.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.ports.some((p) => p.toString().includes(searchQuery))
  );

  // Auto-stream simulated incoming logs
  useEffect(() => {
    if (!isStreaming) return;

    const possibleAlerts = [
      {
        severity: 3 as const,
        severityLabel: 'INFO' as const,
        msg: 'ET SCAN Potential Nmap OS Detection',
        srcIp: '10.0.1.25',
        dstIp: '10.0.4.102:80',
      },
      {
        severity: 2 as const,
        severityLabel: 'WARNING' as const,
        msg: 'ET EXPLOIT Possible CVE-2021-44228 Log4j RCE',
        srcIp: '194.55.22.10',
        dstIp: '10.0.4.105:8080',
      },
      {
        severity: 1 as const,
        severityLabel: 'CRITICAL' as const,
        msg: 'ET TROJAN DNS Query for Cobalt Strike Beacon',
        srcIp: '10.0.4.105',
        dstIp: '45.12.33.2:53',
      },
      {
        severity: 2 as const,
        severityLabel: 'WARNING' as const,
        msg: 'ET POLICY Outbound FTP Session Initiated',
        srcIp: '192.168.1.45',
        dstIp: '198.51.100.14:21',
      },
    ];

    const interval = setInterval(() => {
      const sample = possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)];
      const newLog: SnortLogEvent = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        ...sample,
      };

      setLogs((prev) => [...prev.slice(-40), newLog]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Scroll to bottom when new log arrives
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `snort_ids_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLogSeverityClass = (severity: number) => {
    switch (severity) {
      case 1:
        return 'severity-1';
      case 2:
        return 'severity-2';
      case 3:
      default:
        return 'severity-3';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#f2e7e0] tracking-tight">Network Intelligence</h2>
          <p className="text-[#c2b2a8] text-sm mt-1">
            Real-time surveillance of Snort IDS events and Nmap active host discovery.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onRescanSubnet}
            className="flex items-center gap-2 bg-[#140b06]/90 hover:bg-[#22130b] px-4 py-2 rounded-xl border border-[#ff5c26]/30 text-sm text-[#f2e7e0] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-[#ff5c26]">refresh</span>
            <span>Rescan Subnet</span>
          </button>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 bg-gradient-to-br from-[#ff5c26] to-[#d9410d] text-white hover:brightness-110 px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-[#ff5c26]/20 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout Container */}
      <div className="grid grid-cols-12 gap-5">
        {/* Section 1: Active Hosts List (5 cols) */}
        <section className="col-span-12 lg:col-span-5 immersive-card rounded-2xl border border-[#ff5c26]/20 overflow-hidden flex flex-col min-h-[500px] shadow-xl">
          <div className="px-6 py-4 border-b border-[#ff5c26]/20 flex justify-between items-center bg-[#140b06]/80">
            <h3 className="font-serif font-bold text-[#f2e7e0] flex items-center gap-2 text-base">
              <span className="material-symbols-outlined text-[#ff5c26]">router</span>
              Active Hosts
            </h3>
            <span className="text-xs font-mono bg-[#ff5c26]/15 text-[#ffb199] px-2.5 py-0.5 rounded-lg border border-[#ff5c26]/30 font-bold">
              {filteredHosts.length} FOUND
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#100703]/90 sticky top-0 border-b border-[#ff5c26]/20">
                <tr>
                  <th className="px-6 py-3 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">
                    Hostname
                  </th>
                  <th className="px-6 py-3 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">
                    Open Ports
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ff5c26]/15">
                {filteredHosts.map((host) => (
                  <tr
                    key={host.id}
                    onClick={() => setSelectedHostModal(host)}
                    className="hover:bg-[#ff5c26]/10 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-[#ffb199] font-bold">
                      {host.ip}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#f2e7e0]">
                      {host.hostname}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {host.ports.map((port) => (
                          <span
                            key={port}
                            className="bg-[#22130b] text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#ff5c26]/20 text-[#c2b2a8]"
                          >
                            {port}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#ff5c26]/20 bg-[#140b06]/80 flex justify-center">
            <button
              onClick={() => setShowAllHostsModal(true)}
              className="text-xs text-[#c2b2a8] hover:text-[#ffb199] flex items-center gap-1 transition-colors cursor-pointer font-mono"
            >
              View all discovered hosts <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Section 2: Snort IDS Event Log (7 cols) */}
        <section className="col-span-12 lg:col-span-7 immersive-card border border-[#ff5c26]/20 rounded-2xl overflow-hidden flex flex-col h-[540px] shadow-xl">
          <div className="px-6 py-3.5 border-b border-[#ff5c26]/20 flex justify-between items-center bg-[#140b06]/90">
            <h3 className="font-serif font-bold text-[#f2e7e0] flex items-center gap-2 text-base">
              <span className="material-symbols-outlined text-[#ff5c26]">terminal</span>
              Snort IDS Event Log
            </h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded border-[#ff5c26]/30 bg-[#22130b] text-[#ff5c26] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-[#c2b2a8]">Auto-scroll</span>
              </label>

              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono cursor-pointer border ${
                  isStreaming
                    ? 'bg-[#ff5c26]/15 text-[#ffb199] border-[#ff5c26]/30 font-bold'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-[#ff5c26] animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{isStreaming ? 'LIVE STREAM' : 'PAUSED'}</span>
              </button>
            </div>
          </div>

          {/* Terminal window */}
          <div
            ref={logContainerRef}
            className="flex-1 bg-[#0a0502]/95 p-5 font-mono text-xs overflow-y-auto space-y-2.5 selection:bg-[#ff5c26]/30"
          >
            {logs.map((log) => (
              <div key={log.id} className={`${getLogSeverityClass(log.severity)} p-3 rounded-lg leading-relaxed border border-[#ff5c26]/10`}>
                <span className="text-[#c2b2a8]/60">[{log.timestamp}]</span>
                <span
                  className={`font-bold ml-2 ${
                    log.severity === 1
                      ? 'text-[#ff8c82]'
                      : log.severity === 2
                      ? 'text-[#ffb199]'
                      : 'text-[#c2b2a8]'
                  }`}
                >
                  [{log.severityLabel}]
                </span>
                <span className={`ml-2 text-[#f2e7e0] ${log.severity === 1 ? 'underline decoration-[#ff3b30]/40 font-semibold' : ''}`}>
                  {log.msg}
                </span>
                <div className="mt-1 flex items-center gap-2 text-[#c2b2a8]/70">
                  <span className={log.severity === 1 ? 'text-[#ff8c82]' : 'text-[#ffb199]'}>
                    {log.srcIp}
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#ff5c26]">arrow_right_alt</span>
                  <span className={log.severity === 1 ? 'text-[#ffb199]' : 'text-[#ff8c82]'}>
                    {log.dstIp}
                  </span>
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      log.severity === 1
                        ? 'bg-[#ff3b30]/20 text-[#ff8c82]'
                        : log.severity === 2
                        ? 'bg-[#ff5c26]/20 text-[#ffb199]'
                        : 'bg-[#c2b2a8]/10 text-[#c2b2a8]'
                    }`}
                  >
                    SEV {log.severity}
                  </span>
                </div>
              </div>
            ))}

            <div className="p-2 text-[#c2b2a8]/50 flex items-center gap-1 font-mono">
              <span>[_system_] awaiting stream input...</span>
              <span className="terminal-cursor"></span>
            </div>
          </div>

          {/* Terminal Footer controls */}
          <div className="p-3 border-t border-[#ff5c26]/20 bg-[#140b06]/90 flex items-center justify-between text-xs font-mono text-[#c2b2a8]">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-[#c2b2a8]">BUFFER:</span>
                <div className="w-24 h-1 bg-[#22130b] rounded-full overflow-hidden">
                  <div className="bg-[#ff5c26] h-full w-[28%]"></div>
                </div>
              </div>
              <span className="text-[10px] text-[#c2b2a8] uppercase">
                Filtered: {searchQuery ? searchQuery : 'None'}
              </span>
            </div>

            <button
              onClick={handleClearLogs}
              className="hover:text-[#ff5c26] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">clear_all</span>
              Clear Console
            </button>
          </div>
        </section>
      </div>

      {/* Footer Stats / Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="immersive-card p-4 rounded-2xl">
          <p className="text-xs text-[#c2b2a8] uppercase font-mono">Packets Analyzed</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-[#ffb199]">1.2M</span>
            <span className="text-[10px] text-[#ff5c26] mb-1 font-mono">↑ 4.2%</span>
          </div>
        </div>

        <div className="immersive-card p-4 rounded-2xl">
          <p className="text-xs text-[#c2b2a8] uppercase font-mono">Active Threats</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-[#ff8c82]">12</span>
            <span className="text-[10px] text-[#c2b2a8] mb-1 font-mono">Unresolved</span>
          </div>
        </div>

        <div className="immersive-card p-4 rounded-2xl">
          <p className="text-xs text-[#c2b2a8] uppercase font-mono">Subnet Coverage</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-[#f2e7e0]">94%</span>
            <span className="text-[10px] text-[#c2b2a8] mb-1 font-mono">6 Subnets</span>
          </div>
        </div>

        <div className="immersive-card p-4 rounded-2xl">
          <p className="text-xs text-[#c2b2a8] uppercase font-mono">Snort Uptime</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-serif font-bold text-[#f2e7e0]">99.98%</span>
            <span className="text-[10px] text-[#4cd7f6] mb-1 font-mono">Healthy</span>
          </div>
        </div>
      </div>

      {/* Host Details Modal */}
      {selectedHostModal && (
        <div className="fixed inset-0 bg-[#0b1326]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-[#3e484f] rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#3e484f] pb-3">
              <h3 className="text-lg font-bold text-[#dae2fd] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8ed5ff]">router</span>
                Host Intelligence: {selectedHostModal.hostname}
              </h3>
              <button
                onClick={() => setSelectedHostModal(null)}
                className="text-[#bdc8d1] hover:text-[#dae2fd] text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-[#3e484f]/30 font-mono">
                <span className="text-[#bdc8d1]">IP Address:</span>
                <span className="text-[#8ed5ff] font-bold">{selectedHostModal.ip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3e484f]/30 font-mono">
                <span className="text-[#bdc8d1]">Operating System:</span>
                <span className="text-[#dae2fd]">{selectedHostModal.os || 'Linux / Unix'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3e484f]/30 font-mono">
                <span className="text-[#bdc8d1]">Subnet:</span>
                <span className="text-[#dae2fd]">{selectedHostModal.subnet || '10.0.0.0/16'}</span>
              </div>
              <div className="space-y-1 pt-2">
                <p className="text-xs font-mono text-[#bdc8d1] uppercase">Open Port Services:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedHostModal.ports.map((p) => (
                    <span key={p} className="bg-[#2d3449] px-2.5 py-1 rounded text-xs font-mono border border-[#3e484f] text-[#8ed5ff]">
                      Port {p} ({p === 22 ? 'SSH' : p === 80 ? 'HTTP' : p === 443 ? 'HTTPS' : p === 3306 ? 'MySQL' : 'Service'})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-[#3e484f]">
              <button
                onClick={() => {
                  alert(`Initiating Nmap port scan target for ${selectedHostModal.ip}...`);
                  setSelectedHostModal(null);
                }}
                className="bg-[#8ed5ff] text-[#00354a] px-4 py-2 rounded-lg font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                Trigger Deep Nmap Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Hosts Modal */}
      {showAllHostsModal && (
        <div className="fixed inset-0 bg-[#0b1326]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-[#3e484f] rounded-2xl p-6 w-full max-w-3xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#3e484f] pb-3">
              <h3 className="text-lg font-bold text-[#dae2fd]">
                Discovered Subnet Hosts Inventory ({hosts.length})
              </h3>
              <button
                onClick={() => setShowAllHostsModal(false)}
                className="text-[#bdc8d1] hover:text-[#dae2fd] text-xl"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#131b2e] sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-xs font-mono text-[#bdc8d1]">IP</th>
                    <th className="px-4 py-2 text-xs font-mono text-[#bdc8d1]">Hostname</th>
                    <th className="px-4 py-2 text-xs font-mono text-[#bdc8d1]">OS</th>
                    <th className="px-4 py-2 text-xs font-mono text-[#bdc8d1]">Ports</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3e484f]/30">
                  {hosts.map((h) => (
                    <tr key={h.id} className="hover:bg-[#2d3449]/30 text-xs font-mono">
                      <td className="px-4 py-2 text-[#8ed5ff]">{h.ip}</td>
                      <td className="px-4 py-2 text-[#dae2fd]">{h.hostname}</td>
                      <td className="px-4 py-2 text-[#bdc8d1]">{h.os}</td>
                      <td className="px-4 py-2 text-[#bdc8d1]">{h.ports.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
