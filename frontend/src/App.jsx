import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, Network, Cpu, CheckCircle } from 'lucide-react';

function App() {
  const [health, setHealth] = useState("Checking backend...");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Test connection to FastAPI backend
    axios.get('http://localhost:8000/health')
      .then(response => {
        setHealth(response.data.system + " (" + response.data.status + ")");
      })
      .catch(error => {
        setHealth("Backend offline or unreachable");
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', display: 'flex' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '260px', backgroundColor: '#1e293b', padding: '20px', borderRight: '1px solid #334155' }}>
        <h2 style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield /> SentinelAI
        </h2>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>DevSecOps & Network Security</p>
        
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
          <li onClick={() => setActiveTab('dashboard')} style={{ padding: '12px', cursor: 'pointer', backgroundColor: activeTab === 'dashboard' ? '#334155' : 'transparent', borderRadius: '6px', marginBottom: '8px' }}>
            📊 Overview Dashboard
          </li>
          <li onClick={() => setActiveTab('vulnerabilities')} style={{ padding: '12px', cursor: 'pointer', backgroundColor: activeTab === 'vulnerabilities' ? '#334155' : 'transparent', borderRadius: '6px', marginBottom: '8px' }}>
            🛡️ Code Vulnerabilities
          </li>
          <li onClick={() => setActiveTab('network')} style={{ padding: '12px', cursor: 'pointer', backgroundColor: activeTab === 'network' ? '#334155' : 'transparent', borderRadius: '6px', marginBottom: '8px' }}>
            🌐 Network & Snort IDS
          </li>
          <li onClick={() => setActiveTab('ai')} style={{ padding: '12px', cursor: 'pointer', backgroundColor: activeTab === 'ai' ? '#334155' : 'transparent', borderRadius: '6px', marginBottom: '8px' }}>
            🤖 AI Security Assistant
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #334155' }}>
          <h1>Security Operations Center</h1>
          <div style={{ background: '#1e293b', padding: '8px 15px', borderRadius: '20px', fontSize: '14px', border: '1px solid #334155' }}>
            Backend Status: <span style={{ color: health.includes('Active') ? '#4ade80' : '#f87171' }}>{health}</span>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                <h3>Critical Flaws</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0' }}>0</p>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
                <h3>High Risks</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0' }}>0</p>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                <h3>Active Network Hosts</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0' }}>1</p>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #4ade80' }}>
                <h3>Snort IDS Alerts</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0' }}>0</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px' }}>
              <h3>System Architecture Overview</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                SentinelAI is actively monitoring your code pipelines (via Semgrep, Trivy, Gitleaks, ZAP), database storage (PostgreSQL), and network infrastructure telemetry (Nmap & Snort IDS). Use the sidebar navigation to inspect individual monitoring panes.
              </p>
            </div>
          </div>
        )}

        {activeTab !== 'dashboard' && (
          <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
            <h2>Module Under Active Construction</h2>
            <p style={{ color: '#94a3b8' }}>This view will display live feeds for {activeTab}.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
