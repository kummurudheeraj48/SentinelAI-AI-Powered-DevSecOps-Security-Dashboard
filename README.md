# 🛡️ SentinelAI: AI-Powered DevSecOps Security Dashboard

> An end-to-end automated DevSecOps security platform that bridges the gap between raw code analysis and developer remediation using automated CI/CD pipelines, custom parsers, and LLM-driven intelligence.

---

## 🏗️ Architecture & Core Pipeline Flow

SentinelAI establishes a continuous feedback loop where every developer commit (`git push`) automatically triggers building, scanning, parsing, AI enrichment, and dashboard visualization.

1. **Trigger (`GitHub Webhook` & `Jenkins`):** Code pushed to GitHub automatically alerts Jenkins via webhooks to initiate the CI/CD pipeline.
2. **Execution (`Docker` & `Security Scanners`):** Jenkins runs a multi-stage sequential build that containers the application and runs:
   * **Semgrep:** Static Application Security Testing (SAST) for code logic flaws.
   * **Trivy:** Container image and third-party dependency vulnerability scanning.
   * **Gitleaks:** Secret detection to catch hardcoded credentials or API keys.
3. **Ingestion & Normalization (`FastAPI` & `Python Parsers`):** Raw JSON reports are sent to the backend API, saved non-destructively, unpacked by custom parsers, and normalized into a structured **PostgreSQL** database.
4. **AI Enrichment (`Groq/OpenAI API`):** Complex vulnerabilities are translated into plain-English explanations, risk scores out of 10, and exact code-remediation patches.
5. **Developer Dashboard (`React` & `Vite`):** Developers review prioritized findings in a clean UI, apply fixes, and push updates to close the loop.

---

## 🛠️ Technology Stack

* **CI/CD & Automation:** Jenkins, GitHub Webhooks, Docker
* **Security Scanners:** Semgrep, Trivy, Gitleaks
* **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, Pydantic, JWT Auth
* **AI Engine:** Groq / OpenAI API for remediation generation
* **Frontend:** React, Vite, Tailwind/Custom CSS

---

## 📂 Project Directory Structure

```text
SentinelAI/
├── backend/
│   ├── ai/
│   │   ├── ai_engine.py         # LLM integration for automated vulnerability reports
│   │   └── generate_reports.py  # Report formatting and batch processing
│   ├── auth/
│   │   └── auth.py              # JWT authentication & password hashing
│   ├── database.py              # SQLAlchemy database configuration
│   ├── main.py                  # FastAPI application entry point & router registration
│   ├── models.py                # PostgreSQL relational database schemas
│   └── parser/
│       ├── gitleaks_parser.py   # Extracts and structures secret leak telemetry
│       ├── semgrep_parser.py    # Extracts code logic bugs and line numbers
│       └── trivy_parser.py      # Parses container and dependency vulnerabilities
├── docker/
│   └── docker-compose.yml       # Multi-container orchestration (DB, Backend, Frontend)
├── frontend/
│   ├── index.html               # HTML mounting shell
│   ├── package.json             # Frontend dependencies and scripts
│   └── src/
│       ├── App.jsx              # Root application router and layout
│       ├── Login.jsx            # Authentication interface component
│       └── ...                  # Global stylesheets and assets
├── Jenkinsfile                  # Declarative CI/CD security pipeline definition
└── .gitignore                   # Excludes local security reports and build artifacts
