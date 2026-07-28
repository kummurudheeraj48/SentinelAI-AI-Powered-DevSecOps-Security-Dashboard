import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface AiAssistantViewProps {
  onApplyWafPatch?: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ onApplyWafPatch }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'user',
      timestamp: '14:32:05',
      text: "Explain the 'ET EXPLOIT Possible Struts RCE' alert from the Snort log.",
    },
    {
      id: 'm-2',
      sender: 'ai',
      timestamp: '14:32:06',
      analysis:
        'The alert refers to a Remote Code Execution (RCE) attempt targeting Apache Struts 2. It specifically identifies an exploit of CVE-2017-5638, which occurs via a crafted Content-Type HTTP header. The Jakarta Multipart parser in Struts incorrectly handles error messages, allowing an attacker to inject and execute arbitrary OGNL (Object-Graph Navigation Language) expressions.',
      impact: [
        'Full System Compromise: Attacker can execute commands with the privileges of the web server user.',
        'Data Exfiltration: Unauthorized access to underlying databases and configuration files.',
        'Lateral Movement: Potential pivot point into the internal network segment.',
      ],
      immediateAction: 'Update Apache Struts to version 2.3.32 or 2.5.10.1 immediately.',
      wafPolicy: 'Enable strict filtering of the Content-Type header to reject # characters.',
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [wafApplied, setWafApplied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendPrompt = async (promptText: string) => {
    const textToSend = promptText.trim();
    if (!textToSend || isSending) return;

    const userMsgId = 'u-' + Date.now();
    const timeStr = new Date().toTimeString().split(' ')[0];

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        timestamp: timeStr,
        text: textToSend,
      },
    ];

    setMessages(newMessages);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          timestamp: new Date().toTimeString().split(' ')[0],
          analysis: data.analysis || 'Analysis complete for your query.',
          impact: data.impact || [
            'Unauthorized system access vector',
            'Confidential data exfiltration risk',
            'Service degradation or downtime',
          ],
          immediateAction: data.immediateAction || 'Apply vendor patches & enforce strict parameters.',
          wafPolicy: data.wafPolicy || 'Enforce strict WAF boundary validation.',
        },
      ]);
    } catch (err) {
      console.error('AI chat query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          timestamp: new Date().toTimeString().split(' ')[0],
          analysis:
            'Unable to communicate with the AI engine. Please verify network status or GEMINI_API_KEY.',
          impact: ['AI analysis temporarily unavailable'],
          immediateAction: 'Verify server environment configuration.',
          wafPolicy: 'Maintain standard security posture.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleApplyWaf = () => {
    setWafApplied(true);
    if (onApplyWafPatch) onApplyWafPatch();
    alert('WAF Rule #8841-B automatically deployed to Edge Gateway! Content-Type injection patterns blocked.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative overflow-hidden bg-transparent">
      {/* Background visual atmosphere glows */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#ff5c26]/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed top-0 left-[260px] w-80 h-80 bg-[#ffb199]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Main Chat Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-10 pb-36">
          {/* Today's Session Divider */}
          <div className="flex items-center gap-4 opacity-40">
            <div className="h-px flex-1 bg-[#ff5c26]/30" />
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-[#ffb199]">
              Today's Session
            </span>
            <div className="h-px flex-1 bg-[#ff5c26]/30" />
          </div>

          {/* Chat Messages */}
          {messages.map((msg) =>
            msg.sender === 'user' ? (
              /* User Message */
              <div key={msg.id} className="flex flex-col items-end gap-2 max-w-[85%] ml-auto">
                <div className="flex items-center gap-2 text-[#c2b2a8] text-[11px] font-mono mr-1">
                  <span>{msg.timestamp}</span>
                  <span className="material-symbols-outlined text-[14px]">person</span>
                </div>
                <div className="bg-[#22130b] px-5 py-3.5 rounded-2xl rounded-tr-none border border-[#ff5c26]/30 text-[#f2e7e0] shadow-md">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ) : (
              /* AI Response Card */
              <div key={msg.id} className="flex flex-col items-start gap-2 max-w-[92%]">
                <div className="flex items-center gap-2 text-[#ff5c26] text-[11px] font-mono ml-1 font-bold">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    smart_toy
                  </span>
                  <span>SENTINEL-CORE v2.4</span>
                </div>

                <div className="immersive-card p-6 md:p-8 rounded-2xl rounded-tl-none border border-[#ff5c26]/30 text-[#f2e7e0] space-y-6 shadow-2xl w-full">
                  {/* Analysis */}
                  {msg.analysis && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#ff5c26] font-bold text-xs uppercase tracking-widest font-mono">
                        <span className="material-symbols-outlined text-base">search</span>
                        <span>Analysis</span>
                      </div>
                      <p className="text-sm leading-relaxed text-[#c2b2a8]">
                        {msg.analysis}
                      </p>
                    </div>
                  )}

                  {/* Impact */}
                  {msg.impact && msg.impact.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#ff8c82] font-bold text-xs uppercase tracking-widest font-mono">
                        <span className="material-symbols-outlined text-base">warning</span>
                        <span>Impact</span>
                      </div>
                      <div className="bg-[#1e1008]/80 p-4 rounded-xl border-l-2 border-[#ff3b30]">
                        <ul className="list-disc list-inside space-y-1.5 text-[#c2b2a8] text-xs leading-relaxed">
                          {msg.impact.map((point, idx) => (
                            <li key={idx}>
                              <span className="text-[#f2e7e0] font-medium">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Remediation */}
                  {(msg.immediateAction || msg.wafPolicy) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#ffb199] font-bold text-xs uppercase tracking-widest font-mono">
                        <span className="material-symbols-outlined text-base">build</span>
                        <span>Remediation</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {msg.immediateAction && (
                          <div className="bg-[#140b06]/80 border border-[#ff5c26]/20 p-4 rounded-xl">
                            <p className="text-xs font-bold text-[#ff5c26] mb-1.5">Immediate Action</p>
                            <p className="text-xs text-[#c2b2a8] leading-relaxed">{msg.immediateAction}</p>
                          </div>
                        )}
                        {msg.wafPolicy && (
                          <div className="bg-[#140b06]/80 border border-[#ff5c26]/20 p-4 rounded-xl">
                            <p className="text-xs font-bold text-[#ff5c26] mb-1.5">WAF Policy</p>
                            <p className="text-xs text-[#c2b2a8] leading-relaxed">{msg.wafPolicy}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#ff5c26]/20 flex flex-wrap justify-between items-center gap-3">
                        <button
                          onClick={handleApplyWaf}
                          disabled={wafApplied}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            wafApplied
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-gradient-to-br from-[#ff5c26] to-[#d9410d] text-white hover:brightness-110 shadow-lg shadow-[#ff5c26]/25'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">verified</span>
                          {wafApplied ? 'WAF Patch Active' : 'Apply WAF Patch'}
                        </button>

                        <div className="flex gap-4 text-[#c2b2a8]">
                          <button
                            onClick={() => alert('Feedback submitted: Useful response!')}
                            className="hover:text-[#ff5c26] transition-colors cursor-pointer"
                            title="Helpful"
                          >
                            <span className="material-symbols-outlined text-lg">thumb_up</span>
                          </button>
                          <button
                            onClick={() => alert('Feedback submitted: Flagged for review.')}
                            className="hover:text-[#ff8c82] transition-colors cursor-pointer"
                            title="Not Helpful"
                          >
                            <span className="material-symbols-outlined text-lg">thumb_down</span>
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.analysis || '');
                              alert('Analysis text copied to clipboard!');
                            }}
                            className="hover:text-[#ffb199] transition-colors cursor-pointer"
                            title="Copy Analysis"
                          >
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* Generating Indicator */}
          {isSending && (
            <div className="flex items-center gap-3 text-[#ff5c26] text-xs font-mono p-4 bg-[#140b06] rounded-2xl border border-[#ff5c26]/30 animate-pulse">
              <span className="material-symbols-outlined text-base animate-spin">sync</span>
              <span>SentinelAI Gemini Engine analyzing vulnerability telemetry...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/90 to-transparent pt-10">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Suggested Prompts Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleSendPrompt("How do I fix CVE-2021-44228?")}
              className="px-3.5 py-1.5 rounded-full border border-[#ff5c26]/25 bg-[#18100a] text-[#ffb199] text-xs hover:border-[#ff5c26] hover:bg-[#ff5c26]/15 transition-all cursor-pointer font-mono"
            >
              "How do I fix CVE-2021-44228?"
            </button>
            <button
              onClick={() => handleSendPrompt("List all critical SAST findings.")}
              className="px-3.5 py-1.5 rounded-full border border-[#ff5c26]/25 bg-[#18100a] text-[#ffb199] text-xs hover:border-[#ff5c26] hover:bg-[#ff5c26]/15 transition-all cursor-pointer font-mono"
            >
              "List all critical SAST findings."
            </button>
            <button
              onClick={() => handleSendPrompt("Summarize recent IDS alerts")}
              className="px-3.5 py-1.5 rounded-full border border-[#ff5c26]/25 bg-[#18100a] text-[#ffb199] text-xs hover:border-[#ff5c26] hover:bg-[#ff5c26]/15 transition-all cursor-pointer font-mono"
            >
              "Summarize recent IDS alerts"
            </button>
          </div>

          {/* Main Input Box */}
          <div className="relative bg-[#140b06]/95 border border-[#ff5c26]/30 focus-within:border-[#ff5c26] rounded-2xl shadow-2xl transition-all p-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(input);
              }}
              className="flex items-end gap-2 px-2 pb-1 pt-1"
            >
              <button
                type="button"
                onClick={() => alert("Attachment added: snort_telemetry.log attached to prompt.")}
                className="p-2 text-[#c2b2a8] hover:text-[#ff5c26] transition-colors cursor-pointer mb-1"
                title="Attach Log File or Code Snippet"
              >
                <span className="material-symbols-outlined text-xl">attachment</span>
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt(input);
                  }
                }}
                placeholder="Ask SentinelAI for threat analysis or remediation..."
                rows={1}
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[#f2e7e0] placeholder-[#c2b2a8]/50 resize-none py-2.5 min-h-[44px] max-h-36 text-sm"
              />

              <div className="flex items-center gap-1 mb-1">
                <button
                  type="button"
                  onClick={() => alert("Voice input listening... speak your security query.")}
                  className="w-9 h-9 flex items-center justify-center text-[#c2b2a8] hover:text-[#ff5c26] transition-colors cursor-pointer"
                  title="Voice Command Input"
                >
                  <span className="material-symbols-outlined text-xl">mic</span>
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="bg-gradient-to-br from-[#ff5c26] to-[#d9410d] text-white w-9 h-9 rounded-xl flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all shadow-md shadow-[#ff5c26]/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                </button>
              </div>
            </form>
          </div>

          <p className="text-[10px] text-center text-[#c2b2a8]/40 font-mono">
            SentinelAI can make mistakes. Verify critical remediation steps before implementation.
          </p>
        </div>
      </div>
    </div>
  );
};
