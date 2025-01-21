import { Ollama } from 'ollama/browser';
import {
	ApiConfig,
	LLMMessage,
	// OnText,
	SendLLMMessageFnTypeInternal,
	SendLLMMessageFn,
} from '../types';

export const sendOllamaMsg: SendLLMMessageFnTypeInternal = ({ messages, onText, onFinalMessage, apiConfig }) => {

	let didAbort = false
	let fullText = ""

	// if abort is called, onFinalMessage is NOT called, and no later onTexts are called either
	let abort = () => {
		didAbort = true;
	};

	const ollama = new Ollama({ host: apiConfig.ollama.endpoint })

	ollama.chat({
		model: apiConfig.ollama.model,
		messages: messages,
		stream: true,
	})
		.then(async stream => {
			abort = () => {
				// ollama.abort()
				didAbort = true
			}
			// iterate through the stream
			try {
				for await (const chunk of stream) {
					if (didAbort) return;
					const newText = chunk.message.content;
					fullText += newText;
					onText(newText, fullText);
				}
				onFinalMessage(fullText);
			}
			// when error/fail
			catch (error) {
				console.error('Error:', error);
				onFinalMessage(fullText);
			}
		})
	return { abort };
};

