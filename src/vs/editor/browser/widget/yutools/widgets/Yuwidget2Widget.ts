/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ContentWidgetPositionPreference, IContentWidget } from '../../../../../editor/browser/editorBrowser.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { createCSSRule } from '../../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import {
	EditorInfoProvider,
	// hidden_prompt_prefix,
	// hidden_prompt_suffix,
} from '../editorInfoProvider.js';
import { getRGBA, getThemeColor, registerWidgetTheme } from '../utils/themeUtils.js';
import { widgetThemeMap } from '../utils/widgetThemeMap.js';

export class Yuwidget2Widget extends Disposable implements IContentWidget {
	private static readonly ID = 'editor.widget.Yuwidget2Widget';

	private domNode: HTMLElement;
	// private containerElement!: HTMLDivElement;
	private comboboxElement!: HTMLSelectElement;
	private buttonElement!: HTMLButtonElement;
	private editor: ICodeEditor;
	private isVisible: boolean = false;
	// private theme: string;
	private backgroundText: string;
	// private user_defined_id: string;
	private editorInfoProvider: EditorInfoProvider;

	constructor(
		editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		// @ICommandService private readonly commandService: ICommandService,
	) {
		super();
		// this.theme = 'lime';
		this.backgroundText = 'Websites';
		registerWidgetTheme(Yuwidget2Widget.ID, 'lime');
		this.editor = editor;
		this.editorInfoProvider = this.instantiationService.createInstance(EditorInfoProvider);
		this.createStyles();
		this.domNode = document.createElement('div');
		this.domNode.className = 'combobox-git-widget futuristic-container';
		this.createInput();
		this.editor.addContentWidget(this);
		this.hide();
	}

	private createStyles(): void {
		const themeColor = getThemeColor(widgetThemeMap[Yuwidget2Widget.ID]);

		createCSSRule(`.combobox-git-widget`, `
			position: relative;
			width: 400px;
			height: 50px;
			background-color: #000;
			resize: both;
			overflow: hidden;
		`);

		createCSSRule(`.combobox-git-widget .input-container`, `
			display: flex;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 10px;
			box-sizing: border-box;
		`);

		createCSSRule(`.combobox-git-widget .futuristic-combobox`, `
			flex-grow: 1;
			background-color: ${getRGBA(themeColor, 0.1)};
			color: ${themeColor};
			font-size: 12px;
			border: none;
			border-radius: 5px 0 0 5px;
			outline: none;
			transition: all 0.3s ease;
		`);

		// Firefox specific styles
		createCSSRule(`.combobox-git-widget .futuristic-combobox`, `
			scrollbar-width: thin;
			scrollbar-color: ${getRGBA(themeColor, 0.5)} ${getRGBA(themeColor, 0.1)};
		`);

		createCSSRule(`.combobox-git-widget .futuristic-combobox option`, `
			background-color: ${getRGBA(themeColor, 0.1)};
			color: ${themeColor};
        `);

		// Webkit browsers (Chrome, Safari) specific styles
		createCSSRule(`.combobox-git-widget .futuristic-combobox::-webkit-scrollbar`, `
			width: 10px;
		`);

		createCSSRule(`.combobox-git-widget .futuristic-combobox::-webkit-scrollbar-track`, `
			background: ${getRGBA(themeColor, 0.1)};
		`);

		createCSSRule(`.combobox-git-widget .futuristic-combobox::-webkit-scrollbar-thumb`, `
			background-color: ${getRGBA(themeColor, 0.5)};
			border-radius: 20px;
			border: 3px solid ${getRGBA(themeColor, 0.1)};
		`);

		createCSSRule(`.combobox-git-widget button`, `
			padding: 5px 10px;
			background-color: ${getRGBA(themeColor, 0.3)};
			color: ${themeColor};
			border: none;
			border-radius: 0 5px 5px 0;
			cursor: pointer;
			transition: all 0.3s ease;
		`);

		createCSSRule(`.combobox-git-widget button:hover`, `
			background-color: ${getRGBA(themeColor, 0.5)};
		`);

		createCSSRule(`.combobox-git-widget .background-text`, `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 72px;
			font-weight: bold;
			color: ${getRGBA(themeColor, 0.1)};
			pointer-events: none;
			z-index: 1;
			user-select: none;
			white-space: nowrap;
		`);

		createCSSRule(`.combobox-git-widget .futuristic-border`, `
			position: absolute;
			top: -2px;
			left: -2px;
			right: -2px;
			bottom: -2px;
			/*border: 2px solid rgba(0, 255, 255, 0.5);*/
			/*border: 2px solid rgba(0, 128, 255, 0.5);*/
			border: 2px solid ${getRGBA(themeColor, 0.5)};
			border-radius: 7px;
			pointer-events: none;
			animation: borderGlow 2s infinite alternate;
		`);

		createCSSRule(`.combobox-git-widget .futuristic-glow`, `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			/*box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);*/
			/*box-shadow: 0 0 20px rgba(0, 128, 255, 0.3);*/
			box-shadow: 0 0 20px ${getRGBA(themeColor, 0.3)};
			border-radius: 5px;
			pointer-events: none;
			opacity: 0.5;
			filter: blur(10px);
			z-index: -1;
		`);

		createCSSRule(`@keyframes borderGlow`, `
			0% {
				/*box-shadow: 0 0 5px rgba(0, 255, 255, 0.5), inset 0 0 5px rgba(0, 255, 255, 0.5);*/
				/*box-shadow: 0 0 5px rgba(0, 128, 255, 0.5), inset 0 0 5px rgba(0, 128, 255, 0.5);*/
				box-shadow: 0 0 5px ${getRGBA(themeColor, 0.5)}, inset 0 0 5px ${getRGBA(themeColor, 0.5)};
			}
			100% {
				/*box-shadow: 0 0 20px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(0, 255, 255, 0.8);*/
				/*box-shadow: 0 0 20px rgba(0, 128, 255, 0.8), inset 0 0 10px rgba(0, 128, 255, 0.8);*/
				box-shadow: 0 0 20px ${getRGBA(themeColor, 0.8)}, inset 0 0 10px ${getRGBA(themeColor, 0.8)};
			}
		`);
	}

