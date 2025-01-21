import { Instrument, Action } from "../types";
import { ethers } from "ethers"; // Ensure ethers is installed
import { StorageBackend } from "../backends"; // Import StorageBackend

export const blockchainInstrument: Instrument = {
  name: "blockchain",
  description: "Interacts with blockchain networks",
  actions: [
    {
      name: "SEND_TRANSACTION",
      similes: ["SEND_ETH", "TRANSFER_FUNDS"],
      description: "Send a transaction on the blockchain",
      validate: async (message, state) => {
        return message.content?.transaction !== undefined;
      },
      handler: async (message, state) => {
        const { storageBackend } = state; // Access storageBackend from state
        const { transaction } = message.content;

        // Use ethers.JsonRpcProvider instead of ethers.providers.JsonRpcProvider
        const provider = new ethers.JsonRpcProvider(
          process.env.BLOCKCHAIN_RPC_URL!
        );
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

        const tx = await wallet.sendTransaction(transaction);
        await storageBackend.createMemory({
          id: crypto.randomUUID(),
          content: { text: `Transaction sent: ${tx.hash}` },
          userId: message.userId,
          roomId: message.roomId,
          createdAt: new Date(),
        });
      },
    },
  ],
};