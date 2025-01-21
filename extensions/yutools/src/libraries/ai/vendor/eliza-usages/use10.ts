import { Orchestra } from "./core/orchestra";
import { DeveloperAgent, TesterAgent, DesignerAgent, ManagerAgent, DeployerAgent } from "./agents";
import { CodeGenerationInstrument, TestingInstrument, DesignInstrument, DeploymentInstrument } from "./instruments";
import { CodeService, TestService, DesignService, DeployService } from "./services";
import { PostgresBackend } from "./backends";

// Step 1: Set up the storage backend
const storageBackend = new PostgresBackend(process.env.DATABASE_URL!);

// Step 2: Create services
const codeService = new CodeService(process.env.OPENAI_API_KEY!);
const testService = new TestService();
const designService = new DesignService();
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

// Step 5: Create the orchestrator
const orchestra = new Orchestra({
  storageBackend,
  instruments: [codeGenerationInstrument, testingInstrument, designInstrument, deploymentInstrument],
  performers: [
    // Add performer configurations here if needed
  ],
  agents: [developerAgent, testerAgent, designerAgent, managerAgent, deployerAgent],
});

// Step 6: Define the project goals
const projectGoals = [
  "Build a full-stack e-commerce website",
  "Implement shopping cart",
  "Design homepage",
  "Write unit tests",
  "Deploy to AWS",
];

// Step 7: Define task dependencies
orchestra.taskDependencies.set("Implement shopping cart", ["Design homepage"]);
orchestra.taskDependencies.set("Deploy application", ["Implement shopping cart", "Write unit tests"]);

// Step 8: Run the system
orchestra.run(projectGoals);


// Expected Output
// When you run the above code, the system will:
// Process tasks for agents and performers.
// Respect task dependencies (e.g., "Design homepage" must be completed before "Implement shopping cart").
// Log progress and handle errors gracefully.

// Example output:

// DesignerAgent (designer-1): Working on goal - Design homepage
// Generated design for: Design homepage
// // Generated design here...
// Task completed: Design homepage
// DeveloperAgent (dev-1): Working on goal - Implement shopping cart
// Generated code for: Implement shopping cart
// // Generated code here...
// Task completed: Implement shopping cart
// TesterAgent (tester-1): Working on goal - Write unit tests
// Generated tests for: Write unit tests
// // Generated tests here...
// Task completed: Write unit tests
// DeployerAgent (deployer-1): Working on goal - Deploy application
// Deployment logs for: Deploy application
// // Deployment logs here...
// Task completed: Deploy application
// Orchestra: All goals completed!