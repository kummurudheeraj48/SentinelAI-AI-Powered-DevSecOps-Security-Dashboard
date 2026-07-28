import { SecurityFinding, ActiveHost, SnortLogEvent, ArchitectureNode } from '../types';

export const initialFindings: SecurityFinding[] = [
  {
    id: 'f-1',
    cve: 'CVE-2023-4122',
    title: 'Broken Access Control: Unauthorized API Access',
    severity: 'Critical',
    scanner: 'SAST / Semgrep',
    filePath: '/src/api/auth_controller.py:142',
    lineNumber: 142,
    status: 'Open',
    vulnerableCode: `@app.route('/api/v1/user/settings', methods=['POST'])
def update_settings():
    data = request.json
    db.execute(f"UPDATE users SET theme='{data['theme']}' WHERE id={data['user_id']}")
    return {"status": "success"}`,
    lineNumbersText: '141\n142\n143\n144\n145',
    suggestedFix: `@app.route('/api/v1/user/settings', methods=['POST'])
@login_required
def update_settings():
    data = request.json
    # Using current_user and parameterized query
    db.execute("UPDATE users SET theme=? WHERE id=?", (data['theme'], current_user.id))
    return {"status": "success"}`,
    fixLineNumbersText: '141\n142\n143\n144\n145\n146',
    description: 'The endpoint /api/v1/user/settings lacks a permission check, allowing any authenticated user to modify parameters of other accounts by altering the user_id in the payload.',
    remediationExplanation: "The fix replaces the dynamic SQL injection vector with a parameterized query and enforces authorization by using the authenticated session's current_user.id instead of a request-provided ID.",
  },
  {
    id: 'f-2',
    cve: 'CVE-2023-1029',
    title: 'SQL Injection in User Profile Search',
    severity: 'High',
    scanner: 'DAST / ZAP',
    filePath: '/src/modules/search_svc.js:22',
    lineNumber: 22,
    status: 'In Progress',
    vulnerableCode: `const searchUsers = async (query) => {
  const sql = "SELECT * FROM users WHERE username LIKE '%" + query + "%'";
  return await db.raw(sql);
};`,
    lineNumbersText: '20\n21\n22\n23\n24',
    suggestedFix: `const searchUsers = async (query) => {
  const sql = "SELECT * FROM users WHERE username LIKE ?";
  return await db.raw(sql, [\`%\${query}%\`]);
};`,
    fixLineNumbersText: '20\n21\n22\n23\n24',
    description: 'User input in profile search parameter `q` is concatenated directly into SQL queries without sanitization or parameter binding.',
    remediationExplanation: 'Use parameterized query placeholders (?) with Knex/Postgres driver to prevent arbitrary SQL syntax injection.',
  },
  {
    id: 'f-3',
    cve: 'GHSA-23x4-p',
    title: "Vulnerable Sub-dependency: 'minimist'",
    severity: 'Medium',
    scanner: 'Container / Trivy',
    filePath: 'package-lock.json',
    lineNumber: 88,
    status: 'Open',
    vulnerableCode: `"minimist": {
  "version": "1.2.5",
  "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.5.tgz"
}`,
    lineNumbersText: '86\n87\n88\n89\n90',
    suggestedFix: `"minimist": {
  "version": "1.2.8",
  "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz"
}`,
    fixLineNumbersText: '86\n87\n88\n89\n90',
    description: "Prototype pollution vulnerability in 'minimist' <= 1.2.5 allows remote attackers to inject properties onto Object.prototype via crafted argument keys.",
    remediationExplanation: "Bump 'minimist' dependency version to >= 1.2.8 in package.json and run npm update to patch prototype pollution vector.",
  },
  {
    id: 'f-4',
    cve: 'Hardcoded Secret',
    title: 'AWS Secret Access Key exposed in code',
    severity: 'Critical',
    scanner: 'Secrets / Gitleaks',
    filePath: '/config/aws_provider.yaml:8',
    lineNumber: 8,
    status: 'Resolved',
    vulnerableCode: `aws:
  region: us-east-1
  access_key_id: AKIAIOSFODNN7EXAMPLE
  secret_access_key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`,
    lineNumbersText: '5\n6\n7\n8\n9',
    suggestedFix: `aws:
  region: us-east-1
  access_key_id: \${AWS_ACCESS_KEY_ID}
  secret_access_key: \${AWS_SECRET_ACCESS_KEY}`,
    fixLineNumbersText: '5\n6\n7\n8\n9',
    description: 'Plaintext credentials committed to source tree allow unauthorized access to AWS Cloud infrastructure.',
    remediationExplanation: 'Revoke compromised AWS key pair immediately in AWS IAM console, purge secret from git commit history, and inject via environment variables.',
  },
  {
    id: 'f-5',
    cve: 'CVE-2021-44228',
    title: 'Apache Log4j2 Remote Code Execution (Log4Shell)',
    severity: 'Critical',
    scanner: 'SAST / Semgrep',
    filePath: '/services/analytics/pom.xml:45',
    lineNumber: 45,
    status: 'Open',
    vulnerableCode: `<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.14.1</version>
</dependency>`,
    lineNumbersText: '43\n44\n45\n46\n47',
    suggestedFix: `<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.17.1</version>
</dependency>`,
    fixLineNumbersText: '43\n44\n45\n46\n47',
    description: 'JNDI features used in configuration, log messages, and parameters do not protect against attacker-controlled LDAP and RCE endpoints.',
    remediationExplanation: 'Upgrade log4j-core dependency to 2.17.1 or higher where JNDI lookup functionality is disabled by default.',
  },
  {
    id: 'f-6',
    cve: 'CWE-79',
    title: 'Cross-Site Scripting (XSS) in Comment Box',
    severity: 'High',
    scanner: 'DAST / ZAP',
    filePath: '/src/components/Comments.tsx:64',
    lineNumber: 64,
    status: 'In Progress',
    vulnerableCode: `<div dangerouslySetInnerHTML={{ __html: comment.content }} />`,
    lineNumbersText: '62\n63\n64\n65\n66',
    suggestedFix: `<div className="prose">{DOMPurify.sanitize(comment.content)}</div>`,
    fixLineNumbersText: '62\n63\n64\n65\n66',
    description: 'Unescaped user html rendering in comment section allows session hijacking and malicious script injection.',
    remediationExplanation: 'Sanitize user HTML markup using DOMPurify before rendering in JSX context.',
  }
];

