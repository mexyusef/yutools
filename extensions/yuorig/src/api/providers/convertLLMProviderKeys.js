const fs = require('fs');

export const XAI_API_KEYS = [
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key01", key: "xai-3iklb2jTF1boFv3GNVuObGrfclNgkIGIA8YhCT7y8phDbRzPPaEOgC9KzAhweF1IBRIXpbCJIEqKZsJt" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key02", key: "xai-uTiwW1zqm0gr9S5iXf6hrBJ6AEB9RAMqlbRXsaN0a98ijV9qzm3MHdpkSRKVNLHj32HUbDydBUUSEQ53" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key03", key: "xai-IsbXLOzxxUq8zRSpBcyTDJSW7JIHaqkQNANqKq0UG384u27i523ycYoG3pGEn3BxjsaRK9Hdp4FbkSeW" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key04", key: "xai-c9swqLyFT47htec39ZzncwOFlIDqGlULGUtqlkfibqBBetnl3Ub3Z0YsqvW5S82qOwGNQC9B27oqPxJk" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key05", key: "xai-u7w6QS9SjpN5BH2yaIUDKnjbBBsczSzWd2UTaHz3AIDe4tW45MGV5liFT9Ew7XHeGopITarpfKk8eWLK" },


	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key06", key: "xai-eh1EkTzpMol0IdgcNtvd9ON2zeQUscwytgYwaOuMocJ7z1QRjFqR1veLsP4qtNawPcGzDIpunCqUsWqo" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key07", key: "xai-paYsSMzAEvXInrxlaLx19FVNa7tMGMOJQVHyC5lv2HC5UDZ4X4I0XvXUmGdZZByzvIFGTLe94dddo1nD" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key08", key: "xai-bAgpk7JkLjnHQJ64D7vaijBJjV5Ymzg3DtuKuG41vIJibCMjERspribQKAjxQi9KrFaem8VShlNQaaFK" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key09", key: "xai-fjdXUgeLc6ZmjFFX9MHIpKUPbbDZnIz0z5BpnOMM5JaFz7GEgv2igvT5VywNt9DIWPSwdp28L0xe09Dv" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key10", key: "xai-zJJ5IcUttYNMklM27OahKV0le263yMI7rLo9F4IWOE4X89AhB7oMyD7clBabAoUxPx4VnIBCKnhzPxlt" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key11", key: "xai-lplNS7Er0ZucjKUy6Yf3SJRZosBqgwprQeSfteLZWXa9IqvnxXBb22f72ityu3dxXwoP0AVm1rdGvijO" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key12", key: "xai-zt4aJK5D7J7Wbze9fIgTDz7eqAnZJOYCudEHAhRlrU088YqHPlgnBIzl1OBGCkQGbh8Q7u4iMeTAW9hs" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key13", key: "xai-LPiZYzk2LxonYLkC03JN72K2HQEIHHw1bxfGNQh15Ljpii4MROPdwBdS4zuWazWmqdfuOY5a4G8O3zLq" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key14", key: "xai-nTOsVlbHCm1tXmgaS1Www8AeV7h0oenYvoOsUFheIbZxoj2mJ9OqGNcOCWaDQxCiEuxCvmIPpd4CywLz" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key15", key: "xai-mYYCu6X7JKtrNHqLA1fAE5ZiR75FAsa1lTtONwb4l2D8bfjyqO9YJuPPyeSrmxGfQfwgjoXZ7Z25fTxX" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key16", key: "xai-WKSRhE7O84MdTmUvOi9Qm0NEWFhFR8DlKI6K5POxWBy5jAyC5ZZkV0l3WBnRkFl2baZZzSrT3fwUQWKN" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key17", key: "xai-QruyHm4KhzYqMnSkbBOgvs5ZdFJmuZMvivmpBShoarCRfXvVeTJzM3Zx9XTJceFig7kpn8ZvBFTjSSPP" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key18", key: "xai-Pxd4bhP6EArl7h0vllcU48Qhr33prweA7AxVh5EKSX7sJm9C7SA3K6nskQkCvXX0DHgNGRpFkfMew8wj" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key19", key: "xai-zRZCmRmHI6v6Z6GQeE2NIjtmANNn8Lcbw92h785q0ECetuSCWp6Zvi3t4AFoW4wj8vQjkLWCl1oAkGMN" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key20", key: "xai-jegz88XkJk1d51sdK1j7u6wrqFswi4G63RAb9mSV4V0xBYeGMH7kFMT9IQ5lDUTDKwlxu4jvApv7BvQG" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key21", key: "xai-5vMebX9pqc8guslVZlrtUumTeFfqjvBBzaIwW0LZYLMsipWWOh59YFwtvTGj4iOnke3PLtUTSMhb0mnN" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key22", key: "xai-ssrkmuPyZ6OTtY9VgQIiyWfCnNK4tGVgRBYSIjce5jX2QTdBN25wfmdEpy6uJshdKFRX3YrrSLdwVPd7" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key23", key: "xai-yTHIItH9oEsVfHh2tzCNRddf4JlNqqPjRAyieUZwdqEuNaDrj6E5nKxiPkX3y5UjERvioOgN1oFhJRKb" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key24", key: "xai-t8v3zhbPNZ0O3mE9WAiIizDmMJOohNGGIIiZJt4x8bXqbOfd8mqzQ7TqfTJi1AIxRtfvs17ZMuJDLl9w" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key25", key: "xai-LUNMyFy3VzB91NyLirmhC40raYAgSEkmB1e4W06tP9cqu9FdHspAGLowmghBgSY9XyeoKFbvZnBN39A7" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key26", key: "xai-QPbcQZA7YvQz2lcTdcFIoKdbDj1P2IOnu5KrDDI2WvQeUpnG51rjj13E3wzKjUNMb8pXFFz2YCS23P7q" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key27", key: "xai-ceWfUuOsw7bUUlop88yM0KOSK3bVpbtPpEpX7LFWQEnoCVzf8NcsIvvQA8YRthUtpASt9g5WsKAaQRVE" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key28", key: "xai-zmZycMIy7I1UJdbHPSFJNNvYH7Xp3ptIcXIYk6UhvNcsRmgow7fNrI2abqtri1WLyduISpTLOrjwEqwD" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key29", key: "xai-hPGRGdGNaDJAkWZGsyenlMXemO4b4uFs5DRP6jry9ohs9DKz2auQN2b86NYmG8AdEoqeipeVtuMooGHd" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key30", key: "xai-03eOsivIwP0oAvLZrzSDx9WsMsBaXV3CBYoqpp44qrDLVzCTzX7RJNwoUvsuBphBe27nx3d2YhtgZQoZ" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key31", key: "xai-FXrNmIMkw5f813MAOYDGSCjH7xNJWd1FdcsmpDbIq4oqYHVgpVAzPKtwH76xQ494smLqeh4KL7R25gQ2" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key32", key: "xai-8CtMaeofZZ5npbbg9ZfZVFU2u5nJpOuf11WD0xSHZquOlKmU12FhwRQDYjcAwlJum08cIHjN6kZThQG5" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key33", key: "xai-YrWHXTjXPOJZtyoCPUzDezGzuGWKArGg4zR3eM07z0VJ7WJk0rWRZxH7owYE37oCFfw7XVp0YP3sUUzn" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key34", key: "xai-5KgZjN3vLsDgq0xElbL1PgKIrrZ5t3dLnKe3ZoWQWNGzEKznBabWBFL8JP8uM8vQeFNXP6cz9VbqHWmM" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key35", key: "xai-SJDyR4njdzMmia3A0exWBAcpVOYnQh5hBQ2iaeFe1XBFMlMfMhL36qjT04P22ejXKdQqVTMJwmFit4v6" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key36", key: "xai-hC0oYqFnDO5PnIX0ROd6QxedzgQ53JF5OkiOiXXmPVohQQA2G7jrIb5qGfBNnQ8EjZFwWXIXEw8As21Y" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key37", key: "xai-lbXC1mn7a6srxkiojBpIk7lVB7lnIdEhd4zd5BZqc8AU66CpWXJjhCrZcsUg1YfHorSKJaoGDQJY0KuB" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key38", key: "xai-j7PTOGGXlAVirvZJKnUA6crL4pEcralyb4uVrzPlHCXM4hB2raz7jYPbDFN5FRpF835DbgHnwoap7DTG" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key39", key: "xai-U2zOG5Y94G1wDx75cTNYJEhAay61pdtHB1LrfydiTcRjos2bUCdIiqJwpnFpyyPdSa7gVxSJmyrHHdoj" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key40", key: "xai-SfS6GDoqAWiq6ubI3kt3e9KGnAwTq7jXQKPPJvDTDx53LywJyzuV4jq3uUSNYiPOBk68z5jAY9dVS5kE" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key41", key: "xai-JKCzefV5boHuDA5e8W0tcgHH6GEGTF0Ndx9KL1y0dgT7SYPDBaAXBPvxbp2oa3LkMCKvsVHGCv5OZc64" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key42", key: "xai-yZhcS7yuhpA4ACDkokXl9nU54NyUvW3giucacdKx0RQEFQTS5AfwBmV2Ic6Adf4hbPmJ0ioK8v4o2M77" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key43", key: "xai-niB6ouOabOxA42GDmkR1Wk2fDfYa46YLNmTXg2cdbCJWxTxXXRwzJCEFB5z2cRUbif3C8YAs6Zayc3ji" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key44", key: "xai-UZmPthx0YWvicPZAIyFzLv8w2ob6V2zR9xGhc2RviFB68dK9TD1eGGoCFhMUBtoRJ5XgaSb0N7BK1pEB" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key45", key: "xai-nJQnGodkuCSJG7Oi2UTchY0L9cvpW6hZOTJqH7lYQJHfeNz2TTyDy4NCKleQrN4dnwwxvhCBqKxUhhuC" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key46", key: "xai-CNGgm6m9zsZAXGTcUvEt2WdGY6A1Qb6g99usDiowO8PwrbD6ur1gCJyXRlwFcC7TLxAI4TF7LZ5ETmMj" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key47", key: "xai-TxtSCcXYxI4WtsvEUL7CGfDavYMM8eOveaoJ2OFKRh7YXHKk7iiWndB1RgcsrkvFdZlSmWGqoaZmNhGM" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key48", key: "xai-fwFVAMyG4qMZf3AptnALVy8p1Z45dgOeR5fZAB8CB1WxdEIVEK6RGndNmyvWVQkZtogBYR2zSnU7zzvR" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key49", key: "xai-lPtYBF8mAnXQva3hfOjDIN1I5Rz6uJL8xCx7fdxwle5NDFaS7ZR9k76yg9cOmNMCjZn5AcpELPaEmvzq" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key50", key: "xai-YCIE9MI2VBZW3SjaOzczPT7eJduIYXJNKfcSpdlkB2rw4euZPvDAPPGi9guJSpBjCbSvbBBjYjGiQ8s6" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key51", key: "xai-FSqI9Gs8QAkwRDig8YLbPIF1coxmiCFyyVZ8ZqG5RBxSMX3a40NUHfsDG28FR6dq6Lt5waQiEJ3WCVuc" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key52", key: "xai-im26vwqxAQKwmJWjgZcHDz4BNqR6eXrp2IFidb6QW8u0mkJ6Oey8I0Db8Xy9gG1vsXWH8KXGGtRDK1Xy" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key53", key: "xai-3QGLprorIOMNxAskz3yVLvguYCVAihotR6fV7oDFlIwObSMmrmNynrspHmvR9hDQQNqPf4GBKWj7RhTf" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key54", key: "xai-xZw2vl42UdGmXJuWLxjkN34aeUWb2YbdLCteDQe4ubU9I5GDCZAg4pDv6yxhxYfaji06wdvIK0dzFRHv" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key55", key: "xai-bP1dYXjYG6NPTqa2dceHVuyzE2Y1cqaIOK9oVXsAnH6w0TmRCeSQ9zUjSI2UVBNGZzQyqzzPK8S7X2fU" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key56", key: "xai-hearW7XDsdWwZee60MttS6zccip3gFZyX1AJQswXysLcAfWoCk78UT9Cax1a43dKfdH2Fw31ZKgmQ6yc" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key57", key: "xai-qxMdkWLt89Ua392FLB6lY9BP6a5ZVFlzBmb4Kd6P5jkkdVPs4NguQ5lP4HWavE6TnFgD46zqGTGCPhuM" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key58", key: "xai-uFxwGY2iFksUOboYK1JfxsLxlw1wTdvNLb7KI8GLZ5jzLh9JeSRofeiM3nbySCAC2qUP12JuXzPo4N1n" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key59", key: "xai-cXJJqQLiKwLpYFfetn9YYDodgHJdOF5hWaXJhdoKcaSOvcjDiQaxLt5h1fXwNlwcjqks7pe5MSc7rESC" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key60", key: "xai-y5or5L5Q0uicg3Az6Tvo2vRFG014ehLtArXi7LEWSLaXkoMMtG43bmhGCtrsGrMEiDBEIUhHyyoL1Q4n" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key61", key: "xai-LQNasz0PGY87zPAJKcdnPlwzmdPpmYBBvzXEzhXvt6iu889vZrPJVHygqLf6xw2uuUulQOvyIC018mUI" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key62", key: "xai-YT5JbMxC7pO66PgyT26xPIgLgADNHskwHmVPlvKXHoTIngrDo5ySdvx4Fq3C113CwxPBmiVYyq4IN1Ub" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key63", key: "xai-cs3tdSLpPvXcxP2SYp2PQAqnsuFtdh2ifnVo3bTJY6cxYqDHt9GONpA4qReNQTk1ZSM8bKM6HHRIun2T" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key64", key: "xai-xJkNekqcnzacSktYe3HKct6KUG6BpM5yciS6YwycmpNo84smR57zxLIJUkWgZRv4b9k7wYLovOKG9coI" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key65", key: "xai-09CogkSPgfPsFNITgTujFhyLOGPFVI2LxQY2s47oYI62XjePxWZUueDDH2PTNvAdmXV4ywjVKlVfFat6" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key66", key: "xai-LmwhAYy3ghxm1w3G3YvaQjUI46LKb9aLohLze1FMsOGaPO7ZPcv5mkpexCOrlGNUqCF1CLv2bJNIT5f9" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key67", key: "xai-szloXpBXsOZ6jUAUlGt0Ql72hgRU2Q8Kaqj94MIBgV91O2Ot3vdSF2YPfQHW4BefgkxRFHdOfDj0bOiz" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key68", key: "xai-TqVyKo95PFBSGekrDfIF67DtIXuZGm4HfUL5dTYyatbP24I7ZbBedNBZbSdZTciNj6V5zQV8QL3STNhh" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key69", key: "xai-8qmNuk40zCUiCDsu1nWXZ85HQlyyHn7cjKCWjt9OTMklVYMIqFWseFCWeb5ntzzxYeSYlsPkzK60JMlx" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key70", key: "xai-BK3549NdXsc11eEueYrO7OrhdRm0Gk75gxkoZ15e1woqtXVGcxUOCeAmwxoQ5yLt7mvmkzhIWfPB8eAy" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key71", key: "xai-zdaipmIBzilXyqL5ookksMrxe0g7mpdUV6zvhoJkcThQlIds9n7g5WOkVrv8BSZgfWAIVhKm6a16dgfW" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key72", key: "xai-EEzBajm9Iy6Np31KOnTkAXGRTqtXTwXBEx9NUZxh2xe10ISJvzpiJGG9jHyIEAVPwMaqPujQgn9qduvu" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key73", key: "xai-4QB9o42rEtkUALXGuXyN2et492K4PK4dg4ad6tHqYNZ2g2TF5ygzcOS4wobsnQUxSOQlS9F1x0l0u8vt" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key74", key: "xai-r5C8Bxid0HlowgqWbWkzhn9oBjT9wHuIb8aE39zVqKgKzcxYYxOQBtByoZN8TJXy9Zc6PDTDPHk7sUuM" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key75", key: "xai-14CPLBxyBLhEcI7KqgS2rVUh1zmQYXye4rSqXyVEKo2b5aLeemAXCIJUMrgWhpPPSsyCpzt4XHpA1Gsa" },

	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key76", key: "xai-i0CrRI5xj5MweLQajnvDVDyilLbt5hJwFzBRxOyEtk9HooLxEBXu9Jq7CHKujLiDoJ2RuVojLeZd1r6f" },
	{ settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 }, baseUrl: "https://api.x.ai/v1", model: "grok-beta", uses: 0, name: "key77", key: "xai-gLbHUuEHiavEGgvMaHESYdL4kdRI3odbYzTCyQ2TQb5uxxSnv9Bru27DVgZC4mK0aeKor2YLUw2pHSdW" },
	{ 
		settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
		baseUrl: "https://api.x.ai/v1",
		model: "grok-beta",
		uses: 0,
		name: "key78",
		key: "xai-ex5COSSwopBex2sdn3IJKjlFRJ1SP8LDV1lsLyaEmDP6WYl9cZNksc6as5hK0aMbwx2tYpwUxtswBMuy" },

	// raymond
	{
		name: "key79",
		key: "xai-luN2NnrKwjc8i7KEvbdmg5LX6nJr9F4vfngjzGtY6RPKFFXbY5NZErLaIOSlNqGNgCDXNfoVpI4iCidx",
		uses: 0,
		settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
		baseUrl: "",
		model: "",
	},
	{
		name: "key80",
		key: "xai-qnYH6VO6qjGh9041389JYZc5necRrz8oVz2dWmswpMRln9CCFKIfjukZaCCE04rxwTFkSz7MzPGvEAxH",
		uses: 0,
		settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
		baseUrl: "",
		model: "",
	},

];

