/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor, ContentWidgetPositionPreference, IContentWidget } from '../../../../../editor/browser/editorBrowser.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { createCSSRule } from '../../../../../base/browser/dom.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
// import { ITextModel } from '../../../../../editor/common/model';
// import { URI } from '../../../../../base/common/uri';
// import { dirname } from '../../../../../base/common/resources';
// import { IEditorService } from '../../../../../workbench/services/editor/common/editorService';
// import { IWorkbenchEnvironmentService } from '../../../../../workbench/services/environment/common/environmentService';
// import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorInfoProvider } from '../editorInfoProvider.js';

export class Yuwidget5Widget extends Disposable implements IContentWidget {
    private static readonly ID = 'editor.widget.Yuwidget5Widget';
    private domNode: HTMLElement;
    private editor: ICodeEditor;
    private isVisible: boolean = false;
    private comboBox!: HTMLSelectElement;
    // @ts-ignore
    private selectedLLM: string = '';
    private textArea!: HTMLTextAreaElement;
    private infoTextArea!: HTMLTextAreaElement; // New read-only text area for information
    private showInfoCheckbox!: HTMLInputElement; // Checkbox to toggle info visibility
    private activeCheckbox!: HTMLInputElement;
    private editorInfoProvider: EditorInfoProvider;

    constructor(
        editor: ICodeEditor,
        @ICommandService private readonly commandService: ICommandService,
        @IInstantiationService private readonly instantiationService: IInstantiationService
    ) {
        super();

        this.editor = editor;
        this.editorInfoProvider = this.instantiationService.createInstance(EditorInfoProvider);

        this.createStyles();
        this.domNode = document.createElement('div');
        this.domNode.className = 'floating-cursor-widget';

        this.createTextArea();
        this.createComboBox();
        this.createButtons();
        this.createKillButton();
        this.createInfoTextArea();

        this.editor.addContentWidget(this);
        // this.editor.addOverlayWidget(this);
        this.hide();
        // // Update the widget content every second
        // setInterval(() => this.updateContent(), 1000);
    }

    private createKillButton(): void {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.alignItems = 'center';

        const killButton = document.createElement('button');
        killButton.textContent = 'Kill Widget';
        killButton.addEventListener('click', () => {
            this.kill(); // Call the kill method when the button is clicked
        });
        buttonContainer.appendChild(killButton);

        // Create Active Checkbox
        this.activeCheckbox = document.createElement('input');
        this.activeCheckbox.type = 'checkbox';
        this.activeCheckbox.id = 'active-checkbox';
        this.activeCheckbox.checked = true;
        const activeLabel = document.createElement('label');
        activeLabel.textContent = 'Active';
        activeLabel.htmlFor = 'active-checkbox';

        buttonContainer.appendChild(this.activeCheckbox);
        buttonContainer.appendChild(activeLabel);

        // Create Radio Buttons (Query, Code, FMUs, Explain, Refactor, Grammar, Plan)
        const radioOptions = ['Query', 'Code', 'FMUs', 'Explain', 'Refactor', 'Grammar', 'Plan'];
        const radioGroupName = 'task-radio-group';

        radioOptions.forEach((option) => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = radioGroupName;
            radio.id = `${option.toLowerCase()}-radio`;
            radio.value = option.toLowerCase();
            if (option === 'Query') { radio.checked = true; }

            const label = document.createElement('label');
            label.textContent = option;
            label.htmlFor = `${option.toLowerCase()}-radio`;

            buttonContainer.appendChild(radio);
            buttonContainer.appendChild(label);
        });


