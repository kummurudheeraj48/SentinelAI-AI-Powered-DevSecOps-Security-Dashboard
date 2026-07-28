import React, { useEffect, useRef, useState } from 'react';
import { ViewTab } from '../types';

interface OverviewDashboardViewProps {
  onNavigateToTab: (tab: ViewTab) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  onNavigateToTab,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const criticalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const highCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const snortCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mainChartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render sparkline helper
  const drawSparkline = (
    canvas: HTMLCanvasElement | null,
    color: string,
    data: number[]
  ) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 200);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 40);

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - val * height * 0.8 - height * 0.1;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  // Render main activity chart
  const drawMainActivity = () => {
    const canvas = mainChartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const displayW = canvas.parentElement?.clientWidth || 600;
    const displayH = canvas.parentElement?.clientHeight || 300;

    canvas.width = displayW * window.devicePixelRatio;
    canvas.height = displayH * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const weeklyPoints = [40, 55, 45, 70, 60, 85, 75, 95, 80, 110, 100, 120, 115, 140];
    const monthlyPoints = [20, 35, 30, 45, 60, 50, 75, 90, 85, 120, 130, 110, 150, 160];
    const dataPoints = timeframe === 'weekly' ? weeklyPoints : monthlyPoints;

    // Gradient Fill for Immersive Theme
    const grad = ctx.createLinearGradient(0, 0, 0, displayH);
    grad.addColorStop(0, 'rgba(255, 92, 38, 0.35)');
    grad.addColorStop(1, 'rgba(255, 92, 38, 0)');

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff5c26';
    ctx.fillStyle = grad;

    ctx.beginPath();
    dataPoints.forEach((val, i) => {
      const x = (i / (dataPoints.length - 1)) * displayW;
      const y = displayH - (val / 170) * displayH;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const xc = (x + ((i - 1) / (dataPoints.length - 1)) * displayW) / 2;
        const prevY = displayH - (dataPoints[i - 1] / 170) * displayH;
        ctx.bezierCurveTo(xc, prevY, xc, y, x, y);
      }
    });
    ctx.stroke();

    // Close path for fill
    ctx.lineTo(displayW, displayH);
    ctx.lineTo(0, displayH);
    ctx.closePath();
    ctx.fill();

    // Highlight points
    dataPoints.forEach((val, i) => {
      if (i % 2 === 0) {
        const x = (i / (dataPoints.length - 1)) * displayW;
        const y = displayH - (val / 170) * displayH;
        ctx.fillStyle = '#ffb199';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0a0502';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    drawSparkline(criticalCanvasRef.current, '#ff3b30', [0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.8]);
    drawSparkline(highCanvasRef.current, '#ff5c26', [0.3, 0.4, 0.3, 0.5, 0.4, 0.4, 0.4]);
    drawSparkline(hostsCanvasRef.current, '#ffb199', [0.8, 0.82, 0.81, 0.85, 0.84, 0.88, 0.9]);
    drawSparkline(snortCanvasRef.current, '#f59e0b', [0.2, 0.5, 0.3, 0.8, 0.6, 0.7, 0.5]);
    drawMainActivity();

    const handleResize = () => {
      drawMainActivity();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [timeframe]);

  return (
    <div className="p-6 space-y-6">
      {/* High-Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Critical Flaws */}
        <div
          onClick={() => onNavigateToTab('vulnerabilities')}
          className="immersive-card p-5 rounded-2xl metric-card-glow transition-all cursor-pointer hover:border-[#ff3b30]/60 shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#c2b2a8] font-mono text-xs uppercase tracking-wider">Critical Flaws</span>
            <div className="w-9 h-9 rounded-xl bg-[#ff3b30]/20 border-l-2 border-[#ff3b30] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ff8c82] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif font-bold text-4xl text-[#ff8c82]">12</span>
            <div className="mb-1">
              <span className="text-[#ff8c82] font-mono text-[10px] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> +3%
              </span>
            </div>
          </div>
          <div className="h-8 mt-4 w-full">
            <canvas ref={criticalCanvasRef} className="w-full h-full opacity-80" />
          </div>
        </div>

        {/* High Risks */}
        <div
          onClick={() => onNavigateToTab('vulnerabilities')}
          className="immersive-card p-5 rounded-2xl metric-card-glow transition-all cursor-pointer hover:border-[#ff5c26]/60 shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#c2b2a8] font-mono text-xs uppercase tracking-wider">High Risks</span>
            <div className="w-9 h-9 rounded-xl bg-[#ff5c26]/20 border-l-2 border-[#ff5c26] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ffb199] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency_home
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif font-bold text-4xl text-[#f2e7e0]">24</span>
            <div className="mb-1">
              <span className="text-[#ffb199] font-mono text-[10px] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_flat</span> STABLE
              </span>
            </div>
          </div>
          <div className="h-8 mt-4 w-full">
            <canvas ref={highCanvasRef} className="w-full h-full opacity-80" />
          </div>
        </div>

        {/* Active Hosts */}
        <div
          onClick={() => onNavigateToTab('network')}
          className="immersive-card p-5 rounded-2xl metric-card-glow transition-all cursor-pointer hover:border-[#ffb199]/60 shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#c2b2a8] font-mono text-xs uppercase tracking-wider">Active Hosts</span>
            <div className="w-9 h-9 rounded-xl bg-[#ffb199]/20 border-l-2 border-[#ffb199] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ffb199] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                router
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif font-bold text-4xl text-[#ffb199]">1,402</span>
            <div className="mb-1">
              <span className="text-[#ffb199] font-mono text-[10px] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> +12
              </span>
            </div>
          </div>
          <div className="h-8 mt-4 w-full">
            <canvas ref={hostsCanvasRef} className="w-full h-full opacity-80" />
          </div>
        </div>

        {/* Snort IDS */}
        <div
          onClick={() => onNavigateToTab('network')}
          className="immersive-card p-5 rounded-2xl metric-card-glow transition-all cursor-pointer hover:border-[#f59e0b]/60 shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#c2b2a8] font-mono text-xs uppercase tracking-wider">Snort IDS (24h)</span>
            <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/20 border-l-2 border-[#f59e0b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#fde68a] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-serif font-bold text-4xl text-[#fde68a]">86</span>
            <div className="mb-1 text-[#c2b2a8] font-mono text-[10px]">TOTAL EVENTS</div>
          </div>
          <div className="h-8 mt-4 w-full">
            <canvas ref={snortCanvasRef} className="w-full h-full opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Grid: Activity & System Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[480px]">
        {/* Security Events Activity (Left Column) */}
        <div className="lg:col-span-8 immersive-card rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#ff5c26]/20 flex items-center justify-between bg-[#140b06]/60">
            <h3 className="font-serif font-bold text-[#f2e7e0] text-lg">Security Events History</h3>
            <div className="flex gap-1.5 bg-[#0a0502]/80 p-1 rounded-xl border border-[#ff5c26]/20">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 text-xs font-mono rounded-lg cursor-pointer transition-colors ${
                  timeframe === 'weekly'
                    ? 'bg-[#ff5c26]/20 text-[#ffb199] font-bold border border-[#ff5c26]/40'
                    : 'text-[#c2b2a8] hover:text-[#f2e7e0]'
                }`}
              >
                WEEKLY
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 text-xs font-mono rounded-lg cursor-pointer transition-colors ${
                  timeframe === 'monthly'
                    ? 'bg-[#ff5c26]/20 text-[#ffb199] font-bold border border-[#ff5c26]/40'
                    : 'text-[#c2b2a8] hover:text-[#f2e7e0]'
                }`}
              >
                MONTHLY
              </button>
            </div>
          </div>

          <div className="flex-1 relative p-6 min-h-[320px] flex flex-col justify-center">
            {/* Background Grid Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none">
              <div className="w-full border-b border-[#ff5c26]/10 h-0"></div>
              <div className="w-full border-b border-[#ff5c26]/10 h-0"></div>
              <div className="w-full border-b border-[#ff5c26]/10 h-0"></div>
              <div className="w-full border-b border-[#ff5c26]/10 h-0"></div>
              <div className="w-full border-b border-[#ff5c26]/10 h-0"></div>
            </div>
            <canvas ref={mainChartCanvasRef} className="w-full h-full relative z-10 min-h-[280px]" />
          </div>
        </div>

        {/* System Architecture Status (Right Column) */}
        <div className="lg:col-span-4 immersive-card rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#ff5c26]/20 flex items-center justify-between bg-[#140b06]/60">
            <h3 className="font-serif font-bold text-[#f2e7e0] text-lg">System Architecture</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
              ONLINE
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Architecture Tree */}
            <div className="relative pl-4 space-y-4">
              <div className="absolute left-0 top-2 bottom-8 w-px bg-[#ff5c26]/30"></div>

              {/* Edge Gateway */}
              <div className="relative flex items-center gap-3">
                <div className="absolute -left-4 w-4 h-px bg-[#ff5c26]/30"></div>
                <div className="p-3 bg-[#180f0a]/90 border border-[#ff5c26]/30 rounded-xl flex-1 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#ff5c26] text-lg">lan</span>
                    <span className="font-mono text-xs font-bold text-[#f2e7e0]">EDGE GATEWAY</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#ffb199] font-bold uppercase tracking-wider bg-[#ff5c26]/15 px-2 py-0.5 rounded-md border border-[#ff5c26]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c26] animate-pulse"></span> Operational
                  </span>
                </div>
              </div>

              {/* Sub-branches */}
              <div className="pl-6 space-y-3 relative">
                <div className="absolute -left-6 top-0 bottom-4 w-px bg-[#ff5c26]/30"></div>

                {/* API Cluster */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-6 w-6 h-px bg-[#ff5c26]/30"></div>
                  <div className="p-3 bg-[#140b06]/80 border border-[#ff5c26]/20 rounded-xl flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#c2b2a8] text-lg">api</span>
                      <span className="font-mono text-xs text-[#f2e7e0]">API CLUSTER v2</span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                  </div>
                </div>

                {/* Postgres Master */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-6 w-6 h-px bg-[#ff5c26]/30"></div>
                  <div className="p-3 bg-[#140b06]/80 border border-[#ff5c26]/20 rounded-xl flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#c2b2a8] text-lg">database</span>
                      <span className="font-mono text-xs text-[#f2e7e0]">POSTGRES MASTER</span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                  </div>
                </div>

                {/* Worker Nodes */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-6 w-6 h-px bg-[#ff5c26]/30"></div>
                  <div className="p-3 bg-[#140b06]/80 border border-[#ff5c26]/20 rounded-xl flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#c2b2a8] text-lg">memory</span>
                      <span className="font-mono text-xs text-[#f2e7e0]">WORKER NODES (08)</span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Health Stats */}
            <div className="pt-4 border-t border-[#ff5c26]/20 grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#0a0502]/80 rounded-xl border border-[#ff5c26]/20">
                <p className="text-[10px] text-[#c2b2a8] uppercase font-mono mb-1">CPU Load</p>
                <p className="font-mono text-base font-bold text-[#ffb199]">34.2%</p>
              </div>
              <div className="p-3 bg-[#0a0502]/80 rounded-xl border border-[#ff5c26]/20">
                <p className="text-[10px] text-[#c2b2a8] uppercase font-mono mb-1">RAM Usage</p>
                <p className="font-mono text-base font-bold text-[#ffb199]">12.8 GB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating FAB trigger for AI Assistant */}
      <div className="fixed bottom-8 right-8 z-[50]">
        <button
          onClick={() => onNavigateToTab('assistant')}
          className="w-14 h-14 bg-gradient-to-br from-[#ff5c26] to-[#d9410d] text-[#0a0502] rounded-2xl shadow-xl shadow-[#ff5c26]/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group cursor-pointer border border-[#ffb199]/40"
          title="Open AI Security Co-pilot"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform font-bold">
            smart_toy
          </span>
        </button>
      </div>
    </div>
  );
};
