export type ViewTab = 'overview' | 'vulnerabilities' | 'network' | 'assistant';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface SecurityFinding {
  id: string;
  cve: string;
  title: string;
  severity: Severity;
  scanner: string;
  filePath: string;
  lineNumber?: number;
  status: 'Open' | 'In Progress' | 'Resolved';
  vulnerableCode: string;
  lineNumbersText: string;
  suggestedFix: string;
  fixLineNumbersText: string;
  description: string;
  remediationExplanation: string;
}

export interface ActiveHost {
  id: string;
  ip: string;
  hostname: string;
  ports: number[];
  status: 'active' | 'warning' | 'offline';
  mac?: string;
  os?: string;
  subnet?: string;
}

export interface SnortLogEvent {
  id: string;
  timestamp: string;
  severity: 1 | 2 | 3;
  severityLabel: 'CRITICAL' | 'WARNING' | 'INFO';
  msg: string;
  srcIp: string;
  dstIp: string;
  srcPort?: number;
  dstPort?: number;
  rawRule?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  text?: string;
  analysis?: string;
  impact?: string[];
  immediateAction?: string;
  wafPolicy?: string;
  isGenerating?: boolean;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  status: 'Operational' | 'Warning' | 'Critical';
  icon: string;
  type: 'gateway' | 'cluster' | 'database' | 'worker';
  subnodes?: ArchitectureNode[];
}
