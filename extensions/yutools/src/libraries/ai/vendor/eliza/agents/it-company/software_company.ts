import { Orchestra } from "../../core/orchestra";
import { InMemoryBackend } from "../../backends/in-memory";
import { DeveloperAgent } from "../../agents/developer";
import { TesterAgent } from "../../agents/tester";
import { DeployerAgent } from "../../agents/deployer";
import { MarketResearchAgent } from "./MarketResearchAgent";
import { CampaignAgent } from "./CampaignAgent";
import { FinanceAgent } from "./FinanceAgent";
import { CodeGenerationInstrument } from "../../instruments/code-generation";
import { TestingInstrument } from "../../instruments/testing";
import { DeploymentInstrument } from "../../instruments/deployment";
import { MarketResearchInstrument } from "./MarketResearchInstrument";
import { CampaignCreationInstrument } from "./CampaignCreationInstrument";
import { BudgetingInstrument } from "./BudgetingInstrument";
import { CodeService, DeployService, TestService } from "../../services";

import { MarketResearchService } from "./MarketResearchService";
import { CampaignService } from "./CampaignService";
import { FinanceService } from "./FinanceService";

// Initialize instruments
const codeGenerationInstrument = new CodeGenerationInstrument(new CodeService(process.env.OPENAI_API_KEY!));
const testingInstrument = new TestingInstrument(new TestService());
const deploymentInstrument = new DeploymentInstrument(new DeployService(process.env.AWS_ACCESS_KEY!, process.env.AWS_SECRET_KEY!));
const marketResearchInstrument = new MarketResearchInstrument(new MarketResearchService());
const campaignCreationInstrument = new CampaignCreationInstrument(new CampaignService());
const budgetingInstrument = new BudgetingInstrument(new FinanceService());

// Initialize agents
const developerAgent = new DeveloperAgent({
  id: "dev-1",
  goals: ["Implement new features", "Fix bugs"],
  instruments: [codeGenerationInstrument],
});

const testerAgent = new TesterAgent({
  id: "tester-1",
  goals: ["Run tests", "Write test cases"],
  instruments: [testingInstrument],
});

const deployerAgent = new DeployerAgent({
  id: "deployer-1",
  goals: ["Deploy application", "Manage infrastructure"],
  instruments: [deploymentInstrument],
});

const marketResearchAgent = new MarketResearchAgent({
  id: "market-researcher-1",
  goals: ["Research market trends", "Analyze competitors"],
  instruments: [marketResearchInstrument],
});

const campaignAgent = new CampaignAgent({
  id: "campaign-1",
  goals: ["Create marketing campaigns", "Execute campaigns"],
  instruments: [campaignCreationInstrument],
});

const financeAgent = new FinanceAgent({
  id: "finance-1",
  goals: ["Track expenses", "Create budget"],
  instruments: [budgetingInstrument],
});

// Initialize the orchestra
const orchestra = new Orchestra({
  storageBackend: new InMemoryBackend(),
  performers: [
    // Add performer configurations here if needed
  ],
  instruments: [
    codeGenerationInstrument,
    testingInstrument,
    deploymentInstrument,
    marketResearchInstrument,
    campaignCreationInstrument,
    budgetingInstrument,
  ],
  agents: [
    developerAgent,
    testerAgent,
    deployerAgent,
    marketResearchAgent,
    campaignAgent,
    financeAgent,
  ],
});

// Set goals and run the orchestra
const goals = [
  "Implement new features",
  "Run tests",
  "Deploy application",
  "Research market trends",
  "Create marketing campaigns",
  "Track expenses",
];

async function main() {
  await orchestra.run(goals);
}