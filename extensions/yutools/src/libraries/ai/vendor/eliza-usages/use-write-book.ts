import { Orchestra } from "../eliza/core/orchestra";
import { InMemoryBackend } from "../eliza/backends/in-memory";

import { TopicSelectionAgent } from "../eliza/agents/topic-selection";
import { ResearchAgent } from "../eliza/agents/research";
import { OutlineCreationAgent } from "../eliza/agents/outline-creation";
import { ContentWritingAgent } from "../eliza/agents/content-writing";
import { EditingAgent } from "../eliza/agents/editing";
import { DesignAgent } from "../eliza/agents/design";
import { PublishingAgent } from "../eliza/agents/publishing";

import { WebSearchInstrument } from "../eliza/instruments/web-search";
import { TopicGenerationInstrument } from "../eliza/instruments/topic-generation";
import { OutlineGenerationInstrument } from "../eliza/instruments/outline-generation";
import { ContentGenerationInstrument } from "../eliza/instruments/content-generation";
import { EditingInstrument } from "../eliza/instruments/editing";
import { DesignInstrument } from "../eliza/instruments/design";
import { PublishingInstrument } from "../eliza/instruments/publishing";
import { FileOperationsInstrument } from "../eliza/instruments/file-operations";

// Initialize instruments
const webSearchInstrument = new WebSearchInstrument();
const topicGenerationInstrument = new TopicGenerationInstrument();
const outlineGenerationInstrument = new OutlineGenerationInstrument();
const contentGenerationInstrument = new ContentGenerationInstrument();
const editingInstrument = new EditingInstrument();
const designInstrument = new DesignInstrument();
const publishingInstrument = new PublishingInstrument();
const fileOperationsInstrument = new FileOperationsInstrument();

// Initialize agents
const topicSelectionAgent = new TopicSelectionAgent({
  id: "topic-selector-1",
  goals: ["Select a book topic", "Research trending topics"],
  instruments: [webSearchInstrument, topicGenerationInstrument],
});

const researchAgent = new ResearchAgent({
  id: "researcher-1",
  goals: ["Gather research material", "Organize research data"],
  instruments: [webSearchInstrument, fileOperationsInstrument],
});

const outlineCreationAgent = new OutlineCreationAgent({
  id: "outline-creator-1",
  goals: ["Generate book outline", "Organize chapters and sections"],
  instruments: [outlineGenerationInstrument, fileOperationsInstrument],
});

const contentWritingAgent = new ContentWritingAgent({
  id: "content-writer-1",
  goals: ["Write chapter content", "Edit and refine content"],
  instruments: [contentGenerationInstrument, fileOperationsInstrument],
});

const editingAgent = new EditingAgent({
  id: "editor-1",
  goals: ["Edit book content", "Ensure consistency"],
  instruments: [editingInstrument, fileOperationsInstrument],
});

const designAgent = new DesignAgent({
  id: "designer-1",
  goals: ["Design book cover", "Format book layout"],
  instruments: [designInstrument, fileOperationsInstrument],
});

const publishingAgent = new PublishingAgent({
  id: "publisher-1",
  goals: ["Format book for publishing", "Publish book to platform"],
  instruments: [publishingInstrument, fileOperationsInstrument],
});

// Initialize the orchestra
const orchestra = new Orchestra({
  storageBackend: new InMemoryBackend(),
  instruments: [
    webSearchInstrument,
    topicGenerationInstrument,
    outlineGenerationInstrument,
    contentGenerationInstrument,
    editingInstrument,
    designInstrument,
    publishingInstrument,
    fileOperationsInstrument,
  ],
  agents: [
    topicSelectionAgent,
    researchAgent,
    outlineCreationAgent,
    contentWritingAgent,
    editingAgent,
    designAgent,
    publishingAgent,
  ],
});

// Set goals and run the orchestra
const goals = [
  "Select a book topic",
  "Gather research material",
  "Generate book outline",
  "Write chapter content",
  "Edit book content",
  "Design book cover",
  "Publish book to platform",
];
async function main() {
  await orchestra.run(goals);
}
// main();