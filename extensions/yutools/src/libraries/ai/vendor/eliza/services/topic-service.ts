export class TopicService {
  async generateTopic(): Promise<string> {
    // Placeholder logic: Generate a random topic
    const topics = [
      "Artificial Intelligence",
      "Space Exploration",
      "History of Ancient Civilizations",
      "Climate Change and Sustainability",
      "The Future of Work",
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }
}