import { BaseTool, ToolCallingAgent } from "..";
import { FinalAnswerTool, SearchTool, UserInputTool } from "../tools";

// Create instances of the tools
const searchTool = new SearchTool();
const userInputTool = new UserInputTool();
const finalAnswerTool = new FinalAnswerTool();

// Test the SearchTool
searchTool.execute({ query: "TypeScript agents" })
  .then(results => console.log("Search results:", results))
  .catch(error => console.error(error));

// Test the UserInputTool
userInputTool.execute({ question: "What is your name?" })
  .then(input => console.log("User input:", input))
  .catch(error => console.error(error));

// Test the FinalAnswerTool
finalAnswerTool.execute({ answer: "This is the final answer." })
  .then(answer => console.log("Final answer:", answer))
  .catch(error => console.error(error));




// // Create instances of the tools
// const searchTool = new SearchTool();
// const userInputTool = new UserInputTool();
// const finalAnswerTool = new FinalAnswerTool();

// Create a ToolCallingAgent with the tools
const toolCallingAgent = new ToolCallingAgent(
  new Map<string, BaseTool>([
    ["search_tool", searchTool],
    ["user_input_tool", userInputTool],
    ["final_answer_tool", finalAnswerTool],
  ])
);

// Execute a search task
const searchTask = JSON.stringify({
  toolName: "search_tool",
  arguments: { query: "TypeScript agents" },
});

toolCallingAgent.executeTask(searchTask)
  .then(results => console.log("Search results:", results))
  .catch(error => console.error(error));

// Execute a user input task
const userInputTask = JSON.stringify({
  toolName: "user_input_tool",
  arguments: { question: "What is your name?" },
});

toolCallingAgent.executeTask(userInputTask)
  .then(input => console.log("User input:", input))
  .catch(error => console.error(error));

// Execute a final answer task
const finalAnswerTask = JSON.stringify({
  toolName: "final_answer_tool",
  arguments: { answer: "This is the final answer." },
});

toolCallingAgent.executeTask(finalAnswerTask)
  .then(answer => console.log("Final answer:", answer))
  .catch(error => console.error(error));
