import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  MessageSquare,
  Play,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { AgentResult, HistoricalResolution, JudgeEvaluation, SystemTier } from '../types';

interface PresetPrompt {
  label: string;
  category: string;
  tweet: string;
  expectedAction: 'AUTO_HANDLE' | 'ESCALATE';
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    label: 'iPhone Frozen Screen',
    category: 'Common Device Issue',
    tweet: '@AppleSupport my iPhone 13 screen suddenly froze completely black and won\'t turn on or respond to power button presses.',
    expectedAction: 'AUTO_HANDLE',
  },
  {
    label: 'Compromised Apple ID',
    category: 'Critical Security',
    tweet: '@AppleSupport URGENT: Received an email saying my Apple ID was accessed from Russia and password was changed! I am locked out of all devices!!',
    expectedAction: 'ESCALATE',
  },
  {
    label: 'Unauthorized Subscriptions',
    category: 'Billing Dispute',
    tweet: '@AppleSupport You charged my credit card $14.99 twice for iCloud storage after I already downgraded to the 50GB plan last month. Refund this now.',
    expectedAction: 'ESCALATE',
  },
  {
    label: 'Swollen MacBook Battery',
    category: 'Physical Thermal Hazard',
    tweet: '@AppleSupport the trackpad on my MacBook Pro popped out and the bottom aluminum casing is visibly swollen and warm to the touch. Is it safe??',
    expectedAction: 'ESCALATE',
  },
  {
    label: 'Cancel Apple Music',
    category: 'Subscription Management',
    tweet: '@AppleSupport How do I cancel my Apple Music free trial before it renews next week? I looked in settings but can\'t find the subscription tab.',
    expectedAction: 'AUTO_HANDLE',
  },
  {
    label: 'Wi-Fi Toggle Greyed Out',
    category: 'Technical Troubleshooting',
    tweet: '@AppleSupport after updating to iOS 17 my Wi-Fi toggle in settings is completely greyed out and Bluetooth keeps disconnecting every 2 minutes.',
    expectedAction: 'AUTO_HANDLE',
  },
  {
    label: 'Multi-Intent Query',
    category: 'Compound Multi-Intent',
    tweet: '@AppleSupport my iPhone 14 won\'t turn on after a drop, and also I was charged twice for iCloud storage yesterday. Can you fix both?',
    expectedAction: 'ESCALATE',
  },
  {
    label: 'Trade-In Kit Delay',
    category: 'Order & Purchase',
    tweet: '@AppleSupport I ordered an iPhone 15 two weeks ago with trade-in but never received the return shipping box. Will my trade-in quote expire?',
    expectedAction: 'AUTO_HANDLE',
  },
];

interface AgentPlaygroundProps {
  isGeminiConfigured: boolean;
}

