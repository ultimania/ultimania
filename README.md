<div align="center">

<img src="./docs/assets/readme/hero.svg" alt="Takumi Fukaya — Zero Trust Security Architect / AI Agent Systems Builder" width="100%">

<br>

**Zero Trust security architecture. AI agent operating systems. Eight languages, four domains, one engineer.**

Not a specialist who learned to fake breadth — a generalist who happens to be dangerous at security.

<br>

<a href="https://ultimania.github.io/ultimania/">
  <img src="./docs/assets/readme/cta.svg" alt="Enter the full portfolio" width="340">
</a>

<sub>EN / 日本語 — one click apart, inside the portfolio</sub>

</div>

<br>

---

## 🌐 The Skill Constellation

<div align="center">
<img src="./docs/assets/readme/constellation.svg" alt="Skill constellation across security, cloud, AI &amp; agents, and languages" width="640">
</div>

<sub>Every node here is something I've shipped in production, not a tutorial I once followed — live commit history below is the receipt.</sub>

## 📡 GitHub Activity

<div align="center">

<img src="./docs/assets/readme/activity.svg" alt="One year of GitHub contribution activity — 4,825 contributions, 27-day longest streak" width="100%">

<img src="./docs/assets/readme/langs.svg" alt="Public repositories by primary language, computed live from the GitHub API" width="100%">

</div>

<sub>Third-party stat badges go down more often than my production systems do, so these are self-rendered straight from the GitHub API — no dependency on someone else's free-tier deployment.</sub>

## 🧪 The Lab — what I build when nobody's paying

> "Using AI" is table stakes. I build the **systems that let AI agents run autonomously and safely** — the harder, less-glamorous problem enterprises need solved next.

### `tsumugi` — a personal AI agent platform, built like an enterprise system

Five repos, ~4 months, engineered in parallel — with the governance layer most companies don't build for their production systems:

```mermaid
graph TB
  gov["🏛 tsumugi-governance<br/>rules enforced across every repo:<br/>pre-commit · CI · hooks · runtime · review"]
  ai["🧠 tsumugi-ai<br/>CrewAI + FastAPI + Ollama<br/>9 CLI workflows · PostgreSQL · OpenTelemetry"]
  rag["📚 tsumugi-rag-teams<br/>MS Teams → Graph API → Qdrant<br/>standalone RAG service"]
  app["🖥 tsumugi-desktop<br/>native macOS SwiftUI app<br/>99 Swift tests"]
  core["⚙️ tsumugi-core<br/>shared foundations"]
  gov -.enforces.-> ai
  gov -.enforces.-> rag
  gov -.enforces.-> app
  gov -.enforces.-> core
  app -- HTTP --> ai
  ai -- vector search --> rag
```

### This repo — a "constitution" for AI agents

The page you're reading is served from an experiment: **can cheaper models operate with frontier-model discipline if you write the discipline down?** A 22-chapter operating charter (decision priority, evidence protocol, stop conditions), a 12-section decision-heuristics reference, 8 least-privilege sub-agent definitions, and a blinded model-comparison protocol. All in this repo, all inspectable.

### And the rest

