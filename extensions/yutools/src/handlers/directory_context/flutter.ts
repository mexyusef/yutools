import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { getBasename } from '../file_dir';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { createNewTerminal } from '../terminal';
import { run_fmus_at_specific_dir } from '../fmus_ketik';


const fmus_code_wrapper = `
--% lib/main.dart
import 'package:flutter/material.dart';
import 'screens/home_screen.dart'; // Importing the HomeScreen

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
	return MaterialApp(
	  title: 'Flutter Demo',
	  theme: ThemeData(
		primarySwatch: Colors.blue,
	  ),
	  home: HomeScreen(), // Setting HomeScreen as the initial screen
	);
  }
}
--#

--% lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import '../widgets/custom_widget.dart'; // Importing the custom widget

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
	return Scaffold(
	  appBar: AppBar(
		title: Text('Home Screen'),
	  ),
	  body: Center(
		child: CustomWidget(text: 'Hello from Custom Widget!'), // Using CustomWidget
	  ),
	);
  }
}
--#

--% lib/widgets/custom_widget.dart
import 'package:flutter/material.dart';

class CustomWidget extends StatelessWidget {
  final String text; // Custom text passed to the widget

  CustomWidget({required this.text});

  @override
  Widget build(BuildContext context) {
	return Container(
	  padding: EdgeInsets.all(16.0),
	  decoration: BoxDecoration(
		color: Colors.blueAccent,
		borderRadius: BorderRadius.circular(8.0),
	  ),
	  child: Text(
		text,
		style: TextStyle(color: Colors.white, fontSize: 18),
	  ),
	);
  }
}
--#
`;
const command_v1 = `flutter create __VAR1__`;
const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	__VAR1__,d
		lib,d
			screens,d
				home_screen.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\flutter.ts=lib/screens/home_screen.dart)
			widgets,d
				custom_widget.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\flutter.ts=lib/widgets/custom_widget.dart)
			main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\flutter.ts=lib/main.dart)
		get.bat,f(n=flutter pub get)
		run.bat,f(n=flutter run)
		test.bat,f(n=flutter test)
		buat.bat,f(n=flutter build apk --release)
`;

export async function register_dir_context_create_flutter1(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.dir_context_create_flutter1`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath)
			const result_map = await processCommandWithMap(command_v1);
			if (result_map === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			} else {
				console.log('Processed Result:', result_map.result);
				console.log('Map:', result_map.map);
				// apply to fmus_command
				const fmus_command_replaced = applyReplacements(fmus_command, result_map.map);
				console.log('New Processed Command:', fmus_command_replaced);

				const terminal = createNewTerminal(terminal_name, filePath);
				terminal.sendText(result_map.result);
				run_fmus_at_specific_dir(fmus_command_replaced, filePath);
				terminal.sendText(applyReplacements(`cd __VAR1__ && dir *.bat`, result_map.map));
			}


			// if (setelah_proses === undefined) {
			// 	vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			// } else {
			// 	const terminal = createNewTerminal(terminal_name, filePath);
			// 	// terminal.sendText(`echo siap mulai bekerja go echo, dengan giat, dg echo`);
			// 	// terminal.sendText(`apakah undefined => [${setelah_proses}]`); // jangan ada > di terminal
			// 	terminal.sendText(setelah_proses);
			// 	run_fmus_at_specific_dir(fmus_command, filePath);
			// 	terminal.sendText(`dir *.bat`);
			// }

		});
	context.subscriptions.push(disposable);
}
