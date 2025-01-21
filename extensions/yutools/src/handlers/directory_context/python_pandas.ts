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

export function register_dir_context_create_python_pandas(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_python_pandas`,
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
Here's a comprehensive list of activities and commands you would invoke to start and develop a Python Pandas-based machine learning and data science project, from start to finish. I'll break it down step-by-step, including both CLI commands and essential development activities (like editing the main file) that should be performed along the way.

### Step 1: Set Up Your Environment

#### 1.1. **Create a project directory**
bash
mkdir my_ml_project
cd my_ml_project


#### 1.2. **Create a virtual environment**
bash
python3 -m venv venv


#### 1.3. **Activate the virtual environment**
- **For Linux/Mac:**
	bash
	source venv/bin/activate

- **For Windows:**
	bash
	.\\venv\\Scripts\\activate


#### 1.4. **Install essential packages (Pandas, Scikit-learn, Matplotlib, etc.)**
bash
pip install pandas scikit-learn numpy matplotlib seaborn jupyterlab


#### 1.5. **Initialize a Git repository (Optional)**
bash
git init


### Step 2: Data Preparation and Exploration

#### 2.1. **Start Jupyter Lab (for exploratory data analysis)**
bash
jupyter lab


#### 2.2. **[Activity]**: **Explore your dataset**
- Load and explore your dataset in a Jupyter Notebook.
	python
	import pandas as pd

	# Load dataset
	df = pd.read_csv('data.csv')

	# Explore the dataset
	df.head()
	df.info()
	df.describe()


#### 2.3. **[Activity]**: **Data Cleaning**
- Clean the data, handle missing values, and prepare it for modeling.

	python
	# Handle missing values
	df = df.dropna()  # or fillna()

	# Convert categorical columns to numerical (if necessary)
	df = pd.get_dummies(df, drop_first=True)


### Step 3: Feature Engineering and Preprocessing

#### 3.1. **[Activity]**: **Feature Engineering**
- Create or transform features based on your understanding of the data.
	python
	# Example: create a new feature
	df['new_feature'] = df['existing_feature'] ** 2


#### 3.2. **[Activity]**: **Split the data into training and testing sets**
- Use train_test_split from scikit-learn for this.
	python
	from sklearn.model_selection import train_test_split

	X = df.drop('target', axis=1)
	y = df['target']

	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


### Step 4: Model Building

#### 4.1. **[Activity]**: **Select and train a machine learning model**
- Choose a machine learning model and train it using scikit-learn.
	python
	from sklearn.ensemble import RandomForestClassifier

	model = RandomForestClassifier()
	model.fit(X_train, y_train)


#### 4.2. **[Activity]**: **Evaluate the model**
- Evaluate the model using metrics like accuracy, precision, recall, etc.
	python
	from sklearn.metrics import accuracy_score

	y_pred = model.predict(X_test)
	accuracy = accuracy_score(y_test, y_pred)
	print(f'Accuracy: {accuracy}')


### Step 5: Hyperparameter Tuning and Model Optimization

#### 5.1. **[Activity]**: **Use GridSearchCV or RandomizedSearchCV**
- Optimize the model's hyperparameters using GridSearchCV or RandomizedSearchCV.
	python
	from sklearn.model_selection import GridSearchCV

	param_grid = {
			'n_estimators': [50, 100, 200],
			'max_depth': [None, 10, 20, 30]
	}

	grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=5)
	grid_search.fit(X_train, y_train)

	print(f'Best parameters: {grid_search.best_params_}')


### Step 6: Finalize the Model and Save It

#### 6.1. **[Activity]**: **Train the model with best parameters (if tuning is successful)**
python
model = RandomForestClassifier(n_estimators=200, max_depth=20)
model.fit(X_train, y_train)


#### 6.2. **Save the trained model for later use**
python
import joblib

joblib.dump(model, 'final_model.pkl')


### Step 7: Create Scripts for Reproducibility

#### 7.1. **[Activity]**: **Create a Python script for data processing and model training**
- Convert your notebook into a Python script (or create it manually).
	bash
	touch main.py


- Inside main.py, include data loading, preprocessing, and model training code.

### Step 8: Test and Evaluate on New Data

#### 8.1. **[Activity]**: **Load and test the model on new data**
python
model = joblib.load('final_model.pkl')

new_data = pd.read_csv('new_data.csv')
X_new = new_data.drop('target', axis=1)

predictions = model.predict(X_new)
print(predictions)


### Step 9: Deploy or Share Your Project

#### 9.1. **[Activity]**: **Save final artifacts**
- Save the cleaned dataset, the final model, and the evaluation results.

#### 9.2. **Create a requirements file (for reproducibility)**
bash
pip freeze > requirements.txt


#### 9.3. **Push your project to GitHub (optional)**
bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/my_ml_project.git
git push -u origin main


### Step 10: Documentation and Reporting

#### 10.1. **[Activity]**: **Create a report or documentation**
- Document the process, results, and model interpretation.

#### 10.2. **Generate a report (Optional, using a notebook)**
bash
jupyter nbconvert --to html notebook.ipynb


---

This structure provides a clear workflow for developing a data science project with Pandas and machine learning tools. Each step includes both the CLI commands you'll need and development activities to complete along the way.
`;
