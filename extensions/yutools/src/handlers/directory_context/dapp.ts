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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\dapp.ts=BACA.md)
`;

export function register_dir_context_create_dapp(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_dapp`, async (uri: vscode.Uri) => {
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
Here’s a step-by-step list of commands and activities to create a basic decentralized application (dApp) project from start to finish, including the various tasks you need to do during the development process. I assume you are building a dApp using **Ethereum** and **Solidity**, but you can modify these steps for other blockchains.

### 1. **Set up the development environment**
	 - **Install Node.js** (if you don’t have it already):
		 bash
		 sudo apt install nodejs
		 sudo apt install npm

	 - **Install Truffle or Hardhat** (for Ethereum dApp development):
		 bash
		 npm install -g truffle

		 OR
		 bash
		 npm install --save-dev hardhat


### 2. **Initialize the dApp project**
	 - **Create a new project directory:**
		 bash
		 mkdir my-dapp
		 cd my-dapp

	 - **Initialize a new Node.js project:**
		 bash
		 npm init -y

	 - **Initialize Truffle project:**
		 bash
		 truffle init

		 OR
	 - **Initialize Hardhat project:**
		 bash
		 npx hardhat

		 (Follow the setup instructions.)

### 3. **Install required packages**
	 - **Install Web3.js (or ethers.js):**
		 bash
		 npm install web3

		 OR
		 bash
		 npm install ethers

	 - **Install OpenZeppelin contracts (optional):**
		 bash
		 npm install @openzeppelin/contracts

	 - **Install dotenv for environment variables:**
		 bash
		 npm install dotenv


### 4. **Write the smart contracts**
	 - **Create Solidity files in contracts directory:**
		 - Path for Truffle: contracts/
		 - Path for Hardhat: contracts/
	 - **Example:** Create a MyContract.sol file:
		 sol
		 pragma solidity ^0.8.0;

		 contract MyContract {
				 // Your smart contract code here
		 }


### 5. **Compile the smart contracts**
	 - **For Truffle:**
		 bash
		 truffle compile

	 - **For Hardhat:**
		 bash
		 npx hardhat compile


### 6. **Write deployment scripts**
	 - **For Truffle (write a migration script in migrations/):**
		 javascript
		 const MyContract = artifacts.require("MyContract");

		 module.exports = function (deployer) {
				 deployer.deploy(MyContract);
		 };

	 - **For Hardhat (create a deploy script in scripts/):**
		 javascript
		 async function main() {
				 const MyContract = await ethers.getContractFactory("MyContract");
				 const contract = await MyContract.deploy();
				 console.log("Contract deployed to address:", contract.address);
		 }
		 main().catch((error) => {
				 console.error(error);
				 process.exitCode = 1;
		 });


### 7. **Deploy the smart contracts**
	 - **For Truffle (on a local testnet like Ganache):**
		 bash
		 truffle migrate --network development

	 - **For Hardhat (on a local node or testnet):**
		 bash
		 npx hardhat run scripts/deploy.js --network localhost


### 8. **Test the smart contracts**
	 - **Write unit tests in JavaScript or Solidity in test/ directory:**
	 - **Run tests for Truffle:**
		 bash
		 truffle test

	 - **Run tests for Hardhat:**
		 bash
		 npx hardhat test


### 9. **Set up the frontend**
	 - **Create React app for the frontend (if using React):**
		 bash
		 npx create-react-app my-dapp-frontend
		 cd my-dapp-frontend

	 - **Install Web3.js or ethers.js for interacting with the blockchain:**
		 bash
		 npm install web3

		 OR
		 bash
		 npm install ethers


### 10. **Edit the main frontend files to interact with the blockchain**
	 - **Modify the React app to include wallet connection (MetaMask):**
		 - Example in App.js:
		 javascript
		 import Web3 from 'web3';

		 async function loadBlockchainData() {
				 const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
				 const accounts = await web3.eth.getAccounts();
				 console.log("Connected account:", accounts[0]);
		 }

		 loadBlockchainData();


### 11. **Run the frontend**
	 - **Start the React development server:**
		 bash
		 npm start


### 12. **Deploy the dApp on a test network (like Rinkeby or Goerli)**
	 - **For Truffle:**
		 bash
		 truffle migrate --network rinkeby

	 - **For Hardhat:**
		 bash
		 npx hardhat run scripts/deploy.js --network rinkeby


### 13. **Interact with the deployed contract**
	 - **Use the frontend to interact with the smart contract (for example, by calling contract functions via Web3.js or ethers.js).**

### 14. **Optional: Deploy to mainnet**
	 - **Follow the same steps as deploying to a testnet but use the mainnet configuration.**
	 - **For Truffle:**
		 bash
		 truffle migrate --network mainnet

	 - **For Hardhat:**
		 bash
		 npx hardhat run scripts/deploy.js --network mainnet


### 15. **Audit the smart contract (optional)**
	 - **Use tools like MythX, Slither, or OpenZeppelin's Defender for security auditing.**

### 16. **Launch the dApp publicly**
	 - **Host the frontend using services like Netlify, Vercel, or GitHub Pages.**
	 - **Ensure your contract is verified on Etherscan.**

---

This list gives a general overview, but some steps will depend on the tools and framework you choose for your dApp development.


`;
