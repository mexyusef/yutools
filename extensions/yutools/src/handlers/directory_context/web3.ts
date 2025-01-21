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

export function register_dir_context_create_web3(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_web3`,
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
Here's a step-by-step list of common commands and activities for starting a modern Web3 project from scratch to finish, including both CLI commands and key development activities:

### 1. **Project Setup**

- **Install Node.js (if not already installed)**
	bash
	nvm install node


- **Initialize a new project directory**
	bash
	mkdir my-web3-project
	cd my-web3-project


- **Initialize a new Node.js project**
	bash
	npm init -y


- **Install development tools (e.g., Hardhat, Truffle, or Foundry)**
	- **For Hardhat**
		bash
		npm install --save-dev hardhat

	- **For Truffle**
		bash
		npm install -g truffle
		truffle init


### 2. **Smart Contract Development**

- **Create a new Hardhat project (if using Hardhat)**
	bash
	npx hardhat


- **Install OpenZeppelin contracts (optional but commonly used)**
	bash
	npm install @openzeppelin/contracts


- **Edit smart contract files**
	bash
	code contracts/MyContract.sol


### 3. **Compile Contracts**

- **For Hardhat**
	bash
	npx hardhat compile

- **For Truffle**
	bash
	truffle compile


### 4. **Deploy Smart Contracts**

- **Edit deployment scripts (if using Hardhat or Truffle)**
	bash
	code scripts/deploy.js


- **Deploy contract locally (Hardhat)**
	bash
	npx hardhat run scripts/deploy.js --network localhost


- **Deploy contract to a testnet (e.g., Rinkeby, Goerli)**
	bash
	npx hardhat run scripts/deploy.js --network rinkeby


### 5. **Testing Contracts**

- **Write tests for your contracts (in JavaScript or TypeScript)**
	bash
	code test/MyContractTest.js


- **Run tests**
	bash
	npx hardhat test


### 6. **Interact with Contracts**

- **Use Hardhat console to interact locally**
	bash
	npx hardhat console --network localhost


### 7. **Frontend Development (React + Web3.js or Ethers.js)**

- **Install React (optional: Next.js, Vite, or other frameworks)**
	bash
	npx create-react-app my-web3-frontend
	cd my-web3-frontend


- **Install Web3.js or Ethers.js for contract interaction**
	bash
	npm install web3 ethers


- **Edit frontend code (integrating smart contract with Web3)**
	bash
	code src/App.js


### 8. **Connect Wallet Integration (e.g., MetaMask)**

- **Install MetaMask provider**
	bash
	npm install @metamask/detect-provider


- **Edit wallet connection logic**
	bash
	code src/wallet.js


### 9. **Frontend Deployment**

- **Build React app for production**
	bash
	npm run build


- **Deploy to a static hosting platform (e.g., Vercel, Netlify, or IPFS)**
	bash
	npx vercel --prod

	or
	bash
	npx ipfs add -r build


### 10. **Final Steps**

- **Monitor and verify contracts on Etherscan (or other explorers)**
	bash
	npx hardhat verify --network rinkeby <contract_address> <constructor_arguments>


- **Audit smart contract security (optional)**

- **Mainnet deployment (final)**
	bash
	npx hardhat run scripts/deploy.js --network mainnet


### Summary
1. Set up project directory and package management
2. Write, compile, and deploy smart contracts
3. Write tests and verify functionality
4. Build and connect frontend with Web3/Ethers.js
5. Integrate wallet functionality
6. Deploy frontend
7. Verify and launch contracts on mainnet.

This flow covers all essential steps for developing a modern Web3 project from scratch to production.

`;
