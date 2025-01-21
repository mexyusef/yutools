import Anthropic from '@anthropic-ai/sdk';
import {
	ApiConfig,
	LLMMessage,
	SendLLMMessageFnTypeInternal,
	SendLLMMessageFn,
} from '../types';

export const sendAnthropicMsg: SendLLMMessageFnTypeInternal = ({ messages, onText, onFinalMessage, apiConfig }) => {

	// defaults to process.env["ANTHROPIC_API_KEY"]
	const anthropic = new Anthropic({ apiKey: apiConfig.anthropic.apikey, dangerouslyAllowBrowser: true });

	const stream = anthropic.messages.stream({
		model: "claude-3-5-sonnet-20240620",
		max_tokens: 1024,
		messages: messages,
	});

	let did_abort = false

	// when receive text
	stream.on('text', (newText, fullText) => {
		if (did_abort) return
		onText(newText, fullText)
	})

	// when we get the final message on this stream (or when error/fail)
	stream.on('finalMessage', (claude_response) => {
		if (did_abort) return
		// stringify the response's content
		let content = claude_response.content.map(c => { if (c.type === 'text') { return c.text } }).join('\n');
		onFinalMessage(content)
	})


	// if abort is called, onFinalMessage is NOT called, and no later onTexts are called either
	const abort = () => {
		// stream.abort() // this doesnt appear to do anything, but it should try to stop claude from generating anymore
		did_abort = true
	}

	return { abort }

};
