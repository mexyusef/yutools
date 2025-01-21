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

export function register_dir_context_create_mqtt_go(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_mqtt_go`,
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
Here’s a general list of steps and commands you’d follow to start an MQTT protocol with a popular language, such as Python, JavaScript (Node.js), or C++, from start to finish. I’ll use Python as an example, but the process can easily be adapted for other languages.

---

### 1. **Set up the Development Environment**

#### a. **Create a project directory**
bash
mkdir mqtt_project
cd mqtt_project


#### b. **Initialize a virtual environment (Python example)**
bash
python3 -m venv venv
source venv/bin/activate  # For Unix/macOS
# OR
venv\\Scripts\\activate  # For Windows


---

### 2. **Install the MQTT Library**

#### a. **Install an MQTT client library (like paho-mqtt for Python)**
bash
pip install paho-mqtt


For Node.js (with mqtt package):
bash
npm install mqtt


For C++ (you may need to install libraries like [MQTT-C++](https://github.com/redboltz/mqtt_cpp)):
bash
sudo apt-get install libpaho-mqttpp-dev


---

### 3. **Editing the Main File**

#### a. **Create the main Python file**
bash
touch mqtt_client.py

*Open this file in your preferred editor (e.g., vim, VSCode, Sublime).*

---

### 4. **Code the MQTT Client**

#### a. **Edit mqtt_client.py** (For Python):
Add the code for connecting to an MQTT broker and subscribing/publishing.

python
import paho.mqtt.client as mqtt

# Define the callbacks
def on_connect(client, userdata, flags, rc):
	print(f"Connected with result code {rc}")
	client.subscribe("test/topic")

def on_message(client, userdata, msg):
	print(f"Message received: {msg.topic} {msg.payload.decode()}")

# Setup client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("broker.hivemq.com", 1883, 60)

# Start the loop
client.loop_forever()


---

### 5. **Run the Client**

#### a. **Run the script to test the MQTT client**
bash
python mqtt_client.py


---

### 6. **Testing MQTT Broker**

#### a. **Publish a message to test the subscription**
Open a separate terminal window or use an MQTT client tool (e.g., mosquitto_pub for the command line or MQTTBox for GUI).

**Using mosquitto_pub:**
bash
mosquitto_pub -h broker.hivemq.com -t "test/topic" -m "Hello MQTT!"


---

### 7. **Testing and Debugging**

- **Check console output** in the running mqtt_client.py. You should see the message that was published.
- If there are any issues, you can inspect connection errors, message receipts, or use logging for deeper analysis.

---

### 8. **Cleanup and Additional Configuration**

#### a. **Edit main file for QoS, retained messages, or SSL (optional)**
If needed, you can modify your mqtt_client.py to use more advanced MQTT features like QoS, retain flags, or SSL/TLS for secure connections.

---

### 9. **Closing the Client**

#### a. **Stop the client loop and disconnect (optional)**
In the script, you can add:
python
client.loop_stop()
client.disconnect()


---

This workflow can be applied to most MQTT-based projects with a few variations depending on the language or broker. If you want me to give you a specific guide for another language, feel free to ask!

`;
