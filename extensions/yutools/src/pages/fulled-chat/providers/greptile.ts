import {
	ApiConfig,
	LLMMessage,
	// OnText,
	SendLLMMessageFnTypeInternal,
	SendLLMMessageFn,
} from '../types';


// Greptile
// https://docs.greptile.com/api-reference/query
// https://docs.greptile.com/quickstart#sample-response-streamed

export const sendGreptileMsg: SendLLMMessageFnTypeInternal = ({ messages, onText, onFinalMessage, apiConfig }) => {

	let did_abort = false
	let fullText = ''

	// if abort is called, onFinalMessage is NOT called, and no later onTexts are called either
	let abort: () => void = () => { did_abort = true }


	fetch('https://api.greptile.com/v2/query', {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${apiConfig.greptile.apikey}`,
			"X-Github-Token": `${apiConfig.greptile.githubPAT}`,
			"Content-Type": `application/json`,
		},
		body: JSON.stringify({
			messages,
			stream: true,
			repositories: [apiConfig.greptile.repoinfo]
		}),
	})
		// this is {message}\n{message}\n{message}...\n
		.then(async response => {
			const text = await response.text()
			console.log('got greptile', text)
			return JSON.parse(`[${text.trim().split('\n').join(',')}]`)
		})
		// TODO make this actually stream, right now it just sends one message at the end
		.then(async responseArr => {
			if (did_abort)
				return

			for (let response of responseArr) {

				const type: string = response['type']
				const message = response['message']

				// when receive text
				if (type === 'message') {
					fullText += message
					onText(message, fullText)
				}
				else if (type === 'sources') {
					const { filepath, linestart, lineend } = message as { filepath: string, linestart: number | null, lineend: number | null }
					fullText += filepath
					onText(filepath, fullText)
				}
				// type: 'status' with an empty 'message' means last message
				else if (type === 'status') {
					if (!message) {
						onFinalMessage(fullText)
					}
				}
			}

		})
		.catch(e => {
			console.error('Error in Greptile stream:', e);
			onFinalMessage(fullText);

		});

	return { abort }
}
