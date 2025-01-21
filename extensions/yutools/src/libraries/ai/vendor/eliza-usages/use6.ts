import { TestingInstrument, DesignInstrument, DeploymentInstrument } from "./instruments";
import { TestService, DesignService, DeployService } from "./services";

// Step 1: Create services
const testService = new TestService();
const designService = new DesignService();
const deployService = new DeployService();

// Step 2: Create instruments
const testingInstrument = new TestingInstrument(testService);
const designInstrument = new DesignInstrument(designService);
const deploymentInstrument = new DeploymentInstrument(deployService);

// Step 3: Use the instruments
async function main() {
  await testingInstrument.handler("Write unit tests for shopping cart");
  await testingInstrument.handler("Run integration tests for checkout");

  await designInstrument.handler("Design homepage");
  await designInstrument.handler("Create product page UI");

  await deploymentInstrument.handler("Deploy application to AWS");
  await deploymentInstrument.handler("Manage infrastructure for production");
}

main();


// Expected Output

// When you run the above code, the instruments will:
// Perform their respective tasks using the services.
// Log the results to the console.

// Example output:

// Generated tests for: Write unit tests for shopping cart
// // Generated tests here...
// Test results for: Run integration tests for checkout
// // Test results here...
// Generated design for: Design homepage
// // Generated design here...
// Generated design for: Create product page UI
// // Generated design here...
// Deployment logs for: Deploy application to AWS
// // Deployment logs here...
// Infrastructure logs for: Manage infrastructure for production
// // Infrastructure logs here...