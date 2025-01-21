import { FMUSLibrary } from "./FMUSLibrary";

// Example text file
const textFileEntry = FMUSLibrary.convertTextFileToFMUS('/path/to/textfile.txt');
console.log('Text File as FMUS:', textFileEntry);

// Example binary file
const binaryFileEntry = FMUSLibrary.convertBinaryFileToFMUS('/path/to/image.png');
console.log('Binary File as FMUS:', binaryFileEntry);

// Auto-detection based on file type
const autoDetectedEntry = FMUSLibrary.convertFileToFMUS('/path/to/somefile.dat');
console.log('Auto-detected FMUS Entry:', autoDetectedEntry);
