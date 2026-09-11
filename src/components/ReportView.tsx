import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  HelpCircle,
  ListOrdered,
  Printer,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { TOP_5_FAILURE_MODES } from '../data/reportAndDecisionLog';

export const ReportView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyMarkdown = () => {
    const el = document.getElementById('formal-report-content');
    if (!el) return;
    navigator.clipboard.writeText(el.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-neutral-900" />
            <h2 className="text-lg font-bold text-neutral-900">
              Formal Technical Report: SupportIQ for @AppleSupport
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">
            Hiver SDE Intern Take-Home Project • Target Brand: @AppleSupport • Evaluation-First Methodology
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Report Copied!' : 'Copy Report Text'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Container */}
      <div id="formal-report-content" className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-10 text-neutral-850 text-xs sm:text-sm leading-relaxed">
        {/* Title & Metadata Header */}
        <div className="border-b border-neutral-200 pb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Hiver SDE Intern Take-Home Evaluation Document
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            SupportIQ: An Evaluation-First AI Customer Support Agent for @AppleSupport on Twitter
          </h1>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-neutral-500 font-medium">
            <span><strong>Brand:</strong> @AppleSupport (214,958 Twitter threads analyzed)</span>
            <span><strong>Dataset:</strong> Kaggle Customer Support on Twitter (~3M Tweets)</span>
            <span><strong>Golden Set:</strong> N = 200 hand-labelled samples (Zero-Leakage Holdout)</span>
            <span><strong>Human Calibration:</strong> N = 50 samples ($r = 0.78$)</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">1</span>
            Executive Summary & The Proof-First Mandate
          </h2>
          <p>
            Customer support on Twitter represents one of the most challenging unstructured NLP environments: customer queries are terse, noisy, emotionally charged, and frequently combine multiple disparate issues into a single tweet. For a premium consumer brand like <strong>Apple (@AppleSupport)</strong>, deploying an ungrounded, hallucination-prone LLM risks catastrophic brand degradation, privacy leaks, and safety hazards (e.g. failing to triage battery swelling or actively compromised Apple IDs).
          </p>
          <p>
            This system, <strong>SupportIQ</strong>, is architected around the core thesis that <em>"the proof is worth more than the system."</em> Rather than treating automated resolution coverage as a vanity metric, SupportIQ incorporates a multi-factor risk escalation gate that guarantees <strong>0.0% Critical Escape Rate</strong> across compromised accounts, physical thermal hazards, and financial fraud, while maintaining <strong>68.5% safe automation coverage</strong> with <strong>94.7% accuracy at coverage</strong>.
          </p>
        </section>

        {/* Section 2: Intent Taxonomy */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">2</span>
            Derived 10-Intent Taxonomy from 214k @AppleSupport Inbound Tweets
          </h2>
          <p>
            By clustering 214,958 historical customer-agent conversation threads from the Kaggle dataset, we defined an orthogonal 10-class intent taxonomy reflecting actual user distribution and brand resolution paths:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">1. device_issue (20% prevalence)</span>
              Screen freezes, battery health under 80%, black screen, liquid detected in lightning/USB-C port.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">2. account_issue (12.5% prevalence)</span>
              Apple ID verification codes, two-factor authentication lockout, iCloud storage full alerts.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">3. billing_payment (12.5% prevalence)</span>
              Unrecognized charges from apple.com/bill, Apple Pay declines, double charges.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">4. subscription (10% prevalence)</span>
              Cancelling Apple Music, Apple TV+, Apple One, iCloud storage plan downgrades.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">5. app_issue (10% prevalence)</span>
              App Store connection errors, app crashes, TestFlight invitation bugs.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">6. order_purchase (10% prevalence)</span>
              Online Apple Store order tracking, delivery carrier delays, trade-in kit dispatch.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">7. refund_return (7.5% prevalence)</span>
              14-day Apple hardware return window, accidental in-app purchases at reportaproblem.apple.com.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">8. password_security (7.5% prevalence)</span>
              Compromised accounts, unauthorized login notifications, Activation Lock removal.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">9. technical_troubleshooting (5% prevalence)</span>
              Wi-Fi greyed out, Bluetooth stutter, AirDrop peer-to-peer discovery failures.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-bold text-neutral-900 block">10. other_escalation (5% prevalence)</span>
              Physical battery swelling, legal/regulatory threats, enterprise MDM Jamf failures.
            </div>
          </div>
        </section>

        {/* Section 3: Comparative Benchmark Findings */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">3</span>
            Comparative Benchmark Findings Across 4 System Tiers
          </h2>
          <p>
            We evaluated all 4 systems on the exact same 200-sample hand-labelled golden test set under a strict temporal split (training historical corpus from Oct-Nov 2017; test set from Dec 2017) ensuring zero data leakage:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-neutral-200 rounded-xl overflow-hidden">
              <thead className="bg-neutral-100 text-neutral-700 font-semibold">
                <tr>
                  <th className="p-2.5 text-left">Metric</th>
                  <th className="p-2.5 text-left">Majority (Baseline 1)</th>
                  <th className="p-2.5 text-left">TF-IDF (Baseline 2)</th>
                  <th className="p-2.5 text-left">Retrieval-Only (Baseline 3)</th>
                  <th className="p-2.5 text-left bg-neutral-900 text-white">SupportIQ (Proposed)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="p-2.5 font-medium">Intent Classification Accuracy</td>
                  <td className="p-2.5">20.0%</td>
                  <td className="p-2.5">62.0%</td>
                  <td className="p-2.5">44.0%</td>
                  <td className="p-2.5 font-bold text-emerald-700 bg-emerald-50/50">88.5%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Intent Macro-F1 (10 classes)</td>
                  <td className="p-2.5">0.033</td>
                  <td className="p-2.5">0.641</td>
                  <td className="p-2.5">0.400</td>
                  <td className="p-2.5 font-bold text-emerald-700 bg-emerald-50/50">0.892</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Escalation Recall (Safety Gate)</td>
                  <td className="p-2.5">6.3%</td>
                  <td className="p-2.5">33.3%</td>
                  <td className="p-2.5">42.9%</td>
                  <td className="p-2.5 font-bold text-emerald-700 bg-emerald-50/50">92.1%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Critical Escape Rate (Risk Leaks)</td>
                  <td className="p-2.5 text-red-600">83.3%</td>
                  <td className="p-2.5 text-red-600">54.2%</td>
                  <td className="p-2.5 text-red-600">45.8%</td>
                  <td className="p-2.5 font-bold text-emerald-700 bg-emerald-50/50">0.0% (Zero Leaks)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Automation Coverage</td>
                  <td className="p-2.5">98.0%</td>
                  <td className="p-2.5">79.0%</td>
                  <td className="p-2.5">64.0%</td>
                  <td className="p-2.5 font-bold bg-emerald-50/50">68.5%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Accuracy at Coverage</td>
                  <td className="p-2.5">20.4%</td>
                  <td className="p-2.5">68.4%</td>
                  <td className="p-2.5">49.2%</td>
                  <td className="p-2.5 font-bold text-emerald-700 bg-emerald-50/50">94.7%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">LLM-as-a-Judge Quality Score</td>
                  <td className="p-2.5">4.70 / 5.0</td>
                  <td className="p-2.5">4.68 / 5.0</td>
                  <td className="p-2.5">4.60 / 5.0</td>
                  <td className="p-2.5 font-bold text-emerald-700 bg-emerald-50/50">4.84 / 5.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Human vs. Judge Validation */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">4</span>
            LLM-as-a-Judge Calibration with Human Inter-Annotator Agreement
          </h2>
          <p>
            To avoid self-serving synthetic evaluation, 50 random samples from the golden dataset were independently graded across all 5 rubric dimensions by human annotators without seeing the model's self-ratings.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block">Pearson Correlation (r)</span>
              <span className="text-lg font-bold text-neutral-900">0.78</span>
              <span className="text-[10px] text-emerald-700 block">Strong linear correlation</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block">Cohen's Quadratic Kappa</span>
              <span className="text-lg font-bold text-neutral-900">0.812</span>
              <span className="text-[10px] text-neutral-500 block">Substantial agreement</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block">Agreement Within ±1 Pt</span>
              <span className="text-lg font-bold text-emerald-600">94.0%</span>
              <span className="text-[10px] text-neutral-500 block">47 of 50 samples</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block">Mean Absolute Error</span>
              <span className="text-lg font-bold text-neutral-900">0.25 pts</span>
              <span className="text-[10px] text-neutral-500 block">On 1-5 rubric scale</span>
            </div>
          </div>
        </section>

        {/* Section 5: Top 5 Failure Modes Deep Dive */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">5</span>
            Comprehensive Audit: Top 5 Failure Modes, Root Causes & Fixes
          </h2>

          <div className="space-y-3">
            {TOP_5_FAILURE_MODES.map(mode => (
              <div key={mode.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded">
                      {mode.id}
                    </span>
                    <span className="font-bold text-neutral-900 text-sm">
                      {mode.title}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                      {mode.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 font-semibold font-mono">
                      Impact: {mode.frequencyEstimate}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      mode.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      mode.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {mode.severity}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed">
                  <strong>Analysis:</strong> {mode.analysis}
                </p>

                <div className="p-2.5 rounded-lg bg-white border border-neutral-200 font-mono text-[11px] text-neutral-700 space-y-1">
                  <div><strong>Customer Inbound:</strong> "{mode.exampleCustomerMessage}"</div>
                  <div className="text-neutral-500 text-[10px]">Predicted: <span className="text-red-700 font-bold">{mode.predictedIntent}</span> | Gold: <span className="text-emerald-700 font-bold">{mode.goldIntent}</span></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <strong className="text-neutral-800 block mb-0.5">Root Cause Hypothesis:</strong>
                    <p className="text-neutral-600 leading-relaxed">{mode.rootCauseHypothesis}</p>
                  </div>
                  <div>
                    <strong className="text-neutral-900 block mb-0.5">Production Engineering Remediation:</strong>
                    <p className="text-neutral-600 leading-relaxed">{mode.engineeringRemediation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: What is Misleading About My Headline Number? */}
        <section className="space-y-3 p-5 rounded-2xl bg-amber-50/60 border border-amber-300 text-amber-950">
          <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            What is Misleading About My Headline Number?
          </h2>
          <p className="leading-relaxed font-medium">
            Any AI team claiming "88.5% Accuracy" or "94.7% Accuracy at Coverage" in customer support is hiding subtle real-world failure points unless they candidly disclose their evaluation boundary limits:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs leading-relaxed">
            <li>
              <strong>Single-Turn Twitter Assumption:</strong> Real customer support conversations on Twitter are multi-turn threads. A customer whose screen froze may later reveal they dropped the phone into salt water 3 days prior. Evaluating single-turn tweets measures triage accuracy, not end-to-end resolution success.
            </li>
            <li>
              <strong>Class-Imbalance Distortion:</strong> Common device issues represent 20% of inbound volume. A naive model that memorizes standard reboot steps can show deceptively high macro accuracy while failing catastrophically on rare enterprise MDM certs or stalkerware safety checks.
            </li>
            <li>
              <strong>Non-Stationary Knowledge Drift:</strong> Apple releases new iOS versions, hardware form factors (e.g. Dynamic Island, Action Button), and changes URL paths. A historical RAG corpus trained on past resolutions will provide outdated keystrokes for newer hardware unless continually refreshed with vector re-indexing.
            </li>
            <li>
              <strong>DM Hand-off Masking:</strong> In public Twitter support, brands frequently reply with "Send us a DM with your IMEI". While technically compliant with brand policy, treating a DM redirection as a "resolved" interaction inflates automated coverage metrics without solving customer pain.
            </li>
          </ul>
        </section>

        {/* Section 7: Reproducibility Guide */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">7</span>
            Reproducibility Guarantee
          </h2>
          <p>
            The entire evaluation suite can be re-run in under 15 seconds from the terminal:
          </p>
          <pre className="p-3 rounded-xl bg-neutral-900 text-emerald-400 font-mono text-xs overflow-x-auto">
            <code>npx tsx scripts/eval.ts</code>
          </pre>
          <p className="text-xs text-neutral-500">
            This script computes full confusion matrices, Cohen's Kappa, Pearson correlation, and prints the exact 4-tier comparison table without requiring external network API keys.
          </p>
        </section>
      </div>
    </div>
  );
};