export const initialActiveHosts: ActiveHost[] = [
  { id: 'h-1', ip: '10.0.4.102', hostname: 'prod-db-01', ports: [3306, 22], status: 'active', os: 'Ubuntu 22.04 LTS', subnet: '10.0.4.0/24' },
  { id: 'h-2', ip: '10.0.4.105', hostname: 'web-fe-01', ports: [80, 443, 8080], status: 'warning', os: 'Debian 11', subnet: '10.0.4.0/24' },
  { id: 'h-3', ip: '192.168.1.45', hostname: 'ops-workstation-12', ports: [22], status: 'active', os: 'Alpine Linux', subnet: '192.168.1.0/24' },
  { id: 'h-4', ip: '10.0.2.14', hostname: 'auth-srv-primary', ports: [389, 636], status: 'active', os: 'RedHat Enterprise 9', subnet: '10.0.2.0/24' },
  { id: 'h-5', ip: '10.0.1.5', hostname: 'edge-gateway-01', ports: [1194, 53], status: 'active', os: 'OpenWrt 23.05', subnet: '10.0.1.0/24' },
  { id: 'h-6', ip: '10.0.8.22', hostname: 'backup-node-omega', ports: [445, 2049], status: 'warning', os: 'FreeBSD 13.2', subnet: '10.0.8.0/24' },
];

export const initialSnortLogs: SnortLogEvent[] = [
  {
    id: 'l-1',
    timestamp: '2026-07-28T14:22:18.452Z',
    severity: 1,
    severityLabel: 'CRITICAL',
    msg: 'ET EXPLOIT Possible Struts RCE (CVE-2017-5638)',
    srcIp: '185.122.45.10',
    dstIp: '10.0.4.105:443',
    rawRule: 'alert tcp $EXTERNAL_NET any -> $HOME_NET 443 (msg:"ET EXPLOIT Possible Struts RCE"; sid:2024122; rev:4;)',
  },
  {
    id: 'l-2',
    timestamp: '2026-07-28T14:23:01.011Z',
    severity: 2,
    severityLabel: 'WARNING',
    msg: 'ET SCAN Potential SSH Scan',
    srcIp: '45.88.190.22',
    dstIp: '10.0.4.102:22',
    rawRule: 'alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (msg:"ET SCAN Potential SSH Scan"; sid:2001211;)',
  },
  {
    id: 'l-3',
    timestamp: '2026-07-28T14:23:05.881Z',
    severity: 3,
    severityLabel: 'INFO',
    msg: 'ET POLICY PE EXE or DLL Windows file download',
    srcIp: '10.0.4.105',
    dstIp: '93.184.216.34:80',
  },
  {
    id: 'l-4',
    timestamp: '2026-07-28T14:23:12.441Z',
    severity: 2,
    severityLabel: 'WARNING',
    msg: 'ET DNS Query for .onion Domain',
    srcIp: '192.168.1.45',
    dstIp: '8.8.8.8:53',
  },
  {
    id: 'l-5',
    timestamp: '2026-07-28T14:23:45.002Z',
    severity: 1,
    severityLabel: 'CRITICAL',
    msg: 'ET MALWARE Emotet Activity Observed',
    srcIp: '203.0.113.5',
    dstIp: '10.0.8.22:445',
  },
];

export const architectureData: ArchitectureNode = {
  id: 'arch-root',
  name: 'EDGE GATEWAY',
  status: 'Operational',
  icon: 'lan',
  type: 'gateway',
  subnodes: [
    {
      id: 'arch-api',
      name: 'API CLUSTER v2',
      status: 'Operational',
      icon: 'api',
      type: 'cluster',
    },
    {
      id: 'arch-db',
      name: 'POSTGRES MASTER',
      status: 'Operational',
      icon: 'database',
      type: 'database',
    },
    {
      id: 'arch-workers',
      name: 'WORKER NODES (08)',
      status: 'Operational',
      icon: 'memory',
      type: 'worker',
    },
  ],
};
