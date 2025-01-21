import { StorageBackend } from "../backends/base-backend";
import { Agent } from "./agent";
import { Instrument } from "./instrument";
import { PerformerConfig } from "./performer";

export interface OrchestraConfig {
  storageBackend: StorageBackend; // Backend for memory storage
  instruments: Instrument[]; // Instruments available to the orchestra
  performers: PerformerConfig[]; // Performers in the orchestra
  agents?: Agent[];
}