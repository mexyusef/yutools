import OpenAI from 'openai';
import {
	ApiConfig,
	LLMMessage,
	// OnText,
	SendLLMMessageFnTypeInternal,
	SendLLMMessageFn,
} from '../types';

export const sendOpenAIMsg: SendLLMMessageFnTypeInternal = ({ messages, onText, onFinalMessage, apiConfig }) => {

	let did_abort = false
	let fullText = ''

	// if abort is called, onFinalMessage is NOT called, and no later onTexts are called either
	let abort: () => void = () => { did_abort = true }

	const openai = new OpenAI({ apiKey: apiConfig.openai.apikey, dangerouslyAllowBrowser: true });

	openai.chat.completions.create({
		model: 'gpt-4o-2024-08-06',
		messages: messages,
		stream: true,
	})
		.then(async response => {
			abort = () => {
				// response.controller.abort() // this isn't needed now, to keep consistency with claude will leave it commented
				did_abort = true;
			}
			// when receive text
			try {
				for await (const chunk of response) {
					if (did_abort) return;
					const newText = chunk.choices[0]?.delta?.content || '';
					fullText += newText;
					onText(newText, fullText);
				}
				onFinalMessage(fullText);
			}
			// when error/fail
			catch (error) {
				console.error('Error in OpenAI stream:', error);
				onFinalMessage(fullText);
			}
			// when we get the final message on this stream
			onFinalMessage(fullText)
		})
	return { abort };
};
