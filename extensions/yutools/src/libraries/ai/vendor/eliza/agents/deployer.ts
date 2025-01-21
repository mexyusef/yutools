import { Agent, Instrument } from "../types";
import { DeploymentInstrument } from "../instruments";

export class DeployerAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Deploy") || goal.includes("Manage")) {
        // Use the deployment instrument to deploy the application
        const deploymentInstrument = this.instruments.find(
          (instrument) => instrument.name === "deployment"
        ) as DeploymentInstrument | undefined;

        if (deploymentInstrument) {
          console.log(`DeployerAgent (${this.id}): Working on goal - ${goal}`);
          await deploymentInstrument.handler(goal);
        } else {
          console.error(`DeployerAgent (${this.id}): No deployment instrument found`);
        }
      }
    }
  }
}