        // this.domNode.appendChild(killButton);
        this.domNode.appendChild(buttonContainer);
    }

    private createStyles(): void {
        createCSSRule(`.floating-cursor-widget`, `

            background-color: rgba(0, 255, 255, 0.5);
            border: 1px solid var(--vscode-editor-foreground);
            padding: 10px;
            border-radius: 5px;
            display: block; /** NEW **/
            backdrop-filter: blur(5px);
        `);

        createCSSRule(`.floating-cursor-widget textarea`, `
            /* width: 100%; */
            /*height: 300px;  Fixed height */

            width: 400px; /* Fixed width */
            height: 100px; /* Fixed height */

            font-size: 14px; /* Small font */
            background-color: rgba(0, 0, 0, 0.7); /* Dark background */
            color: #ffffff; /* White text */
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
            /* resize: none; Disable resizing */
            margin-bottom: 10px; /** NEW **/
        `);

        createCSSRule(`.floating-cursor-widget input`, `
            width: 100%;
            padding: 5px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 3px;
        `);
        // Define the CSS specifically for checkboxes
        createCSSRule(`.floating-cursor-widget input[type="checkbox"]`, `
            width: 20px;
            height: 20px;
            margin-right: 5px;
            border: 1px solid var(--vscode-input-border);
        `);
        createCSSRule(`.floating-cursor-widget select`, `
            width: 100%;
            padding: 5px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 3px;
            margin-bottom: 10px; /** NEW **/
        `);

        // Define the CSS for aligning radio buttons with their labels
        createCSSRule(`.floating-cursor-widget .radio-container`, `
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        `);

        createCSSRule(`.floating-cursor-widget input[type="radio"]`, `
            margin-right: 5px;
        `);

        createCSSRule(`.floating-cursor-widget button`, `
            margin-top: 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            background-color: rgba(0, 150, 150, 0.8);
            color: #ffffff;
            cursor: pointer;
            margin-right: 5px; /** NEW **/
        `);

        // Effect styles for sync button
        createCSSRule(`.sync-button-active`, `
            background-color: rgba(0, 100, 100, 1) !important;
            transform: scale(1.1);
            transition: background-color 0.2s ease, transform 0.2s ease;
        `);
    }

    private createTextArea(): void {
        this.textArea = document.createElement('textarea');

        this.textArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.processInput(this.textArea.value);
            } else if (e.key === 'Escape') {
                this.hide();
                this.editor.focus();
            }
        });

        this.domNode.appendChild(this.textArea);
    }

    private populateComboBox(): void {
        const options = ['openai', 'gemini', 'groq', 'cohere'];
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            this.comboBox.appendChild(optionElement);
        });
    }

    private createComboBox(): void {
        this.comboBox = document.createElement('select');
        this.populateComboBox();
        this.comboBox.addEventListener('change', (event) => {
            this.selectedLLM = (event.target as HTMLSelectElement).value;
            console.log('Selected LLM:', this.selectedLLM);
        });
        this.domNode.appendChild(this.comboBox);
    }

    private createButtons(): void {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.alignItems = 'center';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', async () => {
            await this.processInput(this.textArea.value);
            console.log('Input:', this.textArea.value);
            this.hide();
        });
        buttonContainer.appendChild(submitButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            this.hide();
        });
        buttonContainer.appendChild(cancelButton);

        // Sync Button
        const syncButton = document.createElement('button');
        syncButton.textContent = 'Sync';
        syncButton.addEventListener('click', () => {
            this.updateInfoTextArea();
            this.animateSyncButton(syncButton); // Animate button
        });
        syncButton.className = 'sync-button'; // Class for styling
        buttonContainer.appendChild(syncButton);

        // Add the two new buttons: Project and Terminal
        const projectButton = document.createElement('button');
        projectButton.textContent = 'Project';
        projectButton.addEventListener('click', () => {
            console.log('Project button clicked');
            // Add your custom behavior here
        });
        buttonContainer.appendChild(projectButton);

        const terminalButton = document.createElement('button');
        terminalButton.textContent = 'Terminal';
        terminalButton.addEventListener('click', () => {
            console.log('Terminal button clicked');
            // Add your custom behavior here
        });
        buttonContainer.appendChild(terminalButton);

        // Checkbox to toggle info display
        this.showInfoCheckbox = document.createElement('input');
        this.showInfoCheckbox.type = 'checkbox';
        this.showInfoCheckbox.checked = false;
        this.showInfoCheckbox.addEventListener('change', () => {
            this.infoTextArea.style.display = this.showInfoCheckbox.checked ? 'block' : 'none';
        });
        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = 'Show Info';
        checkboxLabel.style.marginLeft = '5px';
        buttonContainer.appendChild(this.showInfoCheckbox);
        buttonContainer.appendChild(checkboxLabel);

        this.domNode.appendChild(buttonContainer);
    }

    private animateSyncButton(button: HTMLButtonElement): void {
        button.classList.add('sync-button-active');
        setTimeout(() => {
            button.classList.remove('sync-button-active');
        }, 300); // Reset after 300ms
    }

    private createInfoTextArea(): void {
        this.infoTextArea = document.createElement('textarea');
        this.infoTextArea.readOnly = true;
        this.infoTextArea.style.display = 'none'; // Start hidden
        this.domNode.appendChild(this.infoTextArea);
        this.updateInfoTextArea(); // Populate with info
    }

    private async updateInfoTextArea(): Promise<void> {
        const infoText = await this.editorInfoProvider.updateInfoTextArea();
        this.infoTextArea.value = infoText;
    }

    private async defaultProcessInput(inputText: string): Promise<void> {
        let textToInsert = inputText; // Default to inputText if no server response is needed

        // Check if the checkbox is active
        if (this.activeCheckbox && this.activeCheckbox.checked) {
            // Find the selected radio button
            const selectedRadio = document.querySelector('.floating-cursor-widget input[type="radio"]:checked') as HTMLInputElement;
            const selectionLabel = selectedRadio ? selectedRadio.value : ''; // Get the label of the selected radio button
            // modify inputText sesuai selectionLabel
            // Modify inputText based on the radio selection
            if (selectionLabel !== 'query') {
                inputText = `Processed by ${selectionLabel}: ` + inputText;
            }
            // Make a POST request to the server
            try {
                const response = await fetch('http://localhost:8000/quickQuery', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: inputText,
                    }),
                });

                // Ensure the response is okay and extract the text to insert
                if (response.ok) {
                    const responseData = await response.json(); // Assuming server responds with JSON
                    console.log(`

                        TERIMA SERVER:
                        ${JSON.stringify(responseData, null, 2)}

                    `);
                    // textToInsert = responseData.text || ''; // Update textToInsert with server response
                    textToInsert = responseData.response || '';
                } else {
                    // throw new Error(`Server error: ${response.statusText}`);
                    textToInsert = `Server error: ${response.statusText}`;
                }
            } catch (error: any) {
                // console.error('Error with POST request:', error);
                textToInsert = `Error with POST request: ${error.message}`;
            }
        }
        // Existing code to process input in the editor using the server's response (or inputText if no response)
        const position = this.editor.getPosition();
        if (position) {
            this.editor.executeEdits('floatingCursor', [{
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                },
                text: textToInsert,
            }]);
            this.editor.setPosition(new Position(position.lineNumber, position.column + textToInsert.length));
            this.editor.trigger('floatingCursor', 'editor.action.showHover', null);
        }
    }

    private async processInput(inputText: string): Promise<void> {
        // C:\ai\fulled\extensions\fulled\src\floatingcursorwidget_handler.ts
        const commandId = 'fulled.floatingcursorwidget_handler';
        try {
            await this.commandService.executeCommand(commandId, inputText, this.editor);
            console.log(`DELEGATE: inserted: ${inputText}.`);
        } catch (error) {
            this.defaultProcessInput(inputText);
            console.log(`DEFAULT: Input processed and inserted: ${inputText}.`);
        }
        this.hide();
        this.editor.focus();
    }

    public getId(): string {
        return Yuwidget5Widget.ID;
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
        // if (!this.isVisible) {
        this.isVisible = true;
        this.domNode.style.display = 'block';
        this.editor.layoutContentWidget(this);
        setTimeout(() => {
            this.textArea.focus();
        }, 0);
    }

    public hide(): void {
        this.isVisible = false;
        this.domNode.style.display = 'none';
        this.editor.layoutContentWidget(this);
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
        super.dispose();
    }

    public kill(): void {
        this.dispose();
        this.isVisible = false;
    }
}
