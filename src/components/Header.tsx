import React from 'react';
import { Bot, CheckCircle2, Database, FileText, FlaskConical, ListChecks, Play, Sparkles } from 'lucide-react';

export type ActiveTab =
  | 'PLAYGROUND'
  | 'BENCHMARK'
  | 'DATASET'
  | 'REPORT'
  | 'DECISIONS'
  | 'REPRODUCE';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  datasetCount: number;
  isGeminiConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  datasetCount,
  isGeminiConfigured,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'PLAYGROUND', label: 'Agent Playground', icon: <Play className="w-4 h-4" /> },
    { id: 'BENCHMARK', label: 'Evaluation Harness', icon: <FlaskConical className="w-4 h-4" />, badge: '4 Systems' },
    { id: 'DATASET', label: 'Golden Dataset', icon: <Database className="w-4 h-4" />, badge: `${datasetCount}` },
    { id: 'REPORT', label: 'Formal Report', icon: <FileText className="w-4 h-4" />, badge: 'Top 5 Failures' },
    { id: 'DECISIONS', label: 'Decision Log', icon: <ListChecks className="w-4 h-4" />, badge: '15 Decisions' },
    { id: 'REPRODUCE', label: '15-Min Reproduce', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shadow-xs overflow-hidden p-1 border border-neutral-800">
              <img
                src="/favicon.svg"
                alt="SupportIQ Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex items-baseline">
                  <span className="font-extrabold text-neutral-900 text-lg tracking-tight">Support</span>
                  <span className="font-black text-sky-600 text-lg tracking-tight">IQ</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200">
                  @AppleSupport
                </span>
                {isGeminiConfigured ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium flex items-center gap-1 border border-blue-200">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Gemini Flash Active
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                    Deterministic RAG Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 hidden sm:block">
                Evaluation-First AI Support Agent for Apple on Twitter • Zero-Leakage Benchmark
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id.toLowerCase()}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
