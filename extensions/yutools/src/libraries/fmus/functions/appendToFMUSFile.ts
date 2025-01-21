import * as fs from 'fs';

export function appendToFMUSFile(fmusFile: string, entry: string) {
  // const fs = require('fs');
  // Append the entry to the FMUS file
  fs.appendFileSync(fmusFile, entry + '\n\n', 'utf8');
}