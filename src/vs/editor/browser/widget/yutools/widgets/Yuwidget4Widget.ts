/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor, ContentWidgetPositionPreference, IContentWidget } from '../../../../../editor/browser/editorBrowser.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { createCSSRule } from '../../../../../base/browser/dom.js';
import {
    executeVSCodeCommand,
    // executeFulledFloatingCursorCommand,
} from '../utils/commandUtils.js';
import { postToBackendAPI } from '../utils/apiUtils.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorInfoProvider } from '../editorInfoProvider.js';
import { getRGBA, getThemeColor, registerWidgetTheme } from '../utils/themeUtils.js';
import { widgetThemeMap } from '../utils/widgetThemeMap.js';

export class Yuwidget4Widget extends Disposable implements IContentWidget {
    private static readonly ID = 'editor.widget.Yuwidget4Widget';

    private domNode: HTMLElement;
    // private inputElement!: HTMLInputElement;
    private inputElement!: HTMLTextAreaElement;
    private editor: ICodeEditor;
    private isVisible: boolean = false;
    // private theme: string;
    private backgroundText: string;
    // private user_defined_id: string;
    private editorInfoProvider: EditorInfoProvider;

    constructor(
        editor: ICodeEditor,
        @IInstantiationService private readonly instantiationService: IInstantiationService,
        @ICommandService private readonly commandService: ICommandService,
    ) {
        super();
        // this.theme = 'orange';
        // this.theme = 'cyan';
        this.backgroundText = 'FMUS'; // Default background text
        registerWidgetTheme(Yuwidget4Widget.ID, 'orange');
        this.editor = editor;
        this.editorInfoProvider = this.instantiationService.createInstance(EditorInfoProvider);
        this.createStyles();
        this.domNode = document.createElement('div');
        this.domNode.className = 'fulled-fmus-widget futuristic-container';
        this.createInput();
        this.editor.addContentWidget(this);
        this.hide(); // Initially hide the widget
    }


    // private getThemeColor(): string {
    //     // const themeColors = {
    //     const themeColors: { [key: string]: string } = {
    //         pink: '#FF69B4',
    //         yellow: '#FFD700',
    //         orange: '#FFA500',
    //         blue: '#0080FF',
    //         magenta: '#FF00FF',
    //         cyan: '#00FFFF',
    //         red: '#FF0000',
    //         white: '#FFFFFF',
    //         green: '#00FF00', // Added green
    //         purple: '#8A2BE2', // Added purple
    //         teal: '#008080', // Added teal
    //         lime: '#32CD32', // Added lime
    //     };
    //     return themeColors[this.theme] || themeColors.cyan;
    // }

    // private getRGBA(hex: string, alpha: number): string {
    //     const r = parseInt(hex.slice(1, 3), 16);
    //     const g = parseInt(hex.slice(3, 5), 16);
    //     const b = parseInt(hex.slice(5, 7), 16);
    //     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    // }

