import { VsGentMessage } from "@shared/ExtensionMessage"

/**
 * Combines sequences of command and command_output messages in an array of VsGentMessages.
 *
 * @param messages - An array of VsGentMessage objects to process.
 * @returns A new array of VsGentMessage objects with combined command sequences.
 */
export function combineCommandSequences(messages: VsGentMessage[]): VsGentMessage[] {
  const combinedCommands: VsGentMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].type === "ask" && messages[i].ask === "command") {
      let combinedText = messages[i].text || "";
      let j = i + 1;

      while (j < messages.length) {
        if (messages[j].type === "say" && messages[j].say === "command_output") {
          combinedText += "\n" + (messages[j].text || "");
        } else {
          break;
        }
        j++;
      }

      combinedCommands.push({
        ...messages[i],
        text: combinedText,
      });
      i = j - 1;
    }
  }

  return combinedCommands;
}