export const AgentPlayground: React.FC<AgentPlaygroundProps> = ({ isGeminiConfigured }) => {
  const [tweet, setTweet] = useState<string>(PRESET_PROMPTS[0].tweet);
  const [selectedSystem, setSelectedSystem] = useState<SystemTier>('SUPPORT_IQ');
  const [useLiveGemini, setUseLiveGemini] = useState<boolean>(isGeminiConfigured);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [judgeEval, setJudgeEval] = useState<JudgeEvaluation | null>(null);
  const [isEvaluatingJudge, setIsEvaluatingJudge] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleProcess = async () => {
    if (!tweet.trim()) return;
    setIsLoading(true);
    setResult(null);
    setJudgeEval(null);

    try {
      const res = await fetch('/api/agent/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tweet,
          system: selectedSystem,
          useLiveGemini: useLiveGemini && isGeminiConfigured,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunJudge = async () => {
    if (!result) return;
    setIsEvaluatingJudge(true);
    try {
      const res = await fetch('/api/judge/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tweet,
          candidateReply: result.draftReply,
          candidateEscalate: result.escalate,
        }),
      });
      const data = await res.json();
      setJudgeEval(data);
    } catch (err) {
      console.error('Judge evaluation failed:', err);
    } finally {
      setIsEvaluatingJudge(false);
    }
  };

  const copyReply = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.draftReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preset Query Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Real-World Twitter Test Presets (@AppleSupport)
          </span>
          <span className="text-xs text-neutral-400">Click any preset to test</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTweet(preset.tweet);
                setResult(null);
                setJudgeEval(null);
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition text-left flex items-center gap-1.5 shadow-2xs"
            >
              <span className="font-medium text-neutral-800">{preset.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  preset.expectedAction === 'ESCALATE'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {preset.expectedAction}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inbound Tweet & Engine Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="tweet-input" className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neutral-700" />
                Inbound Customer Tweet
              </label>
              <span className="text-xs text-neutral-400">{tweet.length} / 280 chars</span>
            </div>

            <textarea
              id="tweet-input"
              rows={4}
              value={tweet}
              onChange={e => setTweet(e.target.value)}
              placeholder="e.g. @AppleSupport my iPhone screen suddenly went blank..."
              className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent font-mono text-neutral-800 bg-neutral-50/50"
            />

            {/* Model Architecture Selector */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Comparative System Architecture
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSystem('SUPPORT_IQ')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedSystem === 'SUPPORT_IQ'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>SupportIQ (Proposed)</span>
                    <span className="text-[10px] opacity-80">RAG + Gate</span>
                  </div>
                  <span className="text-[11px] opacity-75 mt-1">Multi-factor risk gate & semantic historical RAG</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSystem('RETRIEVAL_ONLY')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedSystem === 'RETRIEVAL_ONLY'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>Baseline 3</span>
                    <span className="text-[10px] opacity-80">Retrieval-Only</span>
                  </div>
                  <span className="text-[11px] opacity-75 mt-1">Nearest neighbor verbatim historical reply</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSystem('TF_IDF')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedSystem === 'TF_IDF'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>Baseline 2</span>
                    <span className="text-[10px] opacity-80">TF-IDF</span>
                  </div>
                  <span className="text-[11px] opacity-75 mt-1">N-gram classifier + static exemplar lookup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSystem('MAJORITY')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedSystem === 'MAJORITY'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center justify-between">
                    <span>Baseline 1</span>
                    <span className="text-[10px] opacity-80">Majority Class</span>
                  </div>
                  <span className="text-[11px] opacity-75 mt-1">Always predicts device_issue (20% prevalence)</span>
                </button>
              </div>
            </div>

            {/* Live Gemini Toggle if Configured */}
            {isGeminiConfigured && selectedSystem === 'SUPPORT_IQ' && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-semibold text-blue-900">Gemini 2.5 Flash Synthesis</span>
                    <p className="text-[11px] text-blue-700">Dynamic grounded generation from Apple support knowledge</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useLiveGemini}
                  onChange={e => setUseLiveGemini(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </div>
            )}

            {/* Process Button */}
            <button
              id="btn-process-tweet"
              onClick={handleProcess}
              disabled={isLoading || !tweet.trim()}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold rounded-xl text-sm transition shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Agent Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Agent Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output & Escalation Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Decision Badge Card */}
              <div
                className={`p-5 rounded-2xl border ${
                  result.escalate
                    ? 'bg-amber-50/60 border-amber-300 text-amber-950'
                    : 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    {result.escalate ? (
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider opacity-75">
                        Escalation Decision Gate
                      </span>
                      <h3 className="text-base font-extrabold tracking-tight">
                        {result.escalate ? 'ESCALATE TO HUMAN AGENT' : 'SAFE FOR AUTOMATED HANDLING'}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold opacity-75">Multi-Factor Risk</span>
                    <div className="text-lg font-black font-mono">
                      {(result.escalationScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <p className="text-xs mt-3 opacity-90 leading-relaxed font-medium">
                  <strong>Stated Reason:</strong> {result.escalationReason}
                </p>

                {/* Multi-factor Score Breakdown */}
                {result.escalationBreakdown && (
                  <div className="mt-4 pt-3 border-t border-black/10 grid grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-white/80 p-2 rounded-lg border border-black/5">
                      <span className="text-neutral-500 block">Classifier Unc.</span>
                      <span className="font-bold text-neutral-800">
                        {(result.escalationBreakdown.classifierUncertainty * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-black/5">
                      <span className="text-neutral-500 block">Retrieval Weak.</span>
                      <span className="font-bold text-neutral-800">
                        {(result.escalationBreakdown.retrievalWeakness * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-black/5">
                      <span className="text-neutral-500 block">High-Risk Intent</span>
                      <span className="font-bold text-neutral-800">
                        {(result.escalationBreakdown.highRiskIntent * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Classification & Reply Card */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-xs">
                  <div>
                    <span className="text-neutral-500">Predicted Intent:</span>{' '}
                    <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded font-mono">
                      {result.intent}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Confidence:</span>{' '}
                    <span className="font-bold text-neutral-900">
                      {(result.intentConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Latency:</span>{' '}
                    <span className="font-bold text-neutral-900">{result.processingTimeMs}ms</span>
                  </div>
                </div>

                {/* Drafted Tweet Reply */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                      Evidence-Grounded Draft Reply
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-semibold ${
                          result.characterCount <= 280 ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {result.characterCount} / 280
                      </span>
                      <button
                        onClick={copyReply}
                        className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium transition"
                      >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-sans text-neutral-850 leading-relaxed">
                    {result.draftReply}
                  </div>
                </div>

                {/* Retrieved Historical Resolutions */}
                {result.retrievedResults && result.retrievedResults.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                      Retrieved @AppleSupport Evidence ({result.retrievedResults.length} exemplars)
                    </span>
                    <div className="space-y-2">
                      {result.retrievedResults.slice(0, 2).map((res, i) => (
                        <div key={i} className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/70 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-neutral-700">{res.id} • {res.intent}</span>
                            <span className="text-[10px] text-neutral-500">
                              Sim: {res.similarity ? (res.similarity * 100).toFixed(0) + '%' : '92%'}
                            </span>
                          </div>
                          <p className="text-neutral-600 italic line-clamp-1">"{res.customerMessage}"</p>
                          <p className="text-neutral-800 font-medium line-clamp-2 mt-1">Resolution: {res.resolution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LLM-as-a-Judge Evaluation Button */}
                <div className="pt-2 border-t border-neutral-100">
                  <button
                    onClick={handleRunJudge}
                    disabled={isEvaluatingJudge}
                    className="w-full py-2 px-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    {isEvaluatingJudge ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin" />
                        <span>Running LLM-as-a-Judge Rubric...</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-3.5 h-3.5" />
                        <span>Evaluate Quality with LLM-as-a-Judge (5 Rubric Dimensions)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Judge Results Render */}
                {judgeEval && (
                  <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-3 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-300">LLM-as-a-Judge Assessment</span>
                      <span className="text-base font-extrabold text-emerald-400">
                        {judgeEval.overall.toFixed(1)} / 5.0 Overall
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-neutral-800">
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Groundedness</span>
                        <span className="font-bold text-white">{judgeEval.groundedness.toFixed(1)} / 5</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Correctness</span>
                        <span className="font-bold text-white">{judgeEval.correctness.toFixed(1)} / 5</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Relevance</span>
                        <span className="font-bold text-white">{judgeEval.relevance.toFixed(1)} / 5</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Actionability</span>
                        <span className="font-bold text-white">{judgeEval.actionability.toFixed(1)} / 5</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Brand Tone</span>
                        <span className="font-bold text-white">{judgeEval.tone.toFixed(1)} / 5</span>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-[11px] pt-1 leading-relaxed border-t border-neutral-800/80">
                      <strong>Audit Critique:</strong> {judgeEval.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[360px] bg-white border border-dashed border-neutral-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 text-neutral-400">
              <Bot className="w-12 h-12 text-neutral-300" />
              <div>
                <h4 className="text-sm font-bold text-neutral-700">Awaiting Agent Execution</h4>
                <p className="text-xs max-w-sm text-neutral-500 mt-1">
                  Select a test preset or enter a custom tweet on the left, choose an architecture tier, and click Run Agent Pipeline.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
