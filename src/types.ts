export type AppleIntentType =
  | 'device_issue'
  | 'account_issue'
  | 'billing_payment'
  | 'subscription'
  | 'app_issue'
  | 'order_purchase'
  | 'refund_return'
  | 'password_security'
  | 'technical_troubleshooting'
  | 'other_escalation';

export type SystemTier = 'MAJORITY' | 'TF_IDF' | 'RETRIEVAL_ONLY' | 'SUPPORT_IQ';

export type EscalationDecision = 'AUTO_HANDLE' | 'ESCALATE_TO_HUMAN';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type SampleCategory = 'Common' | 'Ambiguous' | 'Rare' | 'Multi-intent' | 'Escalation';

export interface IntentDefinition {
  id: AppleIntentType;
  name: string;
  description: string;
  example: string;
  active: boolean;
}

export interface EscalationBreakdown {
  escalationScore: number;
  decision: EscalationDecision;
  reason: string;
  classifierUncertainty: number; // weight 0.30
  retrievalWeakness: number; // weight 0.25
  highRiskIntent: number; // weight 0.20
  multiIntent: number; // weight 0.15
  generationUncertainty: number; // weight 0.10
}

export interface HistoricalResolution {
  id: string;
  customerMessage: string;
  agentResponse: string;
  intent: AppleIntentType;
  resolution: string;
  similarity?: number;
  timestamp?: string;
  conversationId?: string;
  agentHandle?: string; // e.g. "^KM", "^JM"
  verifiedDoc?: boolean;
}

export interface HumanJudgeScore {
  groundedness: number; // 1-5
  correctness: number; // 1-5
  relevance: number; // 1-5
  actionability: number; // 1-5
  tone: number; // 1-5
  overall: number; // 1-5
  annotatorNotes: string;
}

export interface GoldenSample {
  id: string; // e.g. "APL-001" or numeric string
  customerMessage: string;
  intent: AppleIntentType;
  shouldEscalate: boolean;
  reason: string;
  expectedAction: string;
  severity: SeverityLevel;
  category: SampleCategory;
  historicalResolution: string;
  isHumanScoredSubset?: boolean;
  humanJudgeScore?: HumanJudgeScore;
}

export interface AgentResult {
  system: SystemTier;
  intent: AppleIntentType;
  intentConfidence: number;
  retrievalResults: HistoricalResolution[];
  draftReply: string;
  grounded: boolean;
  escalate: boolean;
  escalationScore: number;
  escalationReason: string;
  escalationBreakdown: EscalationBreakdown;
  processingTimeMs: number;
  characterCount: number;
  safetyPassed: boolean;
  modelUsed: string;
}

export interface JudgeEvaluation {
  groundedness: number; // 1-5
  correctness: number; // 1-5
  relevance: number; // 1-5
  actionability: number; // 1-5
  tone: number; // 1-5
  overall: number; // 1-5
  reason: string;
  groundingPassed: boolean;
  feedback: {
    groundednessNote: string;
    correctnessNote: string;
    relevanceNote: string;
    actionabilityNote: string;
    toneNote: string;
  };
}

export interface BenchmarkMetrics {
  systemName: string;
  totalEvaluated: number;
  intentAccuracy: number;
  intentMacroF1: number;
  intentPrecision: number;
  intentRecall: number;
  escalationPrecision: number;
  escalationRecall: number; // Critical safety recall
  escalationF1: number;
  criticalEscapeRate: number; // % of critical cases falsely auto-handled
  automationCoverage: number; // % of total requests auto-handled
  accuracyAtCoverage: number; // accuracy among auto-handled requests
  replyQuality: number; // 1-5 overall
  groundedness: number; // 1-5
  correctness: number; // 1-5
  relevance: number; // 1-5
  actionability: number; // 1-5
  tone: number; // 1-5
  within280CharPct: number;
  avgLatencyMs: number;
  estimatedCostPer1k: number;
}

export interface HumanAgreementStats {
  sampleSize: number;
  pearsonCorrelation: number;
  spearmanCorrelation: number;
  exactAgreementPct: number;
  withinOnePointPct: number;
  cohensWeightedKappa: number;
  krippendorffAlpha: number;
  meanAbsoluteError: number;
  humanMeanScore: number;
  judgeMeanScore: number;
}

export interface FailureModeItem {
  id: string;
  category: string;
  title: string;
  frequencyEstimate: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  exampleCustomerMessage: string;
  predictedIntent: AppleIntentType;
  goldIntent: AppleIntentType;
  retrievedEvidence: string;
  generatedReply: string;
  analysis: string;
  rootCauseHypothesis: string;
  engineeringRemediation: string;
}

export interface DecisionLogRecord {
  id: string;
  decision: string;
  why: string;
  impact: string;
  alternativesWeighed: string;
  tradeOff: string;
  date: string;
}

export interface DatasetStatistics {
  rawTweetsTotal: number;
  appleSupportTweets: number;
  reconstructedConversations: number;
  cleanedRecords: number;
  trainingCorpus: number;
  retrievalCorpus: number;
  goldenEvaluationSet: number;
  temporalSplit: {
    trainDateRange: string;
    evalDateRange: string;
  };
}
