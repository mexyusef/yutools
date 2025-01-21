import { AssemblyAI, Transcript, LemurTaskResponse, LemurSummaryResponse, LemurQuestionAnswerResponse } from 'assemblyai';
import { assemblyaiSettings } from '../config';

class AssemblyAIClient {
  private static instance: AssemblyAIClient;
  private client: AssemblyAI;

  private constructor(apiKey: string) {
    this.client = new AssemblyAI({ apiKey });
  }

  // Public method to get the singleton instance
  public static getInstance(): AssemblyAIClient {
    if (!AssemblyAIClient.instance) {
      AssemblyAIClient.instance = new AssemblyAIClient(assemblyaiSettings.getNextProvider().key);
    }
    return AssemblyAIClient.instance;
  }

  // Transcription methods
  async transcribeAudio(audioUrl: string, options: any = {}): Promise<Transcript> {
    const params = { audio: audioUrl, ...options };
    return await this.client.transcripts.transcribe(params);
  }

  async getSubtitles(transcriptId: string, format: 'srt' | 'vtt', charsPerCaption?: number): Promise<string> {
    return await this.client.transcripts.subtitles(transcriptId, format, charsPerCaption);
  }

  async getSentences(transcriptId: string): Promise<any> {
    return await this.client.transcripts.sentences(transcriptId);
  }

  async getParagraphs(transcriptId: string): Promise<any> {
    return await this.client.transcripts.paragraphs(transcriptId);
  }

  async searchWords(transcriptId: string, words: string[]): Promise<any> {
    return await this.client.transcripts.wordSearch(transcriptId, words);
  }

  // LeMUR methods
  async summarizeTranscript(transcriptId: string, context: string, answerFormat: string = 'TLDR'): Promise<LemurSummaryResponse> {
    return await this.client.lemur.summary({
      transcript_ids: [transcriptId],
      context,
      answer_format: answerFormat,
    });
  }

  async askQuestion(transcriptId: string, question: string, context?: string): Promise<LemurTaskResponse> {
    return await this.client.lemur.task({
      transcript_ids: [transcriptId],
      prompt: question,
      context,
      final_model: 'anthropic/claude-3-5-sonnet',
    });
  }

  async answerQuestions(transcriptId: string, questions: Array<{ question: string; context?: string; answer_format?: string }>): Promise<LemurQuestionAnswerResponse> {
    return await this.client.lemur.questionAnswer({
      transcript_ids: [transcriptId],
      questions,
      final_model: 'anthropic/claude-3-5-sonnet',
    });
  }
}

export { AssemblyAIClient };
