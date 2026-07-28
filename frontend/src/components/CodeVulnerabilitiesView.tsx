import React, { useState, useMemo } from 'react';
import { SecurityFinding, Severity } from '../types';
import { RemediationDrawer } from './RemediationDrawer';

interface CodeVulnerabilitiesViewProps {
  findings: SecurityFinding[];
  searchQuery: string;
  onApplyFix: (findingId: string) => void;
  onRescan: () => void;
}

export const CodeVulnerabilitiesView: React.FC<CodeVulnerabilitiesViewProps> = ({
  findings,
  searchQuery,
  onApplyFix,
  onRescan,
}) => {
  const [selectedFinding, setSelectedFinding] = useState<SecurityFinding | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const itemsPerPage = 4;

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      const matchesSearch =
        searchQuery === '' ||
        f.cve.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.scanner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity =
        selectedSeverity === 'All' || f.severity.toLowerCase() === selectedSeverity.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All' || f.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [findings, searchQuery, selectedSeverity, selectedStatus]);

  const totalPages = Math.ceil(filteredFindings.length / itemsPerPage) || 1;
  const currentFindings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFindings.slice(start, start + itemsPerPage);
  }, [filteredFindings, currentPage]);

  const openFindingDrawer = (finding: SecurityFinding) => {
    setSelectedFinding(finding);
    setIsDrawerOpen(true);
  };

  const getSeverityStyle = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return 'text-[#ffb4ab] severity-critical';
      case 'High':
        return 'text-[#f97316] severity-high';
      case 'Medium':
        return 'text-[#03b5d3] severity-medium';
      case 'Low':
      default:
        return 'text-[#38bdf8] severity-low';
    }
  };

  const getScannerStyle = (scanner: string) => {
    if (scanner.includes('Semgrep') || scanner.includes('SAST')) {
      return 'bg-[#ff5c26]/15 text-[#ffb199] border-[#ff5c26]/30';
    }
    if (scanner.includes('ZAP') || scanner.includes('DAST')) {
      return 'bg-[#f59e0b]/15 text-[#fde68a] border-[#f59e0b]/30';
    }
    if (scanner.includes('Trivy') || scanner.includes('Container')) {
      return 'bg-[#ff7849]/15 text-[#ffb199] border-[#ff7849]/30';
    }
    return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Open':
        return <span className="w-2 h-2 rounded-full bg-[#ff3b30] animate-pulse"></span>;
      case 'In Progress':
        return <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>;
      case 'Resolved':
        return <span className="w-2 h-2 rounded-full bg-emerald-400"></span>;
      default:
        return <span className="w-2 h-2 rounded-full bg-gray-400"></span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#f2e7e0] mb-1 tracking-tight">Security Findings</h2>
          <p className="text-[#c2b2a8] text-sm">
            Proactive code analysis and vulnerability management.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`px-4 py-2 rounded-xl border border-[#ff5c26]/30 flex items-center gap-2 text-sm text-[#f2e7e0] hover:bg-[#22130b] transition-colors cursor-pointer ${
              selectedSeverity !== 'All' || selectedStatus !== 'All' ? 'bg-[#ff5c26]/20 border-[#ff5c26]' : 'bg-[#140b06]/80'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-[#ff5c26]">filter_list</span>
            <span>Filters {selectedSeverity !== 'All' || selectedStatus !== 'All' ? '(Active)' : ''}</span>
          </button>
          <button
            onClick={onRescan}
            className="bg-gradient-to-br from-[#ff5c26] to-[#d9410d] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#ff5c26]/25 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Rescan codebase</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdown Bar (Collapsible) */}
      {showFiltersModal && (
        <div className="immersive-card p-4 rounded-2xl flex flex-wrap items-center gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#c2b2a8]">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0a0502] text-xs text-[#f2e7e0] border border-[#ff5c26]/30 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#ff5c26]"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#c2b2a8]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0a0502] text-xs text-[#f2e7e0] border border-[#ff5c26]/30 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#ff5c26]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {(selectedSeverity !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSelectedSeverity('All');
                setSelectedStatus('All');
                setCurrentPage(1);
              }}
              className="text-xs text-[#ff5c26] hover:underline font-mono ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="immersive-card p-4 rounded-2xl metric-card-glow transition-all">
          <p className="text-[#c2b2a8] text-xs font-mono mb-1 uppercase tracking-wider">Total Findings</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#f2e7e0]">128</span>
            <span className="text-[#ff8c82] text-xs font-mono">+12%</span>
          </div>
        </div>

        <div className="immersive-card p-4 rounded-2xl metric-card-glow transition-all">
          <p className="text-[#c2b2a8] text-xs font-mono mb-1 uppercase tracking-wider">Critical Issues</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#ff8c82]">09</span>
            <span className="text-[#c2b2a8] text-xs opacity-50 font-mono">/ 128</span>
          </div>
        </div>

        <div className="immersive-card p-4 rounded-2xl metric-card-glow transition-all">
          <p className="text-[#c2b2a8] text-xs font-mono mb-1 uppercase tracking-wider">Remediation Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#ffb199]">84%</span>
          </div>
        </div>

        <div className="immersive-card p-4 rounded-2xl metric-card-glow transition-all">
          <p className="text-[#c2b2a8] text-xs font-mono mb-1 uppercase tracking-wider">MTTR</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#f2e7e0]">4.2h</span>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="immersive-card rounded-2xl border border-[#ff5c26]/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#140b06]/80 border-b border-[#ff5c26]/20">
              <tr>
                <th className="px-6 py-3.5 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3.5 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">CVE ID / Finding</th>
                <th className="px-6 py-3.5 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">Scanner</th>
                <th className="px-6 py-3.5 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">File Path</th>
                <th className="px-6 py-3.5 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-mono text-[#c2b2a8] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ff5c26]/15">
              {currentFindings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#c2b2a8] text-sm">
                    No security findings match your current search/filter criteria.
                  </td>
                </tr>
              ) : (
                currentFindings.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => openFindingDrawer(f)}
                    className="hover:bg-[#ff5c26]/10 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold ${getSeverityStyle(f.severity)}`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#f2e7e0] text-sm font-mono">{f.cve}</div>
                      <div className="text-xs text-[#c2b2a8] mt-0.5 truncate max-w-xs">{f.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`border px-2.5 py-0.5 rounded-md text-[10px] font-mono ${getScannerStyle(f.scanner)}`}>
                        {f.scanner}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#c2b2a8]">
                      {f.filePath}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusDot(f.status)}
                        <span className="text-xs text-[#f2e7e0]">{f.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="material-symbols-outlined text-[#c2b2a8] group-hover:text-[#ff5c26] transition-colors">
                        chevron_right
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-[#140b06]/80 border-t border-[#ff5c26]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#c2b2a8]">
            Showing {filteredFindings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredFindings.length)} of {filteredFindings.length} findings
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-[#ff5c26]/30 flex items-center justify-center text-[#c2b2a8] hover:bg-[#ff5c26]/15 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors ${
                  currentPage === page
                    ? 'border-[#ff5c26] text-[#ffb199] bg-[#ff5c26]/20'
                    : 'border-[#ff5c26]/30 text-[#c2b2a8] hover:bg-[#ff5c26]/15'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-[#ff5c26]/30 flex items-center justify-center text-[#c2b2a8] hover:bg-[#ff5c26]/15 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Remediation Drawer */}
      <RemediationDrawer
        finding={selectedFinding}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApplyFix={onApplyFix}
      />
    </div>
  );
};
