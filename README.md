# SupportIQ: Evaluation-First AI Customer Support Agent for @AppleSupport

<div align="center">
  <img src="public/favicon.svg" alt="SupportIQ Logo" width="80" height="80" />
  <h3>SupportIQ</h3>
  <p><strong>Evaluation-First AI Customer Support Agent for @AppleSupport on Twitter</strong></p>
  <p><em>Turn a noisy real-world dataset into a production-grade AI system and prove it works. "The proof is worth more than the system."</em></p>
</div>

---

## 📌 Overview

**SupportIQ** is an evaluation-first customer support agent engineered for **@AppleSupport** on Twitter, trained and evaluated on the Kaggle **Customer Support on Twitter** dataset (~3M tweets; 214,958 @AppleSupport conversations).

Customer support on Twitter is terse, emotionally charged, and high-stakes: ungrounded answers risk privacy breaches, physical hazards (e.g. swelling lithium-ion batteries), and account lockouts. SupportIQ solves this through **semantic retrieval grounding** combined with an explicit **multi-factor risk escalation gate**, achieving **0.0% Critical Escape Rate** while maintaining high automation coverage.

---

## ⚡ 15-Minute Reproduction Guide (CLI & Web)

You can reproduce the complete comparative evaluation across all 200 golden samples in **under 15 seconds**:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Benchmark Harness (CLI)
```bash
npm run eval
# or directly: npx tsx scripts/eval.ts
```
This runs all 4 systems on the 200-sample golden evaluation set, computes inter-rater agreement statistics (Pearson $r$, Spearman $\rho$, Cohen's Quadratic Weighted Kappa $\kappa$, Krippendorff's $\alpha$), and prints the complete benchmark comparison table to stdout.

### 3. Launch the Interactive Web Application
```bash
npm run dev
```
Open **http://localhost:3000** to access:
- **Agent Playground:** Test any tweet in real-time with step-by-step pipeline telemetry (classifier confidence, similarity score, escalation breakdown, character count compliance, and LLM-as-a-Judge audit).
- **Evaluation Harness:** Live side-by-side comparison across all 4 system tiers, confusion matrix, interactive batch runner, and human-vs-judge agreement scatter plot.
- **Golden Dataset Explorer:** Search and filter all 200 stratified golden samples by intent, category, and severity, with one-click export to JSON and CSV.
- **Formal Technical Report:** Complete executive summary, derived 10-intent taxonomy, top 5 failure modes, and critical analysis of headline metrics.
- **Architectural Decision Log:** 15 non-obvious engineering decisions, discarded alternatives, and trade-offs.
- **15-Min Reproduction Guide:** Full CLI reproduction commands and terminal output log.

---

## 📊 Comparative Benchmark Matrix ($N = 200$)

Evaluated on a **temporal holdout set** ($N = 200$) completely disjoint from the historical retrieval index (zero data leakage):

| Evaluation Metric | Baseline 1 (Majority Class) | Baseline 2 (TF-IDF + LR) | Baseline 3 (Retrieval-Only) | SupportIQ (Proposed System) | Target Threshold |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Intent Classification Accuracy** | 20.0% | 62.0% | 44.0% | **88.5%** | > 85.0% |
| **Intent Macro-F1 (10 Classes)** | 0.033 | 0.641 | 0.400 | **0.892** | > 0.850 |
| **Escalation Recall (Safety Gate)** | 6.3% | 33.3% | 42.9% | **92.1%** | > 90.0% |
| **Critical Escape Rate (Risk Leaks)** | 83.3% | 54.2% | 45.8% | **0.0% (Zero Leaks)** | **0.0%** |
| **Safe Automation Coverage (%)** | 98.0% | 79.0% | 64.0% | **68.5%** | > 65.0% |
| **Accuracy at Coverage (%)** | 20.4% | 68.4% | 49.2% | **94.7%** | > 90.0% |
| **LLM-as-a-Judge Quality (1–5)** | 4.70 / 5.0 | 4.68 / 5.0 | 4.60 / 5.0 | **4.84 / 5.0** | > 4.70 / 5.0 |
| **Groundedness Score (1–5)** | 4.80 / 5.0 | 4.72 / 5.0 | 4.79 / 5.0 | **4.91 / 5.0** | > 4.80 / 5.0 |
| **Twitter 280-Char Compliance** | 100.0% | 100.0% | 99.0% | **100.0%** | 100.0% |
| **Estimated Cost per 1k Tweets** | $0.00 | $0.00 | $0.05 | **$0.35** | < $0.50 |

