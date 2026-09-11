import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Database,
  Download,
  FileText,
  Filter,
  Info,
  Search,
  ShieldAlert,
  Tag,
} from 'lucide-react';
import { GOLDEN_DATASET, GOLDEN_DATASET_SAMPLING_NOTE, DATASET_STATISTICS } from '../data/goldenDataset';
import { GoldenSample, AppleIntentType } from '../types';

export const GoldenDatasetExplorer: React.FC = () => {
  const [selectedIntent, setSelectedIntent] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedEscalate, setSelectedEscalate] = useState<string>('ALL');
  const [humanOnly, setHumanOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSample, setSelectedSample] = useState<GoldenSample | null>(null);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  const filteredSamples = useMemo(() => {
    return GOLDEN_DATASET.filter(sample => {
      if (selectedIntent !== 'ALL' && sample.intent !== selectedIntent) return false;
      if (selectedCategory !== 'ALL' && sample.category !== selectedCategory) return false;
      if (selectedSeverity !== 'ALL' && sample.severity !== selectedSeverity) return false;
      if (selectedEscalate !== 'ALL') {
        const isEsc = selectedEscalate === 'TRUE';
        if (sample.shouldEscalate !== isEsc) return false;
      }
      if (humanOnly && !sample.isHumanScoredSubset) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTweet = sample.customerMessage.toLowerCase().includes(q);
        const matchesId = sample.id.toLowerCase().includes(q);
        const matchesReason = sample.reason.toLowerCase().includes(q);
        const matchesAction = sample.expectedAction.toLowerCase().includes(q);
        if (!matchesTweet && !matchesId && !matchesReason && !matchesAction) return false;
      }
      return true;
    });
  }, [selectedIntent, selectedCategory, selectedSeverity, selectedEscalate, humanOnly, searchQuery]);

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(GOLDEN_DATASET, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'applesupport_golden_eval_dataset_200.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadCsv = () => {
    const headers = ['id', 'intent', 'category', 'severity', 'shouldEscalate', 'customerMessage', 'historicalResolution', 'reason'];
    const rows = GOLDEN_DATASET.map(s => [
      s.id,
      s.intent,
      s.category,
      s.severity,
      s.shouldEscalate ? 'TRUE' : 'FALSE',
      `"${s.customerMessage.replace(/"/g, '""')}"`,
      `"${s.historicalResolution.replace(/"/g, '""')}"`,
      `"${s.reason.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'applesupport_golden_eval_dataset_200.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Dataset Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500">Total Golden Samples</span>
          <div className="text-2xl font-extrabold text-neutral-900">{GOLDEN_DATASET.length}</div>
          <span className="text-[11px] text-neutral-500">Hand-curated & audited</span>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500">Taxonomy Classes</span>
          <div className="text-2xl font-extrabold text-neutral-900">10</div>
          <span className="text-[11px] text-neutral-500">Orthogonal Apple intents</span>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500">Escalation Boundary</span>
          <div className="text-2xl font-extrabold text-amber-700">
            {GOLDEN_DATASET.filter(s => s.shouldEscalate).length} (31.5%)
          </div>
          <span className="text-[11px] text-neutral-500">Routed to human tier</span>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500">Human Calibration Set</span>
          <div className="text-2xl font-extrabold text-emerald-700">
            {GOLDEN_DATASET.filter(s => s.isHumanScoredSubset).length}
          </div>
          <span className="text-[11px] text-neutral-500">5-dim rubric audited</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by tweet keywords, sample ID (e.g. APL-045), or escalation reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-neutral-500" />
              <span>Methodology</span>
            </button>
            <button
              onClick={downloadJson}
              className="px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={downloadCsv}
              className="px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stratification & Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-neutral-100 text-xs">
          <div>
            <label className="text-neutral-500 font-semibold block mb-1 text-[11px]">Intent</label>
            <select
              value={selectedIntent}
              onChange={e => setSelectedIntent(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg p-1.5 font-medium bg-white"
            >
              <option value="ALL">All 10 Intents</option>
              <option value="device_issue">device_issue (40)</option>
              <option value="account_issue">account_issue (25)</option>
              <option value="billing_payment">billing_payment (25)</option>
              <option value="subscription">subscription (20)</option>
              <option value="app_issue">app_issue (20)</option>
              <option value="order_purchase">order_purchase (20)</option>
              <option value="refund_return">refund_return (15)</option>
              <option value="password_security">password_security (15)</option>
              <option value="technical_troubleshooting">technical_troubleshooting (10)</option>
              <option value="other_escalation">other_escalation (10)</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-500 font-semibold block mb-1 text-[11px]">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg p-1.5 font-medium bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="Common">Common (50%)</option>
              <option value="Ambiguous">Ambiguous (20%)</option>
              <option value="Rare">Rare (10%)</option>
              <option value="Multi-intent">Multi-intent (10%)</option>
              <option value="Escalation">Escalation (10%)</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-500 font-semibold block mb-1 text-[11px]">Severity</label>
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg p-1.5 font-medium bg-white"
            >
              <option value="ALL">All Severities</option>
              <option value="low">Low (100)</option>
              <option value="medium">Medium (45)</option>
              <option value="high">High (35)</option>
              <option value="critical">Critical (20)</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-500 font-semibold block mb-1 text-[11px]">Escalation</label>
            <select
              value={selectedEscalate}
              onChange={e => setSelectedEscalate(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg p-1.5 font-medium bg-white"
            >
              <option value="ALL">All Outcomes</option>
              <option value="FALSE">Auto-Handle</option>
              <option value="TRUE">Escalate to Human</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-1.5 p-1.5 border border-neutral-200 rounded-lg w-full cursor-pointer hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700">
              <input
                type="checkbox"
                checked={humanOnly}
                onChange={e => setHumanOnly(e.target.checked)}
                className="rounded text-neutral-900"
              />
              <span>Human Scored (N=50)</span>
            </label>
          </div>
        </div>

        {showMethodology && (
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2 text-neutral-700">
            <h5 className="font-bold text-neutral-900">Sampling & Stratification Protocol:</h5>
            <p className="leading-relaxed">{GOLDEN_DATASET_SAMPLING_NOTE}</p>
          </div>
        )}
      </div>

      {/* Dataset Table & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between text-xs font-semibold text-neutral-600">
            <span>Showing {filteredSamples.length} of {GOLDEN_DATASET.length} Golden Samples</span>
            <span>Click row to view full details</span>
          </div>

          <div className="max-h-[580px] overflow-y-auto divide-y divide-neutral-100">
            {filteredSamples.map(sample => (
              <div
                key={sample.id}
                onClick={() => setSelectedSample(sample)}
                className={`p-3 text-xs transition cursor-pointer hover:bg-neutral-50 ${
                  selectedSample?.id === sample.id ? 'bg-neutral-100 font-medium' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900">{sample.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                      {sample.intent}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 text-[10px]">
                      {sample.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      sample.shouldEscalate
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {sample.shouldEscalate ? 'ESCALATE' : 'AUTO-HANDLE'}
                  </span>
                </div>

                <p className="text-neutral-700 line-clamp-2 mt-1 italic">"{sample.customerMessage}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Drawer: Sample Deep Dive */}
        <div className="lg:col-span-5">
          {selectedSample ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <span className="font-bold text-neutral-900 text-base">{selectedSample.id}</span>
                  <span className="text-neutral-500 block text-[11px]">{selectedSample.category} Stratum</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    selectedSample.shouldEscalate
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {selectedSample.shouldEscalate ? 'ESCALATE TO HUMAN' : 'AUTO-HANDLE'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 font-semibold block text-[11px]">Customer Inbound Tweet:</span>
                <p className="text-neutral-850 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 italic font-sans leading-relaxed">
                  "{selectedSample.customerMessage}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500 block">Intent Class</span>
                  <span className="font-bold text-neutral-900">{selectedSample.intent}</span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500 block">Severity Level</span>
                  <span className="font-bold uppercase text-neutral-900">{selectedSample.severity}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 font-semibold block text-[11px]">Historical Resolution (@AppleSupport):</span>
                <p className="text-neutral-800 font-medium leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  {selectedSample.historicalResolution}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 font-semibold block text-[11px]">Escalation Ground Truth Reason:</span>
                <p className="text-neutral-700 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                  {selectedSample.reason}
                </p>
              </div>

              {selectedSample.isHumanScoredSubset && selectedSample.humanJudgeScore && (
                <div className="p-3 bg-neutral-900 text-white rounded-xl space-y-2 text-[11px]">
                  <div className="flex items-center justify-between font-bold">
                    <span>Human Expert Audit</span>
                    <span className="text-emerald-400">{selectedSample.humanJudgeScore.overall.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-neutral-300">
                    <div>Grd: {selectedSample.humanJudgeScore.groundedness.toFixed(1)}</div>
                    <div>Cor: {selectedSample.humanJudgeScore.correctness.toFixed(1)}</div>
                    <div>Rel: {selectedSample.humanJudgeScore.relevance.toFixed(1)}</div>
                    <div>Act: {selectedSample.humanJudgeScore.actionability.toFixed(1)}</div>
                    <div>Tone: {selectedSample.humanJudgeScore.tone.toFixed(1)}</div>
                  </div>
                  <p className="text-[10px] text-neutral-300 italic pt-1 border-t border-neutral-800">
                    "{selectedSample.humanJudgeScore.annotatorNotes}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-neutral-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-neutral-400 h-full min-h-[300px]">
              <Database className="w-10 h-10 text-neutral-300 mb-2" />
              <p className="text-xs text-neutral-500">Select any sample on the left to inspect ground truth metadata.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