export const SAMBANOVA_API_KEYS = [
	{ name: "lara/main", key: "a5e7f493-6283-4671-b71e-4a61afae9660" },
	{ name: "lara/s1", key: "a9039cee-9c35-4d1d-a3e3-f37ecd66472e" },
	{ name: "ukseiya/s1", key: "a0522040-f9f2-4a28-9c1d-f7a90fa9c6bb" },
	{ name: "uneh/s1", key: "f064c754-77a5-45bf-bf16-b6f1b664eb9d" },
	{ name: "yusef314/s1", key: "5cec0a50-342e-4029-87c4-b282dab9eb28" },

	{ name: "hayya/s1", key: "2dbd4a14-4e98-48a4-976d-637d26a16497" },
	{ name: "binsar/s1", key: "f3a38d67-1c1a-44d9-99cf-efb67fa66f31" },
	{ name: "elon/s1", key: "181c2570-77e3-4990-807e-8e1986f3ca5c" },
	{ name: "sodara/s1", key: "6df48e07-2cec-4482-8e15-81b9af42b720" },
	{ name: "ktg/s1", key: "a31cf738-aea0-4196-9c1c-cbfadebf37a5" },

	{ name: "seniorita/s1", key: "8411588b-30bf-4e06-ae63-f51d8b80cc52" },
	{ name: "midori/s1", key: "8231e4a4-3b7e-4e2b-876a-23e0c16b7a9e" },
	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },

	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },
];

export const HYPERBOLIC_API_KEYS = [
	{ name: "jyw/main", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW4ueW9zZWYud2lqYXlhQGdtYWlsLmNvbSIsImlhdCI6MTcyNzUzMjA4M30.8osyCfqG3oQOhNGdWicGkIV839uTOTUJeKnWdjGuZpU" },
	{ name: "lara/main", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsYXJhLnZhbmxvb2tlcmVuY2FtcGFnbmVAZ21haWwuY29tIiwiaWF0IjoxNzI3NTU3NDk0fQ.kx4pQl-H0gnzg5nDC3DaqUbrSbIFkR7A2RLFr0ZjkT8" },
	{ name: "yusef314/main", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5dXNlZjMxNDE1OUBnbWFpbC5jb20iLCJpYXQiOjE3Mjc1MzE5OTB9.bC___8sp1pMQb27pyylVdp0_ZPaiSMtFyNnkQUzHcSM" },
	{ name: "lara/s1", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaW1wbGVsb2dpbi1uZXdzbGV0dGVyLnByb3dsZXIyODVAc2ltcGxlbG9naW4uY29tIiwiaWF0IjoxNzI3NjEwODA2fQ.LBwNZ5dh-36zhdlTw8nbPi8Y2k1n0-nRoo7AAps8amc" },
	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },
];

export const GOOGLE_GEMINI_API_KEYS = [
	{ name: "key01", key: "AIzaSyDjL-0QgKN2LeAwOYgmD4ORcQG0yH3gpok" },
	{ name: "key02", key: "AIzaSyDCVsEwhj9RpDPTcn3zI1NFycribnzIygY" },
	{ name: "key03", key: "AIzaSyDb1YXFjwVGOX5tiFEdoOvDDhF1ECT54SI" },
	{ name: "key04", key: "AIzaSyC-UiDx2JvnFK8aqAhScL3VqEQRBIwyQjM" },
	{ name: "key05", key: "AIzaSyBaMLsHofeqsLkblL56sDzpPKmcjymHVDs" },

	{ name: "key06", key: "AIzaSyAck0OqoRc4MXUC41UbV14i-gpEAbL1X7s" },
	{ name: "key07", key: "AIzaSyBaGn8XIpUthf6nNQMem_p70Sk_9OrH_sM" },
	{ name: "key08", key: "AIzaSyAWjS4DUsTwIfWdyqJ2iQWf5-0BkCKnmQc" },
	{ name: "key09", key: "AIzaSyBIygaHTMN4VnylhqjPbiU3ubnp3canI5c" },
	{ name: "key10", key: "AIzaSyAv9pKSnslm-RUorzj1PWoFV8K75LQQHPk" },

	{ name: "key11", key: "AIzaSyBBueBc8uh9ajTkfrFu9_aYOu8heQWvmWI" },
	{ name: "key12", key: "AIzaSyBZzQFngndj1eBMdE7qv5iVgNYwjPrw2fY" },
	{ name: "key13", key: "AIzaSyCIrNAuvxTK4iENvILXb3G2GAnsXGx924s" },
	{ name: "key14", key: "AIzaSyBl0cVqrmpAB8cbc5kE0CWHzuGZIC0zoB4" },
	{ name: "key15", key: "AIzaSyCXP0Zk1imEdUekwOxjRy7X-hcO1oZAJDE" },

	{ name: "key16", key: "AIzaSyAq1473PS9gIlneriLbXCkEfkoitj8t8LY" },
	{ name: "key17", key: "AIzaSyDEqTF2dl6RzPa8omU-d697VKZGPsXR9cU" },
	{ name: "key18", key: "AIzaSyDU7CsW3nGzAh2qC_VB5lssuOm_HYGnLA8" },
	{ name: "key19", key: "AIzaSyAY4k2xZFyg9c9AsX41OK0GqxRHcKRabP8" },
	{ name: "key20", key: "AIzaSyDPHH0UuN4sSlmuphoeC_xk3fYmfcX0bIU" },

	{ name: "key21", key: "AIzaSyAvuoX70CBwC4Up2SecFUib-mkyv-lURBI" },
	{ name: "key22", key: "AIzaSyAAoN57dmMxJZ8Aq3BGBQJs35pillUhre8" },
	{ name: "key23", key: "AIzaSyB7ZxRpDf87z0SuKvkgszxXfbyE1VITt0k" },
	{ name: "key24", key: "AIzaSyBKNv0XeUDMYYNrpNTqR4wvljq8wdf2_V8" },
	{ name: "key25", key: "AIzaSyDlYwhUWqzOYiLAsh-JS9UUTnJ4H7uhBrU" },

	{ name: "key26", key: "AIzaSyDST2oAQK3r5fQduuhm0YUVd4bXbGsS4nU" },
	{ name: "key27", key: "AIzaSyBQU_kVbEF4wq6NhQ8q24aME0FIbI39iwI" },
	{ name: "key28", key: "AIzaSyA-sHWvlua5NcygMewyJIFvb5MCOjf-AMU" },
	// { name: "key01", key: "kunci" },
	// { name: "key01", key: "kunci" },
];

function generateXaiKeys() {
	const jsonContent = JSON.stringify(XAI_API_KEYS, null, 2);
	fs.writeFileSync('XAI_API_KEYS.json', jsonContent, 'utf8');
	console.log('XAI_API_KEYS have been converted to JSON and saved as XAI_API_KEYS.json');
}

function generateGemini() {
	const jsonContent = JSON.stringify(GOOGLE_GEMINI_API_KEYS, null, 2);
	fs.writeFileSync('GOOGLE_GEMINI_API_KEYS.json', jsonContent, 'utf8');
	console.log('GOOGLE_GEMINI_API_KEYS have been converted to JSON and saved as GOOGLE_GEMINI_API_KEYS.json');
}

function generateHyperbolic() {
	const jsonContent = JSON.stringify(HYPERBOLIC_API_KEYS, null, 2);
	fs.writeFileSync('HYPERBOLIC_API_KEYS.json', jsonContent, 'utf8');
	console.log('HYPERBOLIC_API_KEYS have been converted to JSON and saved as HYPERBOLIC_API_KEYS.json');
}

function generateSambanova() {
	const jsonContent = JSON.stringify(SAMBANOVA_API_KEYS, null, 2);
	fs.writeFileSync('SAMBANOVA_API_KEYS.json', jsonContent, 'utf8');
	console.log('SAMBANOVA_API_KEYS have been converted to JSON and saved as SAMBANOVA_API_KEYS.json');
}

generateGemini();
console.log('Selesai...');
