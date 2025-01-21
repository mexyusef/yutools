import TypeScript from 'tree-sitter-typescript';
import { extractEntities } from './testTreeSitter';
import Parser from 'tree-sitter';

const tsParser = new Parser();
tsParser.setLanguage(TypeScript.typescript as unknown as Parser.Language);

export function analyzeTypeScript(code: string) {
  const tree = tsParser.parse(code);
  const rootNode = tree.rootNode;
  const entities = extractEntities(rootNode, code);
  console.log(entities);
}

// analyzeDirectory('./src', '.ts'); // Analyze all TypeScript files in the 'src' directory