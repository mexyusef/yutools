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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\cpp_library.ts=BACA.md)
`;

export function register_dir_context_create_cpp_library(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.register_dir_context_create_cpp_library`, async (uri: vscode.Uri) => {
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
Here's a step-by-step list of commands and activities to start a modern C++ library project from scratch:

1. **Create a project directory** (CLI command):
	bash
	mkdir my_cpp_library
	cd my_cpp_library


2. **Initialize a Git repository** (CLI command):
	bash
	git init


3. **Initialize a CMake project** (Activity + CLI command):
	- Create a CMakeLists.txt file.
	bash
	touch CMakeLists.txt


	**Edit the CMakeLists.txt** (Activity):
	Add content such as:
	cmake
	cmake_minimum_required(VERSION 3.10)
	project(MyCppLibrary VERSION 1.0.0 LANGUAGES CXX)

	add_library(MyCppLibrary src/my_cpp_library.cpp)
	target_include_directories(MyCppLibrary PUBLIC include)
	set(CMAKE_CXX_STANDARD 17)
	set(CMAKE_CXX_STANDARD_REQUIRED True)

	enable_testing()
	add_subdirectory(tests)


4. **Create source and include directories** (CLI command):
	bash
	mkdir src include


5. **Write initial source code** (Activity):
	- Create a source file:
	bash
	touch src/my_cpp_library.cpp

	- Edit my_cpp_library.cpp to include initial code.

6. **Write library headers** (Activity):
	- Create a header file:
	bash
	touch include/my_cpp_library.h

	- Edit my_cpp_library.h to define the public API of your library.

7. **Create test directory** (CLI command):
	bash
	mkdir tests


8. **Add test source files** (Activity):
	- Create a test file:
	bash
	touch tests/test_main.cpp

	- Edit test_main.cpp to write basic tests (e.g., using GoogleTest or Catch2).

9. **Add a CMakeLists.txt file for tests** (Activity):
	- Edit tests/CMakeLists.txt:
	cmake
	add_executable(test_my_cpp_library test_main.cpp)
	target_link_libraries(test_my_cpp_library PRIVATE MyCppLibrary)

	add_test(NAME test_my_cpp_library COMMAND test_my_cpp_library)


10. **Install GoogleTest or another testing framework** (CLI command):
	 - Download or set up GoogleTest, for example:
	 bash
	 git clone https://github.com/google/googletest.git
	 mv googletest tests/googletest


11. **Configure the build system with CMake** (CLI command):
	 bash
	 cmake -S . -B build


12. **Build the project** (CLI command):
	 bash
	 cmake --build build


13. **Run the tests** (CLI command):
	 bash
	 ctest --test-dir build


14. **Install the library** (CLI command):
	 bash
	 sudo cmake --install build


15. **Create a README.md and LICENSE file** (Activity):
	 bash
	 touch README.md LICENSE


16. **Document the project in the README.md** (Activity).

17. **Set up Continuous Integration (CI) pipeline** (Activity + Optional CLI commands):
	 - Edit CI configuration (e.g., .github/workflows/ci.yml for GitHub Actions or .gitlab-ci.yml for GitLab).

18. **Commit and push the changes to a repository** (CLI command):
	 bash
	 git add .
	 git commit -m "Initial commit"
	 git remote add origin <your-repo-url>
	 git push -u origin master


This workflow sets up a modern C++ library project with CMake, tests, and version control.

`;
