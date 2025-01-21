type ToolbarProps = {
    onPanelToggle: () => void;
    onSettingsToggle: () => void;
    onLLMSettingsToggle: () => void;
    onThemeChange: (theme: string) => void;
    currentTheme: string;
};
export default function Toolbar({ onPanelToggle, onSettingsToggle, onLLMSettingsToggle, onThemeChange, currentTheme }: ToolbarProps): import("react/jsx-runtime").JSX.Element;
export {};
