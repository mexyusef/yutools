import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';


const command_v1 = `echo __VAR1__`;

const fmus_code_wrapper = `
--% BACA.md
dummy baca md
--#
`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
		run.bat,f(n=ls -al)
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\nextjs_material.ts=BACA.md)
`;

export function register_dir_context_create_nextjs_material(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_nextjs_material`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath);

			const result_map = await processCommandWithMap(command_v1);
			if (result_map === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			} else {
				console.log('Processed Result:', result_map.result);
				console.log('Map:', result_map.map);

				const terminal = createNewTerminal(terminal_name, filePath);
				terminal.sendText(result_map.result);
				const fmus_command_replaced = applyReplacements(fmus_command, result_map.map);
				run_fmus_at_specific_dir(fmus_command_replaced, filePath);
				terminal.sendText(applyReplacements(`cd __VAR1__ && dir *.bat`, result_map.map));
			}
		});
	context.subscriptions.push(disposable);
}


const information = `
Here's a step-by-step list of commands and tasks you will invoke or perform to create a **Next.js** project using **TypeScript** and **Material UI** from start to finish:

### 1. **Create a new Next.js app with TypeScript**
bash
npx create-next-app@latest my-next-app --typescript
cd my-next-app


### 2. **Install Material UI and its dependencies**
bash
npm install @mui/material @emotion/react @emotion/styled


#### Optional (if using Material UI icons):
bash
npm install @mui/icons-material


### 3. **Install the Next.js TypeScript types**
This should already be included, but in case it's missing, install the necessary types:
bash
npm install --save-dev typescript @types/react


### 4. **Install the Material UI theme provider (optional)**
If you want to customize the Material UI theme:
bash
npm install @mui/system


### 5. **Edit the pages/_app.tsx file to include Material UI's theme provider**
<Editing the file>
In pages/_app.tsx, wrap the application in Material UI's <ThemeProvider> so the theme is available globally.

tsx
// pages/_app.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';

const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#dc004e',
		},
	},
});

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}


### 6. **Add a Material UI component in a page (e.g., pages/index.tsx)**
<Editing the file>
You can edit pages/index.tsx to use a Material UI component like a Button:

tsx
// pages/index.tsx
import { Button, Typography } from '@mui/material';

export default function Home() {
	return (
		<div>
			<Typography variant="h1" gutterBottom>
				Welcome to My Next.js App with Material UI!
			</Typography>
			<Button variant="contained" color="primary">
				Get Started
			</Button>
		</div>
	);
}


### 7. **Run the Next.js development server**
bash
npm run dev


### 8. **Optional: Configure ESLint and Prettier (if you want to enforce coding standards)**
bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier


You can also create .eslintrc.json and .prettierrc for configuration.

### 9. **Build for production (when ready)**
Once the development phase is complete, build the Next.js app for production:
bash
npm run build


### 10. **Start the production server**
After building, you can start the production server:
bash
npm start


### Summary of steps:
1. Create a Next.js app with TypeScript (npx create-next-app)
2. Install Material UI and dependencies (npm install @mui/material)
3. Edit _app.tsx to include the theme provider
4. Add Material UI components to pages (like index.tsx)
5. Run the development server (npm run dev)
6. Build and start the production server (npm run build and npm start)

Let me know if you need further details on any of these steps!
`;
