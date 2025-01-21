import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { getBasename } from '../file_dir';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { createNewTerminal } from '../terminal';
import { run_fmus_at_specific_dir } from '../fmus_ketik';


const fmus_code_wrapper = `
--% App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Details" component={DetailsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
--#

--% HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>Welcome to the Home Screen!</Text>
			<Button
				title="Go to Details"
				onPress={() => navigation.navigate('Details')}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
--#

--% DetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen() {
	return (
		<View style={styles.container}>
			<Text>This is the Details Screen</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
--#

--% Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress }) {
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<Text style={styles.buttonText}>{title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#3498db',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
});
--#

--% Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createStackNavigator();

export default function Navigation() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Details" component={DetailsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
--#

--% app.json
{
	"expo": {
		"name": "__VAR1__",
		"slug": "__VAR1__",
		"version": "1.0.0",
		"orientation": "portrait",
		"icon": "./assets/icon.png",
		"splash": {
			"image": "./assets/splash.png",
			"resizeMode": "contain",
			"backgroundColor": "#ffffff"
		},
		"updates": {
			"fallbackToCacheTimeout": 0
		},
		"assetBundlePatterns": [
			"**/*"
		],
		"ios": {
			"supportsTablet": true
		},
		"android": {
			"adaptiveIcon": {
				"foregroundImage": "./assets/icon.png",
				"backgroundColor": "#FFFFFF"
			}
		},
		"web": {
			"favicon": "./assets/icon.png"
		}
	}
}
--#
`;

const command_v1 = `npx expo init __VAR1__`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	__VAR1__,d
		assets,d
		components,d
			Button.js,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\react_native.ts=Button.js)
		navigation,d
			Navigation.js,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\react_native.ts=Navigation.js)
		screens,d
			HomeScreen.js,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\react_native.ts=HomeScreen.js)
			DetailsScreen.js,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\react_native.ts=DetailsScreen.js)
		App.js,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\react_native.ts=App.js)
		app.json,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\react_native.ts=app.json)
		run.bat,f(n=npx expo start)
		sim.bat,f(n=npx expo start --android)
		buat.bat,f(n=npx expo build:android)
		pub.bat,f(n=npx expo publish)
		install.bat,f(n=npm install -g expo-cli)
		get.bat,f(n=npx expo install expo-camera)
`;

// MyNewProject/
// │
// ├── assets/                # Place for images, fonts, sounds, etc.
// │   ├── icon.png
// │   ├── splash.png
// │   └── fonts/
// │       └── customFont.ttf
// │
// ├── components/            # Reusable components
// │   ├── Header.js
// │   └── Button.js
// │
// ├── navigation/            # Navigation setup
// │   └── Navigation.js
// │
// ├── screens/               # Screens for different views
// │   ├── HomeScreen.js
// │   └── DetailsScreen.js
// │
// ├── App.js                 # Entry point of your app
// ├── app.json               # Expo configuration file
// ├── package.json           # Project dependencies
// └── .gitignore             # Files to ignore in version control

export async function register_dir_context_create_react_native1(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.dir_context_create_react_native1`, async (uri: vscode.Uri) => {
		const filePath = uri.fsPath;
		const terminal_name = getBasename(filePath)

		const result_map = await processCommandWithMap(command_v1);
		if (result_map === undefined) {
			vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
		} else {
			console.log('Processed Result:', result_map.result);
			console.log('Map:', result_map.map);
			const terminal = createNewTerminal(terminal_name, filePath);
			// expo init
			terminal.sendText(result_map.result);
			// terminal.sendText(applyReplacements(`cd __VAR1__ && npm install @react-navigation/native && npm install react-native-screens react-native-safe-area-context`, result_map.map));
			terminal.sendText(applyReplacements(`cd __VAR1__ && npx expo install @react-navigation/native && npx expo install react-native-screens react-native-safe-area-context`, result_map.map));
			// apply to fmus_command
			const fmus_command_replaced = applyReplacements(fmus_command, result_map.map);
			console.log('New FMUS Command:', fmus_command_replaced);
			run_fmus_at_specific_dir(fmus_command_replaced, filePath);
		}

	});
	context.subscriptions.push(disposable);
}