| Project | One line |
|---|---|
| `spec-backborn` | Spec-driven development, studied at full speed — **2,211 commits in under a week**, 300+ sub-specs, Next.js 15 / Prisma 6 / Testcontainers / Playwright. |
| `NEXUS TRADE` | Multi-broker AI trading dashboard, rebuilt across 3 generations — paper-trading adapters plus real order placement via Playwright automation. |
| [`redmine_budget`](https://github.com/ultimania/redmine_budget) | Shipped, starred, maintained **public OSS** — plan-vs-actual effort tracking for Redmine. |

## 🛠 Arsenal

**Security & Identity** — the specialty

![Zero Trust](https://img.shields.io/badge/Zero_Trust-04050a?style=for-the-badge&logo=springsecurity&logoColor=22d3ee)
![OAuth2.0 / OIDC](https://img.shields.io/badge/OAuth2.0_/_OIDC-04050a?style=for-the-badge&logo=openid&logoColor=22d3ee)
![RBAC / ABAC](https://img.shields.io/badge/RBAC_/_ABAC-04050a?style=for-the-badge&logo=auth0&logoColor=22d3ee)
![EntraID](https://img.shields.io/badge/EntraID-04050a?style=for-the-badge&logo=microsoft&logoColor=22d3ee)
![Apigee](https://img.shields.io/badge/Apigee-04050a?style=for-the-badge&logo=googlecloud&logoColor=22d3ee)

**Languages** — a decade across eight of them

![Java](https://img.shields.io/badge/Java-04050a?style=for-the-badge&logo=openjdk&logoColor=a78bfa)
![Python](https://img.shields.io/badge/Python-04050a?style=for-the-badge&logo=python&logoColor=a78bfa)
![TypeScript](https://img.shields.io/badge/TypeScript-04050a?style=for-the-badge&logo=typescript&logoColor=a78bfa)
![Go](https://img.shields.io/badge/Go-04050a?style=for-the-badge&logo=go&logoColor=a78bfa)
![Swift](https://img.shields.io/badge/Swift-04050a?style=for-the-badge&logo=swift&logoColor=a78bfa)
![Ruby](https://img.shields.io/badge/Ruby-04050a?style=for-the-badge&logo=ruby&logoColor=a78bfa)
![C%23](https://img.shields.io/badge/C%23-04050a?style=for-the-badge&logo=dotnet&logoColor=a78bfa)
![Bash](https://img.shields.io/badge/Bash-04050a?style=for-the-badge&logo=gnubash&logoColor=a78bfa)

**Cloud & Platform**

![AWS](https://img.shields.io/badge/AWS-04050a?style=for-the-badge&logo=amazonwebservices&logoColor=f472b6)
![Azure](https://img.shields.io/badge/Azure-04050a?style=for-the-badge&logoColor=f472b6)
![Kubernetes](https://img.shields.io/badge/Kubernetes-04050a?style=for-the-badge&logo=kubernetes&logoColor=f472b6)
![Docker](https://img.shields.io/badge/Docker-04050a?style=for-the-badge&logo=docker&logoColor=f472b6)
![Snowflake](https://img.shields.io/badge/Snowflake-04050a?style=for-the-badge&logo=snowflake&logoColor=f472b6)

**AI & Agents** — where the lab work lives

![Claude Code](https://img.shields.io/badge/Claude_Code-04050a?style=for-the-badge&logo=claude&logoColor=22d3ee)
![CrewAI](https://img.shields.io/badge/CrewAI-04050a?style=for-the-badge&logo=crewai&logoColor=22d3ee)
![Ollama](https://img.shields.io/badge/Ollama-04050a?style=for-the-badge&logo=ollama&logoColor=22d3ee)
![RAG / Qdrant](https://img.shields.io/badge/RAG_/_Qdrant-04050a?style=for-the-badge&logo=qdrant&logoColor=22d3ee)
![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-04050a?style=for-the-badge&logo=opentelemetry&logoColor=22d3ee)
![FastAPI](https://img.shields.io/badge/FastAPI-04050a?style=for-the-badge&logo=fastapi&logoColor=22d3ee)

<br>

---

<div align="center">

### One engineer. Four domains. Zero specialization tunnel vision.

If your stack doesn't fit in one box, neither do I.

<br>

<a href="https://ultimania.github.io/ultimania/">
  <img src="./docs/assets/readme/cta.svg" alt="Enter the full portfolio" width="340">
</a>

<br><br>

<sub>

[Portfolio](https://ultimania.github.io/ultimania/) ・ [The Lab](https://ultimania.github.io/ultimania/#lab) ・ [GitHub](https://github.com/ultimania)

</sub>

</div>
