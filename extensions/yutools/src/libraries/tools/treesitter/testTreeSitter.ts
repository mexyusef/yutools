// import * as Parser from 'tree-sitter';
import Parser from 'tree-sitter';
import * as Python from 'tree-sitter-python';
// import TypeScript from 'tree-sitter-typescript';

// Initialize the parser
export const parser = new Parser();
// Cast the Python language object to the correct type
parser.setLanguage(Python as unknown as Parser.Language);


/**
 * Extract entities from the AST.
 *
 * @param node - The root node of the AST.
 * @param code - The source code (used to extract text from nodes).
 * @returns An object containing lists of classes, functions, methods, and variables.
 */
export function extractEntities(node: Parser.SyntaxNode, code: string) {
  const entities = {
    classes: [] as string[],
    functions: [] as string[],
    methods: [] as string[],
    variables: [] as string[],
  };

  // Traverse the AST
  function traverse(node: Parser.SyntaxNode) {
    switch (node.type) {
      case 'class_definition':
        const className = node.childForFieldName('name')?.text || 'unknown';
        entities.classes.push(className);
        break;

      case 'function_definition':
        const functionName = node.childForFieldName('name')?.text || 'unknown';
        if (node.parent?.type === 'class_definition') {
          entities.methods.push(functionName);
        } else {
          entities.functions.push(functionName);
        }
        break;

      case 'assignment':
        const variableName = node.childForFieldName('left')?.text || 'unknown';
        entities.variables.push(variableName);
        break;
    }

    // Recursively traverse child nodes
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(node);
  return entities;
}

/**
 * Parse the code and print the AST entities.
 *
 * @param code - The source code to analyze.
 */
export function printASTEntities(code: string) {
  // Parse the code
  const tree = parser.parse(code);
  const rootNode = tree.rootNode;

  // Extract entities
  const entities = extractEntities(rootNode, code);

  // Print the results
  console.log('Classes:', entities.classes);
  console.log('Functions:', entities.functions);
  console.log('Methods:', entities.methods);
  console.log('Variables:', entities.variables);
}

function main() {
  const code = `
class MyClass:
    def __init__(self):
        self.x = 10

    def my_method(self):
        return self.x

def my_function():
    y = 20
    return y

z = 30
`;
  printASTEntities(code);
}

// Classes: [ 'MyClass' ]
// Functions: [ 'my_function' ]
// Methods: [ '__init__', 'my_method' ]
// Variables: [ 'self.x', 'y', 'z' ]