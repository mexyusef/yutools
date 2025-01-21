import * as fs from "fs";
import { extractEntities, parser } from "./testTreeSitter";

/**
 * Save extracted entities to a JSON file.
 *
 * @param entities - The extracted entities.
 * @param outputPath - The path to the output JSON file.
 */
function saveToJSON(entities: any, outputPath: string) {
  const json = JSON.stringify(entities, null, 2); // Pretty-print JSON
  fs.writeFileSync(outputPath, json, 'utf-8');
  console.log(`Entities saved to ${outputPath}`);
}

/**
 * Parse the code, extract entities, and save them to a JSON file.
 *
 * @param code - The source code to analyze.
 * @param outputPath - The path to the output JSON file.
 */
export function analyzeAndExport(code: string, outputPath: string) {
  const tree = parser.parse(code);
  const rootNode = tree.rootNode;
  const entities = extractEntities(rootNode, code);
  saveToJSON(entities, outputPath);
}

// const code = `
// class MyClass:
//     def __init__(self):
//         self.x = 10

//     def my_method(self):
//         return self.x

// def my_function():
//     y = 20
//     return y

// z = 30
// `;

// analyzeAndExport(code, './output/entities.json');