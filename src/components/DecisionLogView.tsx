import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Filter, HelpCircle, ListChecks, Scale } from 'lucide-react';
import { DECISION_LOG_ITEMS } from '../data/reportAndDecisionLog';

export const DecisionLogView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(DECISION_LOG_ITEMS[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center space-x-2">
          <ListChecks className="w-5 h-5 text-neutral-900" />
          <h2 className="text-base sm:text-lg font-bold text-neutral-900">
            Architectural Decision Log: 15 Non-Obvious Decisions & Trade-offs
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Documenting the non-obvious engineering trade-offs, discarded alternatives, and rationale that shaped the SupportIQ Apple Support AI pipeline from initial Kaggle data extraction to production benchmarking.
        </p>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-3">
        {DECISION_LOG_ITEMS.map((item, index) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden transition"
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    {item.id}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-neutral-900">
                    {item.decision}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-400 hidden sm:inline">Details</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-neutral-100 space-y-3 text-xs sm:text-sm bg-neutral-50/40">
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-900 block text-xs uppercase tracking-wider">
                      1. Engineering Rationale:
                    </span>
                    <p className="text-neutral-700 leading-relaxed">{item.why}</p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="font-bold text-neutral-900 block text-xs uppercase tracking-wider">
                      2. Measurable Impact:
                    </span>
                    <p className="text-neutral-700 leading-relaxed">{item.impact}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                      <span className="font-semibold text-neutral-500 block text-xs">
                        Alternative Considered:
                      </span>
                      <p className="text-neutral-800 text-xs font-medium">{item.alternativesWeighed}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                      <span className="font-semibold text-neutral-700 block text-xs">
                        Trade-Off & Bound:
                      </span>
                      <p className="text-neutral-800 text-xs font-medium">{item.tradeOff}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
