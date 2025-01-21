// The performers will handle message-based workflows, while the agents will handle goal-based workflows.
import { Performer } from "./performer";
import { Agent } from "../types/agent";
import { InstrumentManager } from "./instrument-manager";
import { StorageBackend } from "../backends";
import { OrchestraConfig, PerformerConfig } from "../types";
import { Logger } from "../utils/logger";

export class Orchestra {
  private performers: Map<string, Performer> = new Map();
  private agents: Agent[] = [];
  private instrumentManager: InstrumentManager;
  private storageBackend: StorageBackend;
  private taskDependencies: Map<string, string[]>; // Task dependencies
  private completedTasks: Set<string>; // Track completed tasks

  constructor(config: OrchestraConfig) {
    this.instrumentManager = new InstrumentManager(config.instruments || []);
    this.storageBackend = config.storageBackend;
    this.taskDependencies = new Map();
    this.completedTasks = new Set();

    // Initialize performers (if any)
    if (config.performers) {
      config.performers.forEach((performerConfig) => {
        const performer = new Performer(
          performerConfig,
          this.instrumentManager,
          this.storageBackend
        );
        this.performers.set(performerConfig.id, performer);
      });
    }

    // Initialize agents (if any)
    if (config.agents) {
      this.agents = config.agents;
    }
  }

  async processMessage(performerId: string, message: any): Promise<void> {
    const performer = this.performers.get(performerId);
    if (!performer) throw new Error(`Performer ${performerId} not found`);
    await performer.processMessage(message);
  }

  public async run(goals: string[]): Promise<void> {
    Logger.log("Orchestra: Starting system with goals - " + goals.join(", "));

    // Assign goals to agents
    for (const agent of this.agents) {
      agent.setGoals(goals);
    }

    // Start processing tasks
    while (true) {
      // Process tasks for agents
      for (const agent of this.agents) {
        try {
          await agent.processTasks();
        } catch (error) {
          // console.error(`Orchestra: Error processing tasks for agent - ${agent.id}`, error);
          Logger.error(`Orchestra: Error processing tasks for agent - ${agent.id}`, error);
        }
      }

      // Process messages for performers
      for (const performer of this.performers.values()) {
        try {
          // Placeholder for processing performer messages
          // You can add logic here to handle messages for performers
        } catch (error) {
          // console.error(`Orchestra: Error processing messages for performer - ${performer.id}`, error);
          Logger.error(`Orchestra: Error processing messages for performer - ${performer.id}`, error);
        }
      }

      // Check if all goals are completed
      const completed = await this.checkProgress(goals);
      if (completed) {
        // console.log("Orchestra: All goals completed!");
        Logger.log("Orchestra: All goals completed!");
        break;
      }
    }
  }

  // Getter for task dependencies
  public getTaskDependencies(): Map<string, string[]> {
    return new Map(this.taskDependencies); // Return a copy to prevent direct modification
  }

  // Setter for task dependencies
  public setTaskDependencies(task: string, dependencies: string[]): void {
    this.taskDependencies.set(task, dependencies);
  }

  // Clear all task dependencies
  public clearTaskDependencies(): void {
    this.taskDependencies.clear();
  }

  // Add a single dependency to a task
  public addTaskDependency(task: string, dependency: string): void {
    if (!this.taskDependencies.has(task)) {
      this.taskDependencies.set(task, []);
    }
    this.taskDependencies.get(task)!.push(dependency);
  }

  // Remove a single dependency from a task
  public removeTaskDependency(task: string, dependency: string): void {
    if (this.taskDependencies.has(task)) {
      const dependencies = this.taskDependencies.get(task)!;
      const index = dependencies.indexOf(dependency);
      if (index !== -1) {
        dependencies.splice(index, 1);
      }
    }
  }

  // private async checkProgress(goals: string[]): Promise<boolean> {
  //   // Placeholder for progress checking logic
  //   // You can implement logic to check if all goals are completed
  //   return false;
  // }
  public async checkProgress(goals: string[]): Promise<boolean> {
    // Check if all goals are completed
    for (const goal of goals) {
      if (!this.completedTasks.has(goal)) {
        return false;
      }
    }
    return true;
  }

  public async markTaskCompleted(task: string): Promise<void> {
    this.completedTasks.add(task);
    // console.log(`Task completed: ${task}`);
    Logger.log(`Task completed: ${task}`);
  }

  public async canStartTask(task: string): Promise<boolean> {
    const dependencies = this.taskDependencies.get(task) || [];
    for (const dependency of dependencies) {
      if (!this.completedTasks.has(dependency)) {
        return false;
      }
    }
    return true;
  }

}
