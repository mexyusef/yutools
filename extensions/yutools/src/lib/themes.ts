/* eslint-disable local/code-no-unexternalized-strings */
import { create } from 'zustand';

type SimpleTheme = 'dark' | 'light';

interface ThemeStore {
  theme: SimpleTheme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));

export interface Theme {
  name: string;
  from: string;
  via: string;
  to: string;
  borderColor: string;
  bgColor: string;
}

export const predefinedThemes: Theme[] = [
  {
    name: "Ocean Blue",
    from: "from-blue-950",
    via: "via-blue-900",
    to: "to-blue-800",
    borderColor: "border-blue-700/30",
    bgColor: "bg-blue-950/30"
  },
  {
    name: "Emerald Forest",
    from: "from-emerald-950",
    via: "via-emerald-900",
    to: "to-emerald-800",
    borderColor: "border-emerald-700/30",
    bgColor: "bg-emerald-950/30"
  },
  {
    name: "Royal Purple",
    from: "from-purple-950",
    via: "via-purple-900",
    to: "to-purple-800",
    borderColor: "border-purple-700/30",
    bgColor: "bg-purple-950/30"
  },
  {
    name: "Sunset Orange",
    from: "from-orange-950",
    via: "via-orange-900",
    to: "to-orange-800",
    borderColor: "border-orange-700/30",
    bgColor: "bg-orange-950/30"
  },
  {
    name: "Rose Garden",
    from: "from-rose-950",
    via: "via-rose-900",
    to: "to-rose-800",
    borderColor: "border-rose-700/30",
    bgColor: "bg-rose-950/30"
  }
];
