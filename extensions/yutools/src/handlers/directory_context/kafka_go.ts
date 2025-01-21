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

export function register_dir_context_create_kafka_go(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_kafka_go`,
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
Here’s a step-by-step guide to starting an Apache Kafka project from scratch, covering CLI commands, configuration, and development activities in a popular language like Java.

### 1. **Setup Kafka Environment**

- **Install Apache Kafka** (on your local machine or a server)
  - Download Kafka:
	bash
	wget https://dlcdn.apache.org/kafka/3.5.1/kafka_2.13-3.5.1.tgz

  - Extract Kafka:
	bash
	tar -xzf kafka_2.13-3.5.1.tgz

  - Move to Kafka directory:
	bash
	cd kafka_2.13-3.5.1


- **Start Zookeeper** (required by Kafka):
	bash
	bin/zookeeper-server-start.sh config/zookeeper.properties


- **Start Kafka Broker**:
	bash
	bin/kafka-server-start.sh config/server.properties


### 2. **Kafka Topic Management**

- **Create a topic**:
	bash
	bin/kafka-topics.sh --create --topic my-topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1


- **List topics**:
	bash
	bin/kafka-topics.sh --list --bootstrap-server localhost:9092


- **Describe a topic**:
	bash
	bin/kafka-topics.sh --describe --topic my-topic --bootstrap-server localhost:9092


### 3. **Kafka Producer and Consumer (Testing)**

- **Start a Kafka Producer**:
	bash
	bin/kafka-console-producer.sh --topic my-topic --bootstrap-server localhost:9092


- **Start a Kafka Consumer**:
	bash
	bin/kafka-console-consumer.sh --topic my-topic --from-beginning --bootstrap-server localhost:9092


### 4. **Start Java Development**

- **Install Maven** (if not installed):
	bash
	sudo apt-get install maven


- **Create Maven Project**:
	bash
	mvn archetype:generate -DgroupId=com.example.kafka -DartifactId=kafka-example -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false


- **Navigate to project directory**:
	bash
	cd kafka-example


- **Edit pom.xml** to include Kafka dependencies:
	xml
	<dependencies>
	  <dependency>
		<groupId>org.apache.kafka</groupId>
		<artifactId>kafka-clients</artifactId>
		<version>3.5.1</version>
	  </dependency>
	</dependencies>


### 5. **Implement Kafka Producer (in Java)**

- **Create Producer class**:
	- **Edit src/main/java/com/example/kafka/Producer.java** and write Kafka producer code.
	Example producer:
	java
	import org.apache.kafka.clients.producer.*;

	import java.util.Properties;

	public class Producer {
		public static void main(String[] args) {
			Properties props = new Properties();
			props.put("bootstrap.servers", "localhost:9092");
			props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
			props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

			Producer<String, String> producer = new KafkaProducer<>(props);

			for (int i = 0; i < 10; i++) {
				producer.send(new ProducerRecord<>("my-topic", Integer.toString(i), "Message-" + i));
			}

			producer.close();
		}
	}


### 6. **Implement Kafka Consumer (in Java)**

- **Create Consumer class**:
	- **Edit src/main/java/com/example/kafka/Consumer.java** and write Kafka consumer code.
	Example consumer:
	java
	import org.apache.kafka.clients.consumer.ConsumerRecord;
	import org.apache.kafka.clients.consumer.ConsumerRecords;
	import org.apache.kafka.clients.consumer.KafkaConsumer;

	import java.time.Duration;
	import java.util.Collections;
	import java.util.Properties;

	public class Consumer {
		public static void main(String[] args) {
			Properties props = new Properties();
			props.put("bootstrap.servers", "localhost:9092");
			props.put("group.id", "test-group");
			props.put("enable.auto.commit", "true");
			props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
			props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

			KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
			consumer.subscribe(Collections.singletonList("my-topic"));

			while (true) {
				ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
				for (ConsumerRecord<String, String> record : records) {
					System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
				}
			}
		}
	}


### 7. **Build the Project**

- **Build the Maven project**:
	bash
	mvn clean install


### 8. **Run the Producer and Consumer**

- **Run the Producer**:
	bash
	java -cp target/kafka-example-1.0-SNAPSHOT.jar com.example.kafka.Producer


- **Run the Consumer**:
	bash
	java -cp target/kafka-example-1.0-SNAPSHOT.jar com.example.kafka.Consumer


### 9. **Kafka Monitoring (Optional)**

- **View Kafka metrics**:
	bash
	bin/kafka-run-class.sh kafka.tools.JmxTool --jmx-url service:jmx:rmi:///jndi/rmi://localhost:9999/jmxrmi --object-name kafka.server:type=BrokerTopicMetrics,name=AllTopicsMessagesInPerSec


### 10. **Cleanup**

- **Stop Kafka Broker**:
	bash
	bin/kafka-server-stop.sh


- **Stop Zookeeper**:
	bash
	bin/zookeeper-server-stop.sh


This list includes commands as well as necessary development steps like editing files to build a complete Kafka-based application.

`;
