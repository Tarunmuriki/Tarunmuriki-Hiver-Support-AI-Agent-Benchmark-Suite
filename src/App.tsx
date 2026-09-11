import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AgentPlayground } from './components/AgentPlayground';
import { BenchmarkHarness } from './components/BenchmarkHarness';
import { GoldenDatasetExplorer } from './components/GoldenDatasetExplorer';
import { ReportView } from './components/ReportView';
import { DecisionLogView } from './components/DecisionLogView';
import { ReproducibilityView } from './components/ReproducibilityView';
import { getHeadlineBenchmark } from './lib/evalHarness';
import { GOLDEN_DATASET } from './data/goldenDataset';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('PLAYGROUND');
  const [isGeminiConfigured, setIsGeminiConfigured] = useState<boolean>(false);

  // Compute headline metrics for initial instant render
  const headline = getHeadlineBenchmark();
  const humanSamples = GOLDEN_DATASET.filter(s => s.isHumanScoredSubset);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsGeminiConfigured(Boolean(data.geminiConfigured));
      })
      .catch(err => {
        console.warn('Backend health check skipped, using local fallback:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Global Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        datasetCount={GOLDEN_DATASET.length}
        isGeminiConfigured={isGeminiConfigured}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'PLAYGROUND' && (
          <AgentPlayground isGeminiConfigured={isGeminiConfigured} />
        )}

        {activeTab === 'BENCHMARK' && (
          <BenchmarkHarness
            headlineMajority={headline.majorityMetrics}
            headlineTfIdf={headline.tfIdfMetrics}
            headlineRetrieval={headline.retrievalMetrics}
            headlineSupportIq={headline.supportIqMetrics}
            agreementStats={headline.agreementStats}
            humanSamples={humanSamples}
          />
        )}

        {activeTab === 'DATASET' && <GoldenDatasetExplorer />}

        {activeTab === 'REPORT' && <ReportView />}

        {activeTab === 'DECISIONS' && <DecisionLogView />}

        {activeTab === 'REPRODUCE' && <ReproducibilityView />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-neutral-800">Hiver SDE Intern Assignment</span>
            <span>•</span>
            <span>SupportIQ: @AppleSupport on Twitter</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab('REPORT')}
              className="hover:text-neutral-900 transition underline underline-offset-2"
            >
              Formal Report
            </button>
            <button
              onClick={() => setActiveTab('BENCHMARK')}
              className="hover:text-neutral-900 transition underline underline-offset-2"
            >
              Evaluation Benchmark (N=200)
            </button>
            <button
              onClick={() => setActiveTab('DECISIONS')}
              className="hover:text-neutral-900 transition underline underline-offset-2"
            >
              Decision Log (15 Items)
            </button>
            <button
              onClick={() => setActiveTab('REPRODUCE')}
              className="hover:text-neutral-900 transition underline underline-offset-2"
            >
              15-Min Reproduction Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
