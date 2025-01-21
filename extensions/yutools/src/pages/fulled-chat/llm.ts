import { sendAnthropicMsg } from './providers/anthropic';
import { sendOpenAIMsg } from './providers/openai';
import { sendGreptileMsg } from './providers/greptile';
import { sendOllamaMsg } from './providers/ollama';
import { sendQuickQuery } from './providers/internal';
import { SendLLMMessageFnTypeExternal } from './types';

export const sendLLMMessage: SendLLMMessageFnTypeExternal = ({ messages, onText, onFinalMessage, apiConfig }) => {
    if (!apiConfig) return { abort: () => { } }

    const whichApi = apiConfig.whichApi

    if (whichApi === 'anthropic') {
        return sendAnthropicMsg({ messages, onText, onFinalMessage, apiConfig })
    }
    else if (whichApi === 'openai') {
        return sendOpenAIMsg({ messages, onText, onFinalMessage, apiConfig })
    }
    else if (whichApi === 'greptile') {
        return sendGreptileMsg({ messages, onText, onFinalMessage, apiConfig })
    }
    else if (whichApi === 'ollama') {
        return sendOllamaMsg({ messages, onText, onFinalMessage, apiConfig });
    }
    else if (whichApi === 'internal') {
        return sendQuickQuery({ messages, onText, onFinalMessage, apiConfig })
    }
    else {
        console.error(`Error: whichApi was ${whichApi}, which is not recognized. Defaulting to internal server.`)
        return sendQuickQuery({ messages, onText, onFinalMessage, apiConfig })
    }

}
