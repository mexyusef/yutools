export interface EditorSettings {
  wordWrap: 'on' | 'off';
  // theme: 'vs-dark' | 'light' | 'hc-black';
  theme: 'light' | 'dark' | 'high-contrast';
  // lineNumbers: 'on' | 'off';
  lineNumbers: boolean;
  lineWrapping: boolean;
  minimap: boolean;
  fontSize: number;
  tabSize: number;
}

export const defaultEditorSettings: EditorSettings = {
  wordWrap: 'on',
  // theme: 'vs-dark',
  theme: 'dark',
  // lineNumbers: 'on',
  lineNumbers: true,
  lineWrapping: true,
  minimap: false,
  fontSize: 16,
  tabSize: 2,
};

export const editorThemes = [
  // { name: 'Dark', value: 'vs-dark' },
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
  // { name: 'High Contrast', value: 'hc-black' },
  { name: 'High Contrast', value: 'high-contrast' },
] as const;