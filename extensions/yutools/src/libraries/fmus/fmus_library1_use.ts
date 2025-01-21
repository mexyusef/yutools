import { FMUS } from './fmus_library1';

const filePath = './example.fmus';

// Parse an FMUS file
const entries = FMUS.parseFile(filePath);

// Display all titles
console.log('Titles:', FMUS.getTitles(entries));

// Filter entries by title containing 'entry 1'
const filtered = FMUS.filterEntries(entries, /entry 1/);
console.log('Filtered Entries:', filtered);

// Save filtered entries to a new file
FMUS.saveToFile('./filtered.fmus', filtered);
