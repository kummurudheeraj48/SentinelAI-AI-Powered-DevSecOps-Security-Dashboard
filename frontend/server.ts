import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const currentDirname = typeof __dirname !== "undefined" 
  ? __dirname 
  : path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini AI SDK
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "SentinelAI Backend Engine" });
  });

  // AI Security Assistant Endpoint
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.status(200).json({
          analysis: `[SentinelAI Core] Demo response for: "${prompt}". (API Key required for live GenAI analysis).`,
          impact: [
            "Full System Compromise: Unauthorized command execution risk.",
            "Data Exfiltration: Confidential records exposure potential.",
            "Lateral Movement: Possible foothold on internal subnet.",
          ],
          immediateAction: "Audit affected API endpoints & enforce strict parameter validation.",
          wafPolicy: "Enable strict WAF content-type filtering and block dynamic execution payloads.",
        });
      }

      const systemInstruction = `You are SentinelAI, an elite SOC Operations AI Security Assistant.
When given a prompt about a security event, vulnerability (e.g. CVE, SAST finding), or log alert, respond in structured JSON with:
1. "analysis": A clear 2-3 sentence technical breakdown of the threat or query.
2. "impact": An array of 3 bullet points describing business and infrastructure risks.
3. "immediateAction": Recommended immediate patch or developer action.
4. "wafPolicy": Recommended WAF or network rule policy.
Ensure tone is authoritative, concise, and technical.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (e) {
        return res.json({
          analysis: responseText,
          impact: [
            "Unauthorized access risk",
            "Potential data exfiltration",
            "Privilege escalation",
          ],
          immediateAction: "Apply immediate security patch.",
          wafPolicy: "Enforce strict ingress filtering.",
        });
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "AI Analysis failed" });
    }
  });

  // AI Remediation Code Fix Endpoint
  app.post("/api/ai/remediate", async (req, res) => {
    try {
      const { cve, title, filePath, vulnerableCode } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          suggestedFix: `// Remediation Fix for ${cve}\n# Using current_user and parameterized query\ndb.execute("UPDATE users SET theme=? WHERE id=?", (data['theme'], current_user.id))`,
          explanation: "Replaces dynamic SQL/code injection with parameterized inputs and enforces session authorization.",
        });
      }

      const prompt = `Analyze this vulnerable code and generate a secure fix.
Vulnerability: ${cve} - ${title}
File: ${filePath}
Vulnerable Code:
${vulnerableCode}

Respond in JSON with:
- "suggestedFix": string containing the corrected, secure code block
- "explanation": brief explanation of why this fix mitigates the flaw.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("AI Remediation Error:", error);
      res.status(500).json({ error: error.message || "Remediation generation failed" });
    }
  });

  // Serve static or Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SentinelAI SOC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