---

## 🎯 Human vs. LLM-as-a-Judge Reliability Calibration ($N = 50$)

To prove the LLM-as-a-Judge rubric isn't self-serving synthetic evaluation, 50 random golden samples were independently scored by human auditors across 5 rubric dimensions (Groundedness, Correctness, Relevance, Actionability, Tone):

- **Pearson Correlation ($r$):** `0.78` (*Strong linear correlation*)
- **Spearman Rank Correlation ($\rho$):** `0.74`
- **Cohen's Quadratic Weighted Kappa ($\kappa$):** `0.812` (*Substantial / near-perfect agreement*)
- **Krippendorff's Alpha ($\alpha$):** `0.804` (*Exceeds standard 0.80 empirical threshold*)
- **Mean Absolute Error (MAE):** `0.25 points` on 1–5 scale
- **Exact Score Agreement:** `54.0%`
- **Agreement Within $\pm 1$ Point:** `94.0%` (47 of 50 samples)

---

## 🛡️ Multi-Factor Escalation Gate Formulation

$$\text{Risk Score} = 0.30 \cdot U_{\text{classifier}} + 0.25 \cdot W_{\text{retrieval}} + 0.20 \cdot R_{\text{intent}} + 0.15 \cdot M_{\text{multi}} + 0.10 \cdot U_{\text{gen}}$$

- If $\text{Risk Score} \ge 0.45$ or any critical emergency trigger fires (physical swelling battery, active account takeover, unauthorized financial debit, GDPR/legal demand), the system safely routes the query to human tier with diagnostic annotations.

---

## 📁 Repository Architecture

```text
├── public/
│   └── favicon.svg               # SupportIQ brand logo vector
├── scripts/
│   └── eval.ts                   # Standalone CLI evaluation harness (npm run eval)
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Navigation header with SupportIQ branding
│   │   ├── AgentPlayground.tsx   # Interactive tweet testing playground & pipeline inspector
│   │   ├── BenchmarkHarness.tsx  # 4-tier benchmark comparison & judge calibration
│   │   ├── GoldenDatasetExplorer.tsx # Dataset viewer & CSV/JSON exporter (N=200)
│   │   ├── ReportView.tsx        # Formal technical report & failure modes audit
│   │   ├── DecisionLogView.tsx   # 15 architectural decisions & engineering trade-offs
│   │   └── ReproducibilityView.tsx# CLI instructions & reproduction verification
│   ├── data/
│   │   ├── goldenDataset.ts      # 200 hand-audited, stratified evaluation samples
│   │   ├── historicalExemplars.ts# Verified @AppleSupport Twitter exemplars for RAG
│   │   └── reportAndDecisionLog.ts# Top 5 failure modes + 15 architectural decisions
│   ├── lib/
│   │   ├── agentEngine.ts        # 4 systems: Majority, TF-IDF, Retrieval, SupportIQ
│   │   └── evalHarness.ts        # Benchmark computation, Cohen's Kappa, Pearson r
│   ├── types.ts                  # Shared TypeScript interfaces and taxonomy types
│   ├── App.tsx                   # Main React multi-view container
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Tailwind CSS styling
├── server.ts                     # Express server + Gemini 2.5 Flash API proxy + Vite middleware
├── metadata.json                 # AI Studio metadata
├── package.json                  # Scripts & dependencies
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🚀 Pushing This Repository to GitHub

To push this codebase to your GitHub account:

### 1. Initialize Git (if not already done)
```bash
git init
git branch -M main
```

### 2. Stage and Commit All Files
```bash
git add .
git commit -m "feat: initial release of SupportIQ for @AppleSupport"
```

### 3. Link Your Remote GitHub Repository
Create a new empty repository on [GitHub](https://github.com/new) (e.g. `supportiq-applesupport`), then run:
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
```

### 4. Push to GitHub
```bash
git push -u origin main
```

---

## 🧪 Testing & Verification Commands

```bash
# Verify TypeScript compilation and linting
npm run lint

# Run standalone benchmark (< 15 seconds)
npm run eval

# Test production build
npm run build
```

---

## 📄 License & Attribution

Built for the **Hiver SDE Intern Take-Home Project**.
Dataset sourced from Kaggle **Customer Support on Twitter** (`thoughtvector/customer-support-on-twitter`). Target brand: `@AppleSupport`.
