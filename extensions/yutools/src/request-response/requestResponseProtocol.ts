export type Message<TPayload = any> = {
    type: string;
    requestId?: string;
    payload?: TPayload;
};

type PendingRequest = {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
};

type PostMessageFunction = (message: Message) => void;
type AddMessageListenerFunction = (listener: (event: MessageEvent) => void) => void;

export class RequestResponseHandler {
    private pendingRequests = new Map<string, PendingRequest>();

    constructor(
        private postMessage: PostMessageFunction,
        private addMessageListener: AddMessageListenerFunction
    ) {
        // Attach listener for incoming messages
        this.addMessageListener(this.handleMessage.bind(this));
    }

    // Generate a unique request ID
    private generateRequestId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Send a request and return a promise for the response
    sendRequest<TPayload, TResponse>(type: string, payload: TPayload): Promise<TResponse> {
        return new Promise<TResponse>((resolve, reject) => {
            const requestId = this.generateRequestId();
            this.pendingRequests.set(requestId, { resolve, reject });

            // Send the request message
            this.postMessage({ type, requestId, payload });
        });
    }

    // Handle incoming messages
    private handleMessage(event: MessageEvent<Message>) {
        const { type, requestId, payload } = event.data;

        // If it's a response and matches a pending request, resolve the promise
        if (type === 'response' && requestId && this.pendingRequests.has(requestId)) {
            const { resolve } = this.pendingRequests.get(requestId)!;
            resolve(payload);
            this.pendingRequests.delete(requestId);
        }
    }

    // Handle server-side requests (optional utility method)
    handleServerRequest<TPayload, TResponse>(
        requestType: string,
        handlerFn: (payload: TPayload) => Promise<TResponse>,
        message: Message<TPayload>
    ) {
        const { requestId, payload } = message;
        if (message.type === requestType && requestId) {
            handlerFn(payload!)
                .then((response) => {
                    this.postMessage({ type: 'response', requestId, payload: response });
                })
                .catch((error) => {
                    this.postMessage({ type: 'response', requestId, payload: { error: error.message } });
                });
        }
    }
}
