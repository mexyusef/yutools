import { Orchestra } from "orchestra";
import { DeveloperAgent, DesignerAgent } from "orchestra/agents";
import { CodeGenerationInstrument, DesignInstrument } from "orchestra/instruments";
import { PostgresBackend } from "orchestra/backends";

// Step 1: Set up the storage backend
const storageBackend = new PostgresBackend(process.env.DATABASE_URL!);

// Step 2: Create instruments
const codeGenerationInstrument = new CodeGenerationInstrument();
const designInstrument = new DesignInstrument();

// Step 3: Create agents
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

// Step 4: Create the orchestrator
const orchestra = new Orchestra({
  storageBackend,
  agents: [developerAgent, designerAgent],
});

// Step 5: Define the project goals
const projectGoals = [
  "Build a full-stack e-commerce website",
  "Implement shopping cart",
  "Design homepage",
];

// Step 6: Run the system
orchestra.run(projectGoals);