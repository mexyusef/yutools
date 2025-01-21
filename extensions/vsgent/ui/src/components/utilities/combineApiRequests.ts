import { VsGentMessage } from "@shared/ExtensionMessage"

/**
 * Combines API request start and finish messages in an array of VsGentMessages.
 *
 * @param messages - An array of VsGentMessage objects to process.
 * @returns A new array of VsGentMessage objects with API requests combined.
 */
export function combineApiRequests(messages: VsGentMessage[]): VsGentMessage[] {
  const combinedApiRequests: VsGentMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].type === "say" && messages[i].say === "api_req_started") {
      let startedRequest = JSON.parse(messages[i].text || "{}");
      let j = i + 1;

      while (j < messages.length) {
        if (messages[j].type === "say" && messages[j].say === "api_req_finished") {
          let finishedRequest = JSON.parse(messages[j].text || "{}");
          let combinedRequest = { ...startedRequest, ...finishedRequest };

          combinedApiRequests.push({
            ...messages[i],
            text: JSON.stringify(combinedRequest),
          });

          i = j; // Skip to the api_req_finished message
          break;
        }
        j++;
      }

      if (j === messages.length) {
        // If no matching api_req_finished found, keep the original api_req_started
        combinedApiRequests.push(messages[i]);
      }
    }
  }

  // Replace original api_req_started and remove api_req_finished
  return messages
    .filter((msg) => !(msg.type === "say" && msg.say === "api_req_finished"))
    .map((msg) => {
      if (msg.type === "say" && msg.say === "api_req_started") {
        const combinedRequest = combinedApiRequests.find((req) => req.ts === msg.ts);
        return combinedRequest || msg;
      }
      return msg;
    });
}
