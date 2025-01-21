import * as vscode from 'vscode';
import { BuildAnalysis } from './dependencyAnalyzer';

export class BuildAnalyzer {
  private buildTimes: Map<string, number[]> = new Map();
  private cacheHits: Map<string, number> = new Map();

  trackBuildTime(branch: string, duration: number): void {
      if (!this.buildTimes.has(branch)) {
          this.buildTimes.set(branch, []);
      }
      this.buildTimes.get(branch)!.push(duration);
  }

  trackCacheHit(type: string): void {
      const current = this.cacheHits.get(type) || 0;
      this.cacheHits.set(type, current + 1);
  }

  async analyzeBuildPerformance(branch: string): Promise<BuildAnalysis> {
      const times = this.buildTimes.get(branch) || [];
      const average = times.reduce((a, b) => a + b, 0) / times.length;
      
      return {
          averageDuration: average,
          totalBuilds: times.length,
          cacheEfficiency: this.calculateCacheEfficiency(),
          suggestions: this.generateOptimizationSuggestions()
      };
  }

  private calculateCacheEfficiency(): number {
      const hits = Array.from(this.cacheHits.values())
          .reduce((a, b) => a + b, 0);
      return hits / this.buildTimes.size;
  }

  private generateOptimizationSuggestions(): string[] {
      const suggestions: string[] = [];
      if (this.calculateCacheEfficiency() < 0.5) {
          suggestions.push('Consider optimizing build cache usage');
      }
      return suggestions;
  }
}
