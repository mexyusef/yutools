export interface SecurityIssue {
  package: string;
  version: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendations: string[];
}

export interface AnalysisResult {
  pattern: string;
  locations: Location[];
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface Location {
  line: number;
  column: number;
  length: number;
}

export interface VersionMap {
  [version: string]: {
      target: string;
      breaking: string[];
  };
}

export interface MigrationPlan {
  steps: MigrationStep[];
  estimatedEffort: EffortEstimate;
  risks: Risk[];
}

export interface MigrationStep {
  package: string;
  from: string;
  to: string;
  breaking: string[];
  codemods: CodemodInfo[];
}

export interface CodemodInfo {
  name: string;
  description: string;
  path: string;
}

export interface EffortEstimate {
  hours: number;
  confidence: number;
  parallel: boolean;
}

export interface Risk {
  type: string;
  description: string;
  mitigation: string;
  probability: number;
}

export interface AdvancedAnalysisResult extends AnalysisResult {
  impact: ImpactAssessment;
  fixes: CodeFix[];
  performance: PerformanceMetrics;
  refactorSteps: RefactorStep[];
}

export interface ImpactAssessment {
  performance: number;
  maintenance: number;
  security: number;
}

export interface CodeFix {
  description: string;
  code: string;
  automation: boolean;
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  reRenderFrequency: number;
}

export interface RefactorStep {
  description: string;
  effort: number;
  automated: boolean;
}

export interface Codemod {
  name: string;
  transform: (content: string) => Promise<string>;
  risk: 'high' | 'medium' | 'low';
}

export interface CodemodResult {
  success: boolean;
  changes?: FileDiff[];
  error?: string;
}

export interface FileDiff {
  line: number;
  original: string;
  transformed: string;
}

export interface MigrationResult {
  success: boolean;
  results: StepResult[];
  error?: string;
}

export interface StepResult {
  success: boolean;
  changes?: FileDiff[];
  error?: string;
}
