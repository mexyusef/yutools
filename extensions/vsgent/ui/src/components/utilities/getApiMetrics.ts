import { VsGentMessage } from "@shared/ExtensionMessage"

interface ApiMetrics {
	totalTokensIn: number
	totalTokensOut: number
	totalCost: number
}

/**
 * Calculates API metrics from an array of VsGentMessages.
 *
 * @param messages - An array of VsGentMessage objects to process.
 * @returns An object containing total tokens in, tokens out, and total cost.
 */
export function getApiMetrics(messages: VsGentMessage[]): ApiMetrics {
  let totalTokensIn = 0;
  let totalTokensOut = 0;
  let totalCost = 0;

  messages.forEach((message) => {
    if (message.type === "say" && message.say === "api_req_started") {
      const data = JSON.parse(message.text || "{}");
      totalTokensIn += data.tokensIn || 0;
      totalTokensOut += data.tokensOut || 0;
      totalCost += data.cost || 0;
    }
  });

  return {
    totalTokensIn,
    totalTokensOut,
    totalCost,
  };
}
