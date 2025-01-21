import { Instrument } from "../types/instrument";
import { TopicService } from "../services/topic-service";

export class TopicGenerationInstrument implements Instrument {
  name = "topic-generation";
  description = "Generates potential book topics";
  private topicService: TopicService;

  constructor(topicService: TopicService) {
    this.topicService = topicService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Select") || task.includes("Research")) {
      const topic = await this.topicService.generateTopic();
      console.log(`Generated topic: ${topic}`);
    }
  }
}