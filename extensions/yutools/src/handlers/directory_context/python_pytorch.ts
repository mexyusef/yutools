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

export function register_dir_context_create_python_pytorch(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_python_pytorch`,
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
Here’s a list of the key steps, including both command-line operations and development activities, that you need to follow in order to start and finish a PyTorch project. I’ll break it down into logical stages of the project:

### 1. **Environment Setup**
	 - Install Python and pip (if not installed):
		 bash
		 sudo apt-get update
		 sudo apt-get install python3 python3-pip

	 - Create a project directory:
		 bash
		 mkdir my_pytorch_project
		 cd my_pytorch_project

	 - Set up a virtual environment (optional but recommended):
		 bash
		 python3 -m venv venv
		 source venv/bin/activate  # On Windows: venv\\Scripts\\activate

	 - Install PyTorch (choose based on your system specs: CUDA or CPU):
		 bash
		 pip install torch torchvision torchaudio


### 2. **Initialize the Project**
	 - Initialize a Git repository (optional but recommended for version control):
		 bash
		 git init

	 - Create a requirements.txt file to track dependencies:
		 bash
		 pip freeze > requirements.txt


### 3. **Project Structure Setup**
	 - Create project folders:
		 bash
		 mkdir data scripts models utils

	 - Create a main.py file (this will be your entry point):
		 bash
		 touch main.py


### 4. **Data Preparation**
	 - Place or download your dataset into the data folder (you may need to write a script to download/preprocess data).
	 - **Editing data processing scripts** (usually in scripts or utils):
		 - Write code to load and preprocess data using PyTorch Dataset and DataLoader.

### 5. **Model Creation**
	 - **Editing model file** (usually in models/):
		 - Define your neural network architecture by subclassing torch.nn.Module.
		 - Example model file (models/my_model.py):
		 python
		 import torch.nn as nn

		 class MyModel(nn.Module):
				 def __init__(self):
						 super(MyModel, self).__init__()
						 self.layer1 = nn.Linear(28*28, 128)
						 self.layer2 = nn.Linear(128, 10)

				 def forward(self, x):
						 x = torch.relu(self.layer1(x))
						 x = self.layer2(x)
						 return x


### 6. **Training and Evaluation**
	 - **Editing training and evaluation logic** (in main.py):
		 - Write functions to train and evaluate the model using PyTorch.
		 - Example:
		 python
		 from torch.utils.data import DataLoader
		 from models.my_model import MyModel

		 # Initialize your model, define loss and optimizer
		 model = MyModel()
		 loss_fn = torch.nn.CrossEntropyLoss()
		 optimizer = torch.optim.Adam(model.parameters())

		 # Training loop logic here
		 for epoch in range(num_epochs):
				 # Your training code


### 7. **Running the Training Script**
	 - Run the training:
		 bash
		 python main.py


### 8. **Model Checkpointing**
	 - Modify your training script to save model checkpoints:
		 python
		 torch.save(model.state_dict(), "models/model_checkpoint.pth")


### 9. **Model Testing and Inference**
	 - **Editing testing script** (if testing/inference is separate, e.g., scripts/test.py):
		 bash
		 touch scripts/test.py

	 - Write testing/inference code to load the trained model and evaluate on a test dataset or a single input:
		 python
		 model.load_state_dict(torch.load("models/model_checkpoint.pth"))
		 model.eval()  # Switch to evaluation mode


### 10. **Finalizing the Project**
	 - Update README.md (optional):
		 bash
		 touch README.md

	 - Update the requirements.txt file (optional):
		 bash
		 pip freeze > requirements.txt

	 - Commit your changes:
		 bash
		 git add .
		 git commit -m "Initial PyTorch project setup"


### 11. **Project Cleanup**
	 - Deactivate virtual environment (optional):
		 bash
		 deactivate


### 12. **Deployment (Optional)**
	 - If you are deploying the model (e.g., on a server), prepare deployment scripts and Docker files.
	 - Example Dockerfile:
		 bash
		 touch Dockerfile

		 Inside Dockerfile:
		 dockerfile
		 FROM python:3.9
		 WORKDIR /app
		 COPY . .
		 RUN pip install -r requirements.txt
		 CMD ["python", "main.py"]


This outline should guide you from start to finish for developing a basic PyTorch project.
`;
