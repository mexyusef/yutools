import { diffLines, Change } from 'diff';
import { SuggestedEdit } from './CodeApprovalLensProvider';

export function getDiffedLines(oldStr: string, newStr: string) {
  const lineByLineChanges: Change[] = diffLines(oldStr, newStr);
  console.debug('Line by line changes', lineByLineChanges);

  lineByLineChanges.push({ 
    value: '',
    // C:\ai\yuagent\extensions\yutools\node_modules\@types\diff\index.d.ts
    added: false,
    removed: false,
  }); // Add a dummy to flush any streaks at the end

  let oldFileLineNum: number = 0;
  let newFileLineNum: number = 0;

  let streakStartInNewFile: number | undefined = undefined;
  let streakStartInOldFile: number | undefined = undefined;

  let oldStrLines = oldStr.split('\n');
  let newStrLines = newStr.split('\n');

  const replacements: SuggestedEdit[] = [];

  for (let line of lineByLineChanges) {
    // No change in this line
    if (!line.added && !line.removed) {
      if (streakStartInNewFile !== undefined) {
        const startLine = streakStartInNewFile;
        const endLine = newFileLineNum - 1; // Exclude current line
        const newContent = newStrLines.slice(startLine, endLine + 1).join('\n');

        const originalStartLine = streakStartInOldFile!;
        const originalEndLine = oldFileLineNum - 1; // Exclude current line
        const originalContent = oldStrLines.slice(originalStartLine, originalEndLine + 1).join('\n');

        // Ensure line numbers are non-negative before creating replacement
        if (startLine >= 0 && endLine >= 0 && originalStartLine >= 0 && originalEndLine >= 0) {
          const replacement: SuggestedEdit = { startLine, endLine, newContent, originalStartLine, originalEndLine, originalContent };
          replacements.push(replacement);
        } else {
          console.error(`Invalid line numbers: startLine=${startLine}, endLine=${endLine}, originalStartLine=${originalStartLine}, originalEndLine=${originalEndLine}`);
        }

        streakStartInNewFile = undefined;
        streakStartInOldFile = undefined;
      }

      oldFileLineNum += line.count ?? 0;
      newFileLineNum += line.count ?? 0;
    }

    // Line removed from old file
    else if (line.removed) {
      if (streakStartInNewFile === undefined) {
        streakStartInNewFile = newFileLineNum;
        streakStartInOldFile = oldFileLineNum;
      }

      oldFileLineNum += line.count ?? 0; // Increment for removed lines
    }

    // Line added to new file
    else if (line.added) {
      if (streakStartInNewFile === undefined) {
        streakStartInNewFile = newFileLineNum;
        streakStartInOldFile = oldFileLineNum;
      }

      newFileLineNum += line.count ?? 0; // Increment for added lines
    }
  }

  console.debug('Replacements', replacements);

  return replacements;
}
