import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
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
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\handlers\\directory_context\\astro.ts=BACA.md)
`;

export function register_dir_context_create_astro(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_astro`, async (uri: vscode.Uri) => {
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
Here is a step-by-step list of commands and actions for starting and setting up an Astro project with TypeScript:

### 1. **Initialize an Astro Project**
bash
npm create astro@latest

- Follow the prompts to name your project and choose a starter template.

### 2. **Navigate to the Project Directory**
bash
cd <project-name>


### 3. **Install Project Dependencies**
bash
npm install


### 4. **Add TypeScript to the Project**
bash
npx astro add typescript

- This command will configure TypeScript and create tsconfig.json and astro.config.mjs if they don't already exist.

### 5. **Set Up Prettier and ESLint (Optional but Recommended)**
bash
npm install prettier eslint eslint-plugin-astro eslint-config-prettier --save-dev

- Configure ESLint and Prettier with .eslintrc.js and .prettierrc files.

### 6. **Edit Main Configuration Files**
- Open and modify tsconfig.json if needed (e.g., set strict mode).
- Edit astro.config.mjs to customize the project’s Astro configuration.

### 7. **Create Components and Pages (Editing Files)**
- Create or edit files inside the /src folder:
	- Add .astro files for page components.
	- Add .ts files for logic handling.

### 8. **Run the Development Server**
bash
npm run dev

- The server will start, and changes will be automatically reflected in the browser.

### 9. **Build the Project for Production**
bash
npm run build


### 10. **Preview the Production Build**
bash
npm run preview


### 11. **Deploy to Your Hosting Provider (Optional)**
- Depending on the provider, this can be done through services like Vercel or Netlify.

This process will guide you from project setup to final deployment.



To deploy your Astro project on Netlify, follow these steps:

### 1. **Build the Project for Production**
First, ensure your project is ready for deployment by building it:

bash
npm run build


### 2. **Create a netlify.toml Configuration File**
Create a netlify.toml file in the root of your project to define your build settings. This file will tell Netlify how to build and serve your Astro project.

toml
[build]
	command = "npm run build"
	publish = "dist"

- command: The command Netlify runs to build your site.
- publish: The directory where the built site is located (dist for Astro).

### 3. **Push Your Project to GitHub (or any Git provider)**
Make sure your project is pushed to a Git repository. You can initialize a repository and push it to GitHub using the following commands (if it's not already done):

bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main


### 4. **Login to Netlify and Connect Your Repository**
- Go to [Netlify](https://www.netlify.com/) and log in or sign up.
- Once logged in, click on **"New site from Git"**.
- Choose the Git provider (GitHub, GitLab, Bitbucket) and select your repository.
- In the "Build Settings," Netlify should automatically detect the build command (npm run build) and publish directory (dist), thanks to your netlify.toml file. If not, set them manually.

### 5. **Set Environment Variables (if needed)**
If your Astro project uses environment variables (e.g., API keys), go to the **Site Settings > Build & Deploy > Environment** section in Netlify and add them.

### 6. **Deploy**
After connecting the repository and setting the necessary configurations, click **Deploy Site**. Netlify will pull the latest version of your project, run the build process, and deploy your site.

### 7. **Automatic Deployment on Push**
From now on, whenever you push changes to your GitHub repository (usually to the main branch), Netlify will automatically trigger a new build and deploy the updated site.

### 8. **Custom Domain (Optional)**
- Go to **Domain settings** in Netlify to add a custom domain.
- You can either buy a domain through Netlify or connect one from another registrar.

That's it! Your Astro project will be live on Netlify.
`;
