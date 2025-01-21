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

export function register_dir_context_create_python_tensorflow(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_python_tensorflow`,
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
Here’s a step-by-step guide, including both commands and development activities, to start a TensorFlow project in Python from scratch to finish.

### 1. **Set up the environment**

- **Create a virtual environment (optional but recommended):**
	 bash
	 python -m venv venv

- **Activate the virtual environment:**
	 - On macOS/Linux:
		 bash
		 source venv/bin/activate

	 - On Windows:
		 bash
		 venv\\Scripts\\activate


### 2. **Install TensorFlow and dependencies**
	 - **Install TensorFlow:**
		 bash
		 pip install tensorflow

	 - **(Optional) Install additional packages:**
		 bash
		 pip install numpy pandas matplotlib


### 3. **Create the project directory**
	 - **Make a directory for your project:**
		 bash
		 mkdir my_tensorflow_project
		 cd my_tensorflow_project


### 4. **Initialize a Git repository (optional)**
	 - **Set up version control:**
		 bash
		 git init


### 5. **Editing the main project file**
	 - **Create a Python file for your model code:**
		 bash
		 touch main.py

	 - **Open and edit main.py** to define your TensorFlow model, including the dataset loading, model architecture, training process, etc.

	 python
	 import tensorflow as tf
	 from tensorflow.keras import layers, models

	 # Load your data (example: MNIST)
	 mnist = tf.keras.datasets.mnist
	 (x_train, y_train), (x_test, y_test) = mnist.load_data()

	 # Normalize the data
	 x_train, x_test = x_train / 255.0, x_test / 255.0

	 # Define the model
	 model = models.Sequential([
			 layers.Flatten(input_shape=(28, 28)),
			 layers.Dense(128, activation='relu'),
			 layers.Dense(10)
	 ])

	 # Compile the model
	 model.compile(optimizer='adam',
								 loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
								 metrics=['accuracy'])

	 # Train the model
	 model.fit(x_train, y_train, epochs=5)

	 # Evaluate the model
	 model.evaluate(x_test, y_test, verbose=2)


### 6. **Run the project**
	 - **Execute your Python script:**
		 bash
		 python main.py


### 7. **Model evaluation and tuning**
	 - **Edit the main.py** to tweak model architecture, hyperparameters, and dataset preprocessing steps as necessary.

### 8. **Save the trained model**
	 - **Edit main.py to save the model:**
	 python
	 model.save('my_model.h5')

	 - **Run the updated script again:**
		 bash
		 python main.py


### 9. **Testing and Inference**
	 - **Create a new Python file for testing/inference:**
		 bash
		 touch test.py

	 - **Edit test.py** to load and use the model for predictions:
		 python
		 from tensorflow.keras.models import load_model
		 import numpy as np

		 # Load the saved model
		 model = load_model('my_model.h5')

		 # Example test input
		 test_input = np.random.rand(1, 28, 28)  # Dummy input
		 prediction = model.predict(test_input)
		 print(prediction)

	 - **Run the test script:**
		 bash
		 python test.py


### 10. **(Optional) Convert the model for deployment**
	 - **Convert to TensorFlow Lite (for mobile/IoT deployment):**
		 bash
		 tflite_convert --saved_model_dir=saved_model --output_file=model.tflite


### 11. **Document the project**
	 - **Write README, requirements.txt:**
		 bash
		 touch README.md
		 pip freeze > requirements.txt


### 12. **Push to version control**
	 - **Push to GitHub (optional):**
		 bash
		 git add .
		 git commit -m "Initial commit"
		 git remote add origin <repository-url>
		 git push -u origin master


This is a basic outline for developing a TensorFlow project in Python, from setting up the environment to saving and testing a model.
`;
