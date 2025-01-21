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

export function register_dir_context_create_ruby_library(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_ruby_library`,
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
Here's a step-by-step guide, including both commands and actions, for starting a Ruby library/gem package project from start to finish:

### 1. **Create a new gem project**
bash
bundle gem my_gem_name

- This command sets up the skeleton for a new gem project in the directory my_gem_name.

### 2. **Navigate to the gem directory**
bash
cd my_gem_name


### 3. **Initialize Git repository (optional but recommended)**
bash
git init
git add .
git commit -m "Initial commit - gem skeleton"


### 4. **Edit gemspec file**
- Open my_gem_name.gemspec and modify the following sections:
	- spec.summary - A short summary of the gem's purpose.
	- spec.description - A longer description of the gem.
	- spec.authors and spec.email - Author and contact information.
	- spec.homepage - The homepage URL (if applicable).
	- Ensure spec.files and spec.require_paths are correct.

### 5. **Create the main file for your gem**
- Navigate to the lib/my_gem_name.rb file. This is the main file for your gem.

- **Editing main file (lib/my_gem_name.rb)**:
	- Define your gem's main classes/modules.
	- Require additional files if needed.

	Example structure of lib/my_gem_name.rb:
	ruby
	module MyGemName
		class MainClass
			def self.greet
				"Hello, world!"
			end
		end
	end


### 6. **Add dependencies (optional)**
- Edit the my_gem_name.gemspec to add any dependencies your gem needs:
	ruby
	spec.add_runtime_dependency "some_dependency", "~> 1.0"


### 7. **Install development dependencies**
bash
bundle install


### 8. **Write tests**
- Create or edit files in the spec/ directory. Use RSpec or another testing framework.

	**Example of a simple test using RSpec (spec/my_gem_name_spec.rb)**:
	ruby
	require 'my_gem_name'

	RSpec.describe MyGemName::MainClass do
		it "greets the world" do
			expect(MyGemName::MainClass.greet).to eq("Hello, world!")
		end
	end


### 9. **Run tests**
bash
rspec


### 10. **Build the gem**
bash
gem build my_gem_name.gemspec

- This will generate a .gem file that can be pushed to a repository or installed locally.

### 11. **Install the gem locally (for testing)**
bash
gem install ./my_gem_name-0.1.0.gem


### 12. **Push the gem to RubyGems (optional)**
- If you want to release your gem publicly:
	1. **Log in to RubyGems**:
		 bash
		 gem signin

	2. **Push your gem**:
		 bash
		 gem push my_gem_name-0.1.0.gem


### 13. **Update your gem (if needed)**
- If you make changes, increment the version in lib/my_gem_name/version.rb, rebuild the gem, and push the new version:
	bash
	gem build my_gem_name.gemspec
	gem push my_gem_name-0.1.1.gem


---

### Summary of Commands and Actions:
1. bundle gem my_gem_name – Generate gem skeleton.
2. cd my_gem_name – Move to the project directory.
3. git init && git add . && git commit -m "Initial commit" – Initialize Git repository.
4. **Edit my_gem_name.gemspec** – Modify gemspec information.
5. **Edit lib/my_gem_name.rb** – Define your gem's functionality.
6. **Edit my_gem_name.gemspec** – Add dependencies.
7. bundle install – Install development dependencies.
8. **Edit/create files in spec/** – Write tests.
9. rspec – Run tests.
10. gem build my_gem_name.gemspec – Build the gem.
11. gem install ./my_gem_name-0.1.0.gem – Install the gem locally.
12. gem signin && gem push my_gem_name-0.1.0.gem – Push the gem to RubyGems (optional).
13. **Update version and rebuild gem** – Increment version and repeat steps for new release.

This covers the core development workflow for a Ruby gem package project.
`;
