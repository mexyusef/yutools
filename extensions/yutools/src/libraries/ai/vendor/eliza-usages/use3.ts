import { Orchestra } from "orchestra";
import { DeveloperAgent, DesignerAgent, TesterAgent, ManagerAgent, DeployerAgent } from "orchestra/agents";
import { CodeGenerationInstrument, TestingInstrument, DesignInstrument, DeploymentInstrument } from "orchestra/instruments";
import { CodeService, TestService, DesignService, DeployService } from "orchestra/services";
import { PostgresBackend } from "orchestra/backends";

// Step 1: Set up the storage backend
const storageBackend = new PostgresBackend(process.env.DATABASE_URL!);

// Step 2: Create services
const codeService = new CodeService(process.env.OPENAI_API_KEY!);
const testService = new TestService();
const designService = new DesignService(process.env.FIGMA_API_KEY!);
const deployService = new DeployService(process.env.AWS_ACCESS_KEY!, process.env.AWS_SECRET_KEY!);

// Step 3: Create instruments
const codeGenerationInstrument = new CodeGenerationInstrument(codeService);
const testingInstrument = new TestingInstrument(testService);
const designInstrument = new DesignInstrument(designService);
const deploymentInstrument = new DeploymentInstrument(deployService);

// Step 4: Create agents
const developerAgent = new DeveloperAgent({
  id: "dev-1",
  goals: ["Implement shopping cart", "Fix bugs"],
  instruments: [codeGenerationInstrument],
});

const designerAgent = new DesignerAgent({
  id: "design-1",
  goals: ["Design homepage", "Create product page UI"],
  instruments: [designInstrument],
});

const testerAgent = new TesterAgent({
  id: "tester-1",
  goals: ["Write unit tests", "Run integration tests"],
  instruments: [testingInstrument],
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

// Step 5: Create the orchestrator
const orchestra = new Orchestra({
  storageBackend,
  agents: [developerAgent, designerAgent, testerAgent, managerAgent, deployerAgent],
});

// Step 6: Define the project goals
const projectGoals = [
  "Build a full-stack e-commerce website",
  "Implement shopping cart",
  "Design homepage",
  "Write unit tests",
  "Deploy to AWS",
];

// Step 7: Run the system
orchestra.run(projectGoals);