	private createInput(): void {
		const container = document.createElement('div');
		container.className = 'input-container';

		this.comboboxElement = document.createElement('select');
		this.comboboxElement.className = 'futuristic-combobox';
		this.comboboxElement.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' || event.keyCode === KeyCode.Escape) {
				this.kill();
			}
		});
		// Add some placeholder options
		const options = [
			'Create a funny story about Ning Nong, the girl in rural China.',
			'Create a blog post about Large Language Model.',
			'Create a blog post about latest AI tools for code assistants.'
		];
		options.forEach(optionText => {
			const option = document.createElement('option');
			option.value = optionText;
			option.textContent = optionText;
			this.comboboxElement.appendChild(option);
		});

		this.buttonElement = document.createElement('button');
		this.buttonElement.textContent = 'Process';
		this.buttonElement.addEventListener('click', () => this.processInput());

		this.comboboxElement.addEventListener('change', this.pulseEffect.bind(this));


		const backgroundTextElement = document.createElement('div');
		backgroundTextElement.className = 'background-text';
		backgroundTextElement.textContent = this.backgroundText;

		container.appendChild(this.comboboxElement);
		container.appendChild(this.buttonElement);
		container.appendChild(backgroundTextElement);

		const border = document.createElement('div');
		border.className = 'futuristic-border';
		const glow = document.createElement('div');
		glow.className = 'futuristic-glow';

		this.domNode.appendChild(container);
		this.domNode.appendChild(border);
		this.domNode.appendChild(glow);
		setInterval(this.updateGlow.bind(this), 100);
	}

	private processInput(): void {
		const selectedOption = this.comboboxElement.value;
		// this.defaultProcessInput(selectedOption);
		this.editorInfoProvider.sendToTerminal(selectedOption);
		this.hide();
		this.editor.focus();
	}

	// private getThemeColor(): string {
	// 	// const themeColors = {
	// 	const themeColors: { [key: string]: string } = {
	// 		pink: '#FF69B4',
	// 		yellow: '#FFD700',
	// 		orange: '#FFA500',
	// 		blue: '#0080FF',
	// 		magenta: '#FF00FF',
	// 		cyan: '#00FFFF',
	// 		red: '#FF0000',
	// 		white: '#FFFFFF',
	// 		green: '#00FF00', // Added green
	// 		purple: '#8A2BE2', // Added purple
	// 		teal: '#008080', // Added teal
	// 		lime: '#32CD32', // Added lime
	// 	};
	// 	return themeColors[this.theme] || themeColors.cyan;
	// }

	// private getRGBA(hex: string, alpha: number): string {
	// 	const r = parseInt(hex.slice(1, 3), 16);
	// 	const g = parseInt(hex.slice(3, 5), 16);
	// 	const b = parseInt(hex.slice(5, 7), 16);
	// 	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	// }


	private handleResize(): void {
		const widgetRect = this.domNode.getBoundingClientRect();
		// const textarea = this.inputElement;
		const container = this.domNode.querySelector('.input-container') as HTMLElement;
		const border = this.domNode.querySelector('.futuristic-border') as HTMLElement;
		const glow = this.domNode.querySelector('.futuristic-glow') as HTMLElement;

		// Update container size
		container.style.width = `${widgetRect.width}px`;
		container.style.height = `${widgetRect.height}px`;

		// Update combobox size
		this.comboboxElement.style.width = `${widgetRect.width - 80}px`; // Subtract button width
		this.comboboxElement.style.height = `${widgetRect.height - 20}px`; // Subtract some padding

		// Update button size
		this.buttonElement.style.height = `${widgetRect.height - 20}px`; // Match combobox height

		// Update border and glow
		border.style.width = `${widgetRect.width}px`;
		border.style.height = `${widgetRect.height}px`;
		glow.style.width = `${widgetRect.width}px`;
		glow.style.height = `${widgetRect.height}px`;
	}

	// public setTheme(newTheme: string): void {
	// 	this.theme = newTheme;
	// 	this.createStyles();
	// 	const themeColor = getThemeColor(widgetThemeMap[Yuwidget2Widget.ID]);
	// 	// this.inputElement.style.backgroundColor = getRGBA(themeColor, 0.1);
	// 	// this.inputElement.style.color = themeColor;
	// 	// Update combobox styles
	// 	this.comboboxElement.style.backgroundColor = getRGBA(themeColor, 0.1);
	// 	this.comboboxElement.style.color = themeColor;

	// 	// Update button styles
	// 	this.buttonElement.style.backgroundColor = getRGBA(themeColor, 0.3);
	// 	this.buttonElement.style.color = themeColor;

	// 	const backgroundText = this.domNode.querySelector('.background-text') as HTMLElement;
	// 	if (backgroundText) {
	// 		backgroundText.style.color = getRGBA(themeColor, 0.1);
	// 	}
	// }

	public setBackgroundText(text: string): void {
		this.backgroundText = text;
		const backgroundText = this.domNode.querySelector('.background-text') as HTMLElement;
		if (backgroundText) {
			backgroundText.textContent = text;
		}
	}

	private updateGlow(): void {
		const glow = this.domNode.querySelector('.futuristic-glow') as HTMLElement;
		const glowIntensity = 0.3 + Math.random() * 0.2;
		glow.style.opacity = glowIntensity.toString();
	}

	// private pulseEffect(): void {
	//   const glow = this.domNode.querySelector('.futuristic-glow') as HTMLElement;
	//   glow.style.opacity = '0.8';
	//   setTimeout(() => {
	//     glow.style.opacity = '0.5';
	//   }, 100);
	// }
	private pulseEffect(): void {
		const glow = this.domNode.querySelector('.futuristic-glow') as HTMLElement;
		glow.style.opacity = '0.8';
		setTimeout(() => {
			glow.style.opacity = '0.5';
		}, 100);

		// Add pulse effect to combobox and button
		this.comboboxElement.style.boxShadow = `0 0 10px ${getRGBA(getThemeColor(widgetThemeMap[Yuwidget2Widget.ID]), 0.8)}`;
		this.buttonElement.style.boxShadow = `0 0 10px ${getRGBA(getThemeColor(widgetThemeMap[Yuwidget2Widget.ID]), 0.8)}`;
		setTimeout(() => {
			this.comboboxElement.style.boxShadow = 'none';
			this.buttonElement.style.boxShadow = 'none';
		}, 100);
	}

	// private insertIntoEditor(textToInsert: string): void {
	//   const position = this.editor.getPosition();
	//   if (position) {
	//     this.editor.executeEdits(this.user_defined_id, [{
	//       range: {
	//         startLineNumber: position.lineNumber,
	//         startColumn: position.column,
	//         endLineNumber: position.lineNumber,
	//         endColumn: position.column,
	//       },
	//       text: textToInsert,
	//     }]);
	//     this.editor.setPosition(new Position(position.lineNumber, position.column + textToInsert.length));
	//     this.editor.trigger(this.user_defined_id, 'editor.action.showHover', null);
	//   }
	//   // this.inputElement.value = '';
	// }

	// private async defaultProcessInput(inputText: string): Promise<void> {
	//   try {
	//     const data = {
	//       // prompt: hidden_prompt_prefix + inputText + hidden_prompt_suffix
	//       prompt: inputText
	//     };
	//     const responseData = await postToBackendAPI<{ response: string }>('http://localhost:8000/quickQuery', data);
	//     const textToInsert = responseData.response || '';
	//     this.insertIntoEditor(textToInsert);
	//     // this.editorInfoProvider.info(textToInsert);
	//   } catch (error: any) {
	//     const textToInsert = `Error with backend query: ${JSON.stringify(error, null, 2)}`;
	//     // this.insertIntoEditor(textToInsert);
	//     this.editorInfoProvider.error(textToInsert);
	//   }
	// }

	public getId(): string {
		return Yuwidget2Widget.ID;
	}

	public getDomNode(): HTMLElement {
		return this.domNode;
	}

	public getPosition(): { position: Position; preference: ContentWidgetPositionPreference[] } | null {
		const position = this.editor.getPosition();
		return position ? {
			position: position,
			preference: [ContentWidgetPositionPreference.BELOW]
		} : null;
	}

	public show(): void {
		if (!this.isVisible) {
			this.isVisible = true;
			this.domNode.style.display = 'block';
			this.editor.layoutContentWidget(this);
			setTimeout(() => {
				this.comboboxElement.focus();
			}, 0);
		}
	}

	public hide(): void {
		if (this.isVisible) {
			this.isVisible = false;
			this.domNode.style.display = 'none';
			this.editor.layoutContentWidget(this);
		}
	}

	public toggle(): void {
		if (this.isVisible) {
			this.hide();
		} else {
			this.show();
		}
	}

	public override dispose(): void {
		this.hide();
		this.editor.removeContentWidget(this);
		window.removeEventListener('resize', this.handleResize.bind(this));
		super.dispose();
	}

	public kill(): void {
		this.dispose();
		this.isVisible = false;
	}
}
