import fs from 'fs';
import path from 'path';
import express from 'express';
import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';
import TypeScript from 'tree-sitter-typescript';
import { analyzeDirectory } from './dirutils';
import { analyzeAndExport } from './analyzeAndExport';

// Initialize parsers
const pythonParser = new Parser();
pythonParser.setLanguage(Python as unknown as Parser.Language);

const tsParser = new Parser();
tsParser.setLanguage(TypeScript.typescript as unknown as Parser.Language);

// File scanning, JSON export, and visualization functions go here...

function main() {
  // Analyze Python files
  analyzeDirectory('./src/python', '.py');

  // Analyze TypeScript files
  analyzeDirectory('./src/typescript', '.ts');

  // Export to JSON
  const code = `
class MyClass:
    def __init__(self):
        self.x = 10

    def my_method(self):
        return self.x
  `;
  analyzeAndExport(code, './output/entities.json');

  // Start visualization server
  const app = express();
  app.use(express.static('public'));
  app.listen(3000, () => console.log('Server running at http://localhost:3000'));
}

main();
