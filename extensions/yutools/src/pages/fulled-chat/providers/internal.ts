import { local_llm_api } from '@/constants';
import {
	ApiConfig,
	LLMMessage,
	// OnText,
	SendLLMMessageFnTypeInternal,
	SendLLMMessageFn,
} from '../types';
import axios from 'axios';
// import { local_llm_api } from '../../constants';


export const sendQuickQuery: SendLLMMessageFnTypeInternal = ({ messages, onText, onFinalMessage, apiConfig }) => {

	let did_abort = false;
	let fullText = '';

	// if abort is called, onFinalMessage is NOT called, and no later onTexts are called either
	let abort: () => void = () => { did_abort = true };

	const userQuery = messages.map(m => m.content).join('\n');

	axios.post(local_llm_api, {
		prompt: userQuery
	})
		.then(response => {
			// when receive text
			if (did_abort) return;

			const newText = response.data.response || '';
			fullText += newText;

			onText(newText, fullText);


			if (!fullText.includes('```')) {
				fullText = `\`\`\`\n${fullText}\n\`\`\``;
			}

			// call onFinalMessage when the process is done
			onFinalMessage(fullText);
		})
		.catch(error => {
			console.error('Error in request to FastAPI:', JSON.stringify(error));
			// Call onFinalMessage with whatever fullText we have so far in case of an error
			onFinalMessage(fullText);
		});

	return { abort };
};
