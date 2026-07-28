import React, { useState } from 'react';
import { SecurityFinding } from '../types';

interface RemediationDrawerProps {
  finding: SecurityFinding | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyFix: (findingId: string) => void;
}

export const RemediationDrawer: React.FC<RemediationDrawerProps> = ({
  finding,
  isOpen,
  onClose,
  onApplyFix,
}) => {
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [customFix, setCustomFix] = useState<string | null>(null);
  const [customExplanation, setCustomExplanation] = useState<string | null>(null);

  if (!finding) return null;

  const currentFix = customFix || finding.suggestedFix;
  const currentExplanation = customExplanation || finding.remediationExplanation;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyPr = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      onApplyFix(finding.id);
      alert(`Auto-PR #${Math.floor(Math.random() * 900 + 100)} created & merged successfully for ${finding.cve}! Status updated to Resolved.`);
    }, 1200);
  };

  const handleRegenerateWithGemini = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cve: finding.cve,
          title: finding.title,
          filePath: finding.filePath,
          vulnerableCode: finding.vulnerableCode,
        }),
      });
      const data = await res.json();
      if (data.suggestedFix) {
        setCustomFix(data.suggestedFix);
      }
      if (data.explanation) {
        setCustomExplanation(data.explanation);
      }
    } catch (err) {
      console.error('Failed to regenerate fix:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-[#ffb4ab] severity-critical';
      case 'high':
        return 'text-[#f97316] severity-high';
      case 'medium':
        return 'text-[#03b5d3] severity-medium';
      default:
        return 'text-[#38bdf8] severity-low';
    }
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#0b1326]/60 backdrop-blur-sm z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-[#140b06]/95 backdrop-blur-2xl border-l border-[#ff5c26]/30 z-[60] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#ff5c26]/20 flex items-center justify-between bg-[#0a0502]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ff5c26]/15 rounded-xl border border-[#ff5c26]/30">
              <span
                className="material-symbols-outlined text-[#ff5c26] text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_fix
              </span>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#f2e7e0]">AI Remediation</h3>
              <p className="text-xs text-[#ffb199] font-mono">SentinelAI Engine v2.4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-[#c2b2a8] hover:text-[#f2e7e0] text-2xl cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Vulnerability Detail */}
          <div className="space-y-2">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold border ${getSeverityBadgeClass(finding.severity)}`}>
              {finding.severity} Severity
            </span>
            <h4 className="text-xl font-serif font-bold text-[#f2e7e0]">
              {finding.cve}: {finding.title}
            </h4>
            <p className="text-[#c2b2a8] text-sm leading-relaxed">
              {finding.description}
            </p>
            <p className="text-xs text-[#c2b2a8]/70 font-mono">
              File: <span className="text-[#ffb199]">{finding.filePath}</span>
            </p>
          </div>

          {/* Vulnerable Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-[#c2b2a8] uppercase tracking-wider">
                Vulnerable Code
              </p>
              <span className="text-[10px] text-[#ff8c82] font-mono">
                Line {finding.lineNumber || 142}
              </span>
            </div>
            <div className="bg-[#0a0502] p-4 rounded-xl text-xs leading-relaxed relative overflow-x-auto border border-[#ff3b30]/30">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff3b30]"></div>
              <pre className="text-[#f2e7e0] font-mono whitespace-pre text-[11px] leading-6">
                {finding.vulnerableCode}
              </pre>
            </div>
          </div>

          {/* AI Suggested Fix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-[#ff5c26] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>SentinelAI Suggested Fix</span>
                {isGeneratingAi && <span className="text-[10px] text-[#ffb199] animate-pulse">(Generating with Gemini...)</span>}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerateWithGemini}
                  disabled={isGeneratingAi}
                  className="text-[10px] text-[#ffb199] flex items-center gap-1 font-mono hover:underline cursor-pointer disabled:opacity-50"
                  title="Ask Gemini to re-analyze and craft an updated fix"
                >
                  <span className="material-symbols-outlined text-[12px]">refresh</span> Re-generate AI
                </button>
                <button
                  onClick={handleCopy}
                  className="text-[10px] text-[#ff5c26] flex items-center gap-1 font-mono hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[12px]">content_copy</span>
                  {copied ? 'Copied!' : 'Copy Fix'}
                </button>
              </div>
            </div>

            <div className="bg-[#0a0502] p-4 rounded-xl text-xs leading-relaxed relative border border-[#ff5c26]/40 shadow-[inset_0_0_15px_rgba(255,92,38,0.08)] overflow-x-auto">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5c26]"></div>
              <pre className="text-[#f2e7e0] font-mono whitespace-pre text-[11px] leading-6">
                {currentFix}
              </pre>
            </div>

            {/* Explanation box */}
            <div className="bg-[#ff5c26]/10 p-3.5 rounded-xl border border-[#ff5c26]/30 flex gap-3">
              <span className="material-symbols-outlined text-[#ff5c26] text-lg shrink-0 mt-0.5">
                info
              </span>
              <p className="text-xs text-[#c2b2a8] leading-relaxed">
                {currentExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#ff5c26]/20 flex gap-3 bg-[#0a0502]/80">
          <button
            onClick={handleApplyPr}
            disabled={isApplying || finding.status === 'Resolved'}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              finding.status === 'Resolved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-br from-[#ff5c26] to-[#d9410d] text-white hover:brightness-110 shadow-lg shadow-[#ff5c26]/25 active:scale-98'
            }`}
          >
            <span className="material-symbols-outlined text-lg">bolt</span>
            {isApplying
              ? 'Creating Pull Request...'
              : finding.status === 'Resolved'
              ? 'Fix Applied (Resolved)'
              : 'Apply Fix Auto-PR'}
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(`SentinelAI Vulnerability Report - ${finding.cve}: ${finding.title} in ${finding.filePath}`);
              alert('Vulnerability report payload copied to clipboard!');
            }}
            title="Share vulnerability report"
            className="bg-[#22130b] p-3 rounded-xl border border-[#ff5c26]/30 hover:bg-[#2e190e] text-[#f2e7e0] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </button>
        </div>
      </div>
    </>
  );
};
