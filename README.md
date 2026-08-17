# SentinelAI

**AI-Powered DevSecOps Security Dashboard**

SentinelAI is a full-stack security platform that automates code vulnerability scanning, AI-driven risk analysis, and live network intrusion detection — all surfaced through a single unified dashboard. It combines a real CI/CD pipeline with three static analysis scanners, an LLM-powered analysis engine, and a live IDS, mirroring how real-world Security Operations Centers integrate application security with network security.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Roles & Responsibilities](#roles--responsibilities)
- [Known Limitations](#known-limitations)
- [License](#license)

---

## Overview

Most security tooling only covers one half of the picture: either **code security** (does the software itself have vulnerabilities?) or **network security** (is the live infrastructure being attacked right now?). SentinelAI deliberately combines both into one dashboard:

- **Code security** — Semgrep (SAST), Trivy (dependency/container scanning), Gitleaks (secret detection)
- **AI analysis** — every finding gets an automatic plain-English summary, a 1–10 risk score, and remediation guidance
- **CI/CD automation** — a Jenkins pipeline runs on every GitHub push: build → scan → parse → store, with zero manual steps
- **Network security** — Nmap for host/port discovery, Suricata (IDS) for live traffic monitoring and intrusion alerts
- **Unified dashboard** — a React SPA with authentication, RBAC, filtering, CSV export, audit logging, and an AI chat assistant

---

## Architecture

```
Developer Pushes Code
        │
        ▼
     GitHub  ──────────────► Jenkins Pipeline
                                    │
                                    ▼
                              Docker Build
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Automated Security Scanners  │
                    │ ─────────────────────────────  │
                    │  Semgrep · Trivy · Gitleaks     │
                    └───────────────────────────────┘
                                    │
                                    ▼
                            JSON Scan Reports
                                    │
                                    ▼
                          FastAPI Backend (JWT + RBAC)
                          ┌─────────┴─────────┐
                          ▼                   ▼
                    PostgreSQL           AI Engine (Groq)
                          │                   │
                          └─────────┬─────────┘
                                    ▼
                            React Dashboard
                                    ▲
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                                ▼
              Nmap Scanner                     Suricata IDS
            (Host/Port Discovery)          (Live Traffic Alerts)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (via Docker) |
| Auth | JWT (python-jose) + bcrypt |
| CI/CD | Jenkins + GitHub |
| SAST | Semgrep |
| Dependency/Container Scan | Trivy |
| Secret Detection | Gitleaks |
| AI Engine | Groq (Llama 3.3 70B) |
| Network Discovery | Nmap |
| Intrusion Detection | Suricata |
| Containerization | Docker + Docker Compose |

---

## Features

- 🔐 **JWT authentication** with role-based access control (admin/viewer)
- 🛡️ **Automated multi-scanner pipeline** triggered on every git push
- 🤖 **AI-generated risk analysis** — summary, risk score, remediation per finding
- 💬 **AI Assistant chat** for general security Q&A
- 🌐 **Live network monitoring** — host discovery + real-time intrusion alerts
- 📊 **Interactive dashboard** — filter/search vulnerabilities by severity and keyword
- 📄 **CSV report export**
- 📜 **Audit logging** of key actions (login, scans, report exports)
- 🎨 **Custom SOC-styled UI** — sidebar navigation, live status indicators, severity-coded findings

---

## Project Structure

```
SentinelAI/
├── backend/
│   ├── main.py              # FastAPI app & all API routes
│   ├── database.py          # DB connection setup
│   ├── models.py            # SQLAlchemy table models
│   ├── auth/
│   │   └── auth.py          # JWT + password hashing logic
│   ├── parser/
│   │   ├── semgrep_parser.py
│   │   ├── trivy_parser.py
│   │   └── gitleaks_parser.py
│   ├── ai/
│   │   └── ai_engine.py     # Groq-based vulnerability analysis
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx          # Main dashboard (all tabs/pages)
│       ├── Login.jsx
│       └── index.css        # Design system
├── network/
│   └── suricata/
│       └── alert_watcher.py # Bridges Suricata alerts to the API
├── security/                # Scanner JSON output (gitignored)
├── docker/
│   └── docker-compose.yml   # PostgreSQL container config
├── Jenkinsfile               # CI/CD pipeline definition
└── docs/
```

---

## Getting Started

> Full step-by-step setup instructions (including on a completely fresh machine) are in [`docs/SentinelAI-Runbook.pdf`](docs/SentinelAI-Runbook.pdf).

### Quick start (assumes Debian/Ubuntu with Docker, Node, Python already installed)

```bash
git clone https://github.com/lalitthipe/SentinelAI.git
cd SentinelAI

# Database
cd docker && docker compose up -d && cd ..

# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Create .env with GROQ_API_KEY and JWT_SECRET_KEY (see runbook)
uvicorn main:app --reload --port 8000 --host 0.0.0.0 &

# Frontend
cd ../frontend
npm install
npm run dev -- --host
```

Visit `http://<your-ip>:5173` and register/log in.

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create a new user | — |
| POST | `/login` | Get a JWT access token | — |
| GET | `/me` | Current user info | Required |
| GET | `/vulnerabilities` | List findings (filter by `severity`, `search`) | Required |
| GET | `/vulnerabilities/{id}/ai-report` | AI analysis for a finding | Required |
| GET | `/scans` | Scan history | Required |
| POST | `/network/hosts` | Submit discovered host (Nmap) | Required |
| GET | `/network/hosts` | List discovered hosts | Required |
| POST | `/network/alerts` | Submit IDS alert (Suricata) | Required |
| GET | `/network/alerts` | List IDS alerts | Required |
| GET | `/reports/vulnerabilities/csv` | Export findings as CSV | Required |
| GET | `/audit-logs` | View audit trail | Admin only |
| POST | `/ai-assistant/ask` | Ask the AI security assistant | Required |

Full interactive API docs available at `/docs` (Swagger UI) once the backend is running.

---

## Roles & Responsibilities

This project was designed to mirror a real security team structure:

- **AppSec / CISO-track role** — architecture, CI/CD, scanner integration, backend, AI engine, dashboard, RBAC
- **Network Administrator role** — IDS configuration, network scanning, network dashboard section

---

## Known Limitations

- **OWASP ZAP (DAST)** is not yet integrated — planned but deferred
- Vulnerability records are not deduplicated across repeated scans (each scan run inserts fresh rows)
- Services must be started manually across multiple terminals (no process manager / systemd units yet)
- Suricata alert detection requires traffic to genuinely cross the monitored network interface — self-targeted traffic from the same host will not trigger alerts

---

## License

This project was built for academic purposes as part of a DevSecOps coursework project.