    private createStyles(): void {
        const themeColor = getThemeColor(widgetThemeMap[Yuwidget4Widget.ID]);

        createCSSRule(`.fulled-fmus-widget`, `
            position: relative;
            width: 400px;
            height: 100px;
            background-color: #000;
            resize: both;
            overflow: hidden;
            `);

        // createCSSRule(`.fulled-fmus-widget input`, `
        //     width: 300px;
        //     padding: 5px;
        //     border: 1px solid var(--vscode-input-border);
        //     background-color: var(--vscode-input-background);
        //     color: var(--vscode-input-foreground);
        //     border-radius: 3px;
        // `);
        createCSSRule(`.fulled-fmus-widget .textarea-container`, `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        `);

        createCSSRule(`.fulled-fmus-widget textarea`, `
            width: 100%;
            height: 100%;
            background-color: ${getRGBA(themeColor, 0.1)};
            color: ${themeColor};
            font-size: 12px;
            padding: 10px;
            box-sizing: border-box;
            /*resize: none;*/
            outline: none;
            border: none;
            border-radius: 5px;
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
            scrollbar-width: thin;
            scrollbar-color: ${getRGBA(themeColor, 0.5)} ${getRGBA(themeColor, 0.1)};
        `);

        // Webkit-based browsers (Chrome, Safari, newer versions of Edge)
        createCSSRule(`.fulled-fmus-widget textarea::-webkit-scrollbar`, `
            width: 8px;
            height: 8px;
        `);
        createCSSRule(`.fulled-fmus-widget textarea::-webkit-scrollbar-track`, `
            background: ${getRGBA(themeColor, 0.1)};
            border-radius: 4px;
        `);
        createCSSRule(`.fulled-fmus-widget textarea::-webkit-scrollbar-thumb`, `
            background-color: ${getRGBA(themeColor, 0.5)};
            border-radius: 4px;
            border: 2px solid ${getRGBA(themeColor, 0.1)};
        `);
        createCSSRule(`.fulled-fmus-widget textarea::-webkit-scrollbar-thumb:hover`, `
            background-color: ${getRGBA(themeColor, 0.7)};
        `);

        createCSSRule(`.fulled-fmus-widget .background-text`, `
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

        createCSSRule(`.fulled-fmus-widget .futuristic-border`, `
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

        createCSSRule(`.fulled-fmus-widget .futuristic-glow`, `
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
        container.className = 'textarea-container';

        this.inputElement = document.createElement('textarea');
        this.inputElement.className = 'futuristic-textarea';
        this.inputElement.placeholder = 'Enter your futuristic text...';
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.processInput();
            } else if (e.key === 'Escape') {
                this.hide();
                this.editor.focus();
            } else if (e.key === 'x' && e.ctrlKey && e.shiftKey) {
                this.kill();
                this.editor.focus();
            } else if (e.key === 'h' && e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation(); // Add this line to stop event propagation
                this.toggleHelpMessage();
            } else if (e.key === 'PageUp' || e.key === 'PageDown') {
                e.preventDefault(); // Prevent default PageUp and PageDown behavior
            } else if (e.key === 'd' && e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation(); // Add this line to stop event propagation
                // executeVSCodeCommand(this.commandService, 'fulled.set_current_working_directory_to_dir_selection', ".");
                // C:\ai\fulled\extensions\fulled\src\status_bar.ts
                executeVSCodeCommand(this.commandService, 'fulled.open_folder_to_set_cwd');
            }
        });
        // Prevent default behavior for PageUp and PageDown on keypress as well
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'PageUp' || e.key === 'PageDown') {
                e.preventDefault();
            }
        });
        const themeColor = getThemeColor(widgetThemeMap[Yuwidget4Widget.ID]);
        this.inputElement.addEventListener('focus', () => {
            // this.inputElement.style.backgroundColor = 'rgba(0, 255, 255, 0.15)';
            // this.inputElement.style.backgroundColor = 'rgba(0, 128, 255, 0.15)';
            this.inputElement.style.backgroundColor = getRGBA(themeColor, 0.15);
        });
        this.inputElement.addEventListener('blur', () => {
            // this.inputElement.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
            // this.inputElement.style.backgroundColor = 'rgba(0, 128, 255, 0.1)';
            this.inputElement.style.backgroundColor = getRGBA(themeColor, 0.1);
        });
        this.inputElement.addEventListener('input', this.pulseEffect.bind(this));
        this.inputElement.addEventListener('mouseup', this.handleResize.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        // this.inputElement.addEventListener('mousemove', this.createCursorTrail.bind(this));
        const backgroundTextElement = document.createElement('div');
        backgroundTextElement.className = 'background-text';
        backgroundTextElement.textContent = this.backgroundText;

        container.appendChild(backgroundTextElement);
        container.appendChild(this.inputElement);

        const border = document.createElement('div');
        border.className = 'futuristic-border';
        const glow = document.createElement('div');
        glow.className = 'futuristic-glow';

        // this.domNode.appendChild(this.inputElement);
        this.domNode.appendChild(container);
        this.domNode.appendChild(border);
        this.domNode.appendChild(glow);
        setInterval(this.updateGlow.bind(this), 100);
    }

    private async toggleHelpMessage(): Promise<void> {
        const infoText = await this.editorInfoProvider.updateInfoTextArea();
        this.inputElement.value += infoText;
        // this.inputElement.scrollTop = this.inputElement.scrollHeight;
        // Scroll to the top
        this.inputElement.scrollTop = 0;
        // Set cursor to the beginning
        this.inputElement.setSelectionRange(0, 0);
    }

    private handleResize(): void {
        const widgetRect = this.domNode.getBoundingClientRect();
        const textarea = this.inputElement;
        const border = this.domNode.querySelector('.futuristic-border') as HTMLElement;
        const glow = this.domNode.querySelector('.futuristic-glow') as HTMLElement;

        textarea.style.width = `${widgetRect.width}px`;
        textarea.style.height = `${widgetRect.height}px`;

        border.style.width = `${widgetRect.width}px`;
        border.style.height = `${widgetRect.height}px`;

        glow.style.width = `${widgetRect.width}px`;
        glow.style.height = `${widgetRect.height}px`;

        this.editor.layoutContentWidget(this);
    }

    // public setTheme(newTheme: string): void {
    //     this.theme = newTheme;
    //     this.createStyles();
    //     const themeColor = getThemeColor(widgetThemeMap[Yuwidget4Widget.ID]);
    //     this.inputElement.style.backgroundColor = getRGBA(themeColor, 0.1);
    //     this.inputElement.style.color = themeColor;
    //     const backgroundText = this.domNode.querySelector('.background-text') as HTMLElement;
    //     if (backgroundText) {
    //         backgroundText.style.color = getRGBA(themeColor, 0.1);
    //     }
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

    private pulseEffect(): void {
        const glow = this.domNode.querySelector('.futuristic-glow') as HTMLElement;
        glow.style.opacity = '0.8';
        setTimeout(() => {
            glow.style.opacity = '0.5';
        }, 100);
    }

    private processInput(): void {
        const inputText = this.inputElement.value;
        // const editor = this.editor;
        // const position = editor.getPosition();

        // if (position) {
        //     editor.executeEdits(this.user_defined_id, [{
        //         range: {
        //             startLineNumber: position.lineNumber,
        //             startColumn: position.column,
        //             endLineNumber: position.lineNumber,
        //             endColumn: position.column
        //         },
        //         text: inputText
        //     }]);
        //     editor.setPosition(new Position(position.lineNumber, position.column + inputText.length));
        //     editor.trigger(this.user_defined_id, 'editor.action.showHover', null);
        // }
        // console.log('Input processed and inserted:', inputText);
        // this.inputElement.value = '';
        this.defaultProcessInput(inputText);
        this.hide();
        this.editor.focus(); // Return focus to the editor
    }

    // private insertIntoEditor(textToInsert: string): void {
    //     const position = this.editor.getPosition();
    //     if (position) {
    //         this.editor.executeEdits(this.user_defined_id, [{
    //             range: {
    //                 startLineNumber: position.lineNumber,
    //                 startColumn: position.column,
    //                 endLineNumber: position.lineNumber,
    //                 endColumn: position.column,
    //             },
    //             text: textToInsert,
    //         }]);
    //         this.editor.setPosition(new Position(position.lineNumber, position.column + textToInsert.length));
    //         this.editor.trigger(this.user_defined_id, 'editor.action.showHover', null);
    //     }
    //     // this.inputElement.value = '';
    // }

    private async defaultProcessInput(inputText: string): Promise<void> {
        try {
            const current_directory = this.editorInfoProvider.get_editor_directory_or_current_working_directory();
            const data = {
                content: 'fmuslang:' + inputText,
                meta: {
                    metaWorkspacesFspath: [current_directory],
                    metaWorkspacesPath: [current_directory],
                    currentProjectFolder: current_directory,
                    metaDocument: {
                        fsPath: current_directory, // cuma ini dipake

                        filename: current_directory,
                        path: current_directory,
                        language: 'javascript',
                    },
                }
            };
            const responseData = await postToBackendAPI<{ response: string }>('http://localhost:8000/run_fmus', data);
            const textToInsert = responseData.response || '';
            // this.insertIntoEditor(textToInsert);
            this.editorInfoProvider.info(textToInsert);
        } catch (error: any) {
            const textToInsert = `Error with backend query: ${JSON.stringify(error, null, 2)}`;
            // this.insertIntoEditor(textToInsert);
            this.editorInfoProvider.error(textToInsert);
        }
    }

    public getId(): string {
        return Yuwidget4Widget.ID;
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
                this.inputElement.focus();
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
