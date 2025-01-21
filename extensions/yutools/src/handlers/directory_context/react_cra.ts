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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\android_kotlin.ts=BACA.md)
`;

export function register_dir_context_create_react_cra(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_react_cra`,
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
Here’s a step-by-step list of commands and activities required to set up a **Create React App** with **ShadCN-UI**, including the requested features such as a dashboard with tables, charts, editor, lists, cards, sidebar, drawer menu, and JWT authentication.

### Step 1: Create a React App
bash
npx create-react-app my-dashboard-app
cd my-dashboard-app


### Step 2: Install ShadCN-UI & Tailwind CSS (ShadCN uses Tailwind CSS)
#### Install Tailwind CSS
bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init


#### Configure tailwind.config.js
javascript
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [],
}


#### Add Tailwind CSS to src/index.css
css
@tailwind base;
@tailwind components;
@tailwind utilities;


### Step 3: Install ShadCN Components
bash
npm install @shadcn/react @shadcn/ui


### Step 4: Set up Authentication (JWT)
1. **Install JWT-related packages:**
bash
npm install axios jwt-decode
npm install express jsonwebtoken bcryptjs


2. **Set up authentication context & JWT handling**:
	 - **Edit/Create auth.js** to handle login/logout.
	 - **Configure Axios** for API requests with JWT headers.

### Step 5: Install Additional UI Libraries (for charts, tables, editors, etc.)
1. **Install Chart.js:**
bash
npm install chart.js react-chartjs-2


2. **Install React Table:**
bash
npm install react-table


3. **Install React Quill (for editor):**
bash
npm install react-quill


4. **Install Icons and Components (for lists, cards, etc.):**
bash
npm install @heroicons/react


### Step 6: Set up Routing (React Router)
bash
npm install react-router-dom


**Edit src/index.js to wrap the app with BrowserRouter:**
javascript
import { BrowserRouter as Router } from 'react-router-dom';

<Router>
	<App />
</Router>


### Step 7: Set up Sidebar & Drawer Menu
1. **Create Sidebar & Drawer Menu Components.**
	 - **Edit/Create Sidebar.js and DrawerMenu.js.**

2. **Use ShadCN components to style them**.

### Step 8: Set up Dashboard Components
1. **Create Dashboard Structure with Cards, Tables, Charts, Lists.**
	 - **Edit/Create Dashboard.js**.
	 - Use react-table, react-chartjs-2, and ShadCN components for layout.

### Step 9: Configure Protected Routes for Authentication
1. **Edit/Create ProtectedRoute.js** for JWT-based access control.

### Step 10: Set up Backend (Optional for JWT)
1. **Create an Express server** to handle login requests and issue JWTs.

### Step 11: Final Steps (Run the app)
bash
npm start


### Step 12: Optional Deployment (Netlify, Vercel, etc.)
bash
npm run build


---

This step-by-step process will help you build a complete dashboard with the features you requested, from scratch. Each "edit" activity points to specific files that should be customized during development.
`;
