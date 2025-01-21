import { Orchestra } from "./core/orchestra";
import { DeveloperAgent, TesterAgent, DesignerAgent, ManagerAgent, DeployerAgent } from "./agents";
import { CodeGenerationInstrument, TestingInstrument, DesignInstrument, DeploymentInstrument } from "./instruments";
import { PostgresBackend } from "./backends";

// Step 1: Set up the storage backend
const storageBackend = new PostgresBackend(process.env.DATABASE_URL!);

// Step 2: Create instruments
const codeGenerationInstrument = new CodeGenerationInstrument();
const testingInstrument = new TestingInstrument();
const designInstrument = new DesignInstrument();
const deploymentInstrument = new DeploymentInstrument();

// Step 3: Create agents
const developerAgent = new DeveloperAgent({
  id: "dev-1",
  goals: ["Implement shopping cart", "Fix bugs"],
  instruments: [codeGenerationInstrument],
});

const testerAgent = new TesterAgent({
  id: "tester-1",
  goals: ["Write unit tests", "Run integration tests"],
  instruments: [testingInstrument],
});

const designerAgent = new DesignerAgent({
  id: "designer-1",
  goals: ["Design homepage", "Create product page UI"],
  instruments: [designInstrument],
});

const managerAgent = new ManagerAgent({
  id: "manager-1",
  goals: ["Coordinate tasks", "Monitor progress"],
});

const deployerAgent = new DeployerAgent({
  id: "deployer-1",
  goals: ["Deploy application", "Manage infrastructure"],
  instruments: [deploymentInstrument],
});

// Step 4: Create the orchestrator
const orchestra = new Orchestra({
  storageBackend,
  agents: [developerAgent, testerAgent, designerAgent, managerAgent, deployerAgent],
});

// Step 5: Define the project goals
const projectGoals = [
  "Build a full-stack e-commerce website",
  "Implement shopping cart",
  "Design homepage",
  "Write unit tests",
  "Deploy to AWS",
];

// Step 6: Run the system
orchestra.run(projectGoals);
