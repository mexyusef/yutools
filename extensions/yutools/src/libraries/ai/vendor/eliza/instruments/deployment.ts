// src/instruments/deployment.ts
import { Instrument } from "../types";
import { DeployService } from "../services";

export class DeploymentInstrument implements Instrument {
  name = "deployment";
  description = "Deploys applications and manages infrastructure for software development tasks";
  private deployService: DeployService;

  constructor(deployService: DeployService) {
    this.deployService = deployService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Deploy")) {
      const deploymentLogs = await this.deployService.deployApplication(task);
      console.log(`Deployment logs for: ${task}`);
      console.log(deploymentLogs);
    } else if (task.includes("Manage")) {
      const infrastructureLogs = await this.deployService.manageInfrastructure(task);
      console.log(`Infrastructure logs for: ${task}`);
      console.log(infrastructureLogs);
    }
  }
}