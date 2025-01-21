import { Orchestra } from "../eliza/core/orchestra";
import { DeveloperAgent, TesterAgent, DesignerAgent, ManagerAgent, DeployerAgent } from "../eliza/agents";
import { CodeGenerationInstrument, TestingInstrument, DesignInstrument, DeploymentInstrument } from "../eliza/instruments";
import { CodeService, TestService, DesignService, DeployService } from "../eliza/services";
import { PostgresBackend } from "../eliza/backends";

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

// Step 2: Set task dependencies
orchestra.setTaskDependencies("Implement shopping cart", ["Design homepage"]);
orchestra.setTaskDependencies("Deploy application", ["Implement shopping cart", "Write unit tests"]);

// Step 3: Add a single dependency to a task
orchestra.addTaskDependency("Deploy application", "Run integration tests");

// Step 4: Remove a single dependency from a task
orchestra.removeTaskDependency("Deploy application", "Write unit tests");

// Step 5: Clear all task dependencies (optional)
// orchestra.clearTaskDependencies();


// Step 6: Define the project goals
const projectGoals = [
  "Build a full-stack e-commerce website",
  "Implement shopping cart",
  "Design homepage",
  "Write unit tests",
  "Deploy to AWS",
];

// // Step 7: Define task dependencies
// orchestra.taskDependencies.set("Implement shopping cart", ["Design homepage"]);
// orchestra.taskDependencies.set("Deploy application", ["Implement shopping cart", "Write unit tests"]);

// Step 8: Run the system
// Step 6: Check if a task can start
async function main() {
  const canStart = await orchestra.canStartTask("Deploy application");
  console.log(`Can start "Deploy application"? ${canStart}`);

  // Step 7: Mark a task as completed
  await orchestra.markTaskCompleted("Design homepage");


  await orchestra.run(projectGoals);
}

// Expected Output

// When you run the above code, the system will:

// Process tasks for agents and performers.

// Respect task dependencies (e.g., "Design homepage" must be completed before "Implement shopping cart").

// Log progress and handle errors gracefully.

// Example output:
// [2023-10-15T12:00:00.000Z] Orchestra: Starting system with goals - Build a full-stack e-commerce website, Implement shopping cart, Design homepage, Write unit tests, Deploy to AWS
// [2023-10-15T12:00:01.000Z] DesignerAgent (designer-1): Working on goal - Design homepage
// [2023-10-15T12:00:02.000Z] Generated design for: Design homepage
// [2023-10-15T12:00:03.000Z] Task completed: Design homepage
// [2023-10-15T12:00:04.000Z] DeveloperAgent (dev-1): Working on goal - Implement shopping cart
// [2023-10-15T12:00:05.000Z] Generated code for: Implement shopping cart
// [2023-10-15T12:00:06.000Z] Task completed: Implement shopping cart
// [2023-10-15T12:00:07.000Z] TesterAgent (tester-1): Working on goal - Write unit tests
// [2023-10-15T12:00:08.000Z] Generated tests for: Write unit tests
// [2023-10-15T12:00:09.000Z] Task completed: Write unit tests
// [2023-10-15T12:00:10.000Z] DeployerAgent (deployer-1): Working on goal - Deploy application
// [2023-10-15T12:00:11.000Z] Deployment logs for: Deploy application
// [2023-10-15T12:00:12.000Z] Task completed: Deploy application
// [2023-10-15T12:00:13.000Z] Orchestra: All goals completed!