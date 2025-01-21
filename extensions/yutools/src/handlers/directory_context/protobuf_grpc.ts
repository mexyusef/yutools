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

export function register_dir_context_create_protobuf_grpc(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_protobuf_grpc`,
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
Here's a detailed list of commands and activities you would invoke to start a gRPC project using Protocol Buffers (protobuf) or Avro from start to finish. This guide assumes you are working in a common programming language like Go, Java, or Python. I'll generalize some parts, but you can adapt it to your specific language and environment.

### **1. Set up your project**
1. **Initialize project folder:**
	bash
	mkdir my-grpc-project
	cd my-grpc-project


2. **Initialize version control (optional but recommended):**
	bash
	git init


### **2. Set up a build tool**
	*If using Maven (Java):*
	bash
	mvn archetype:generate


	*If using Go:*
	bash
	go mod init my-grpc-project


	*If using Python:*
	bash
	python -m venv venv
	source venv/bin/activate


### **3. Install gRPC & Protobuf/Avro dependencies**

3.1. **Install gRPC libraries:**
	*For Java (via Maven):*
	Add the following to your pom.xml:
	xml
	<dependency>
		<groupId>io.grpc</groupId>
		<artifactId>grpc-netty-shaded</artifactId>
		<version>1.x.x</version>
	</dependency>


	*For Go:*
	bash
	go get google.golang.org/grpc


	*For Python:*
	bash
	pip install grpcio grpcio-tools


3.2. **Install Protocol Buffers/Avro library:**
	*For Java (via Maven):*
	Add the following to your pom.xml for protobuf:
	xml
	<dependency>
		<groupId>com.google.protobuf</groupId>
		<artifactId>protobuf-java</artifactId>
		<version>3.x.x</version>
	</dependency>


	Or, for Avro:
	xml
	<dependency>
		<groupId>org.apache.avro</groupId>
		<artifactId>avro</artifactId>
		<version>x.x.x</version>
	</dependency>


	*For Go:*
	bash
	go get github.com/golang/protobuf/proto


	*For Python:*
	bash
	pip install protobuf avro-python3


### **4. Define service and data model (proto/avro file)**

4.1 **Create a directory for proto/avro files:**
	bash
	mkdir proto


4.2 **Write your proto file (for Protobuf) or Avro schema (for Avro):**
	- proto/service.proto for Protobuf
	- avro/service.avsc for Avro

	Example content for service.proto:
	proto
	syntax = "proto3";

	service MyService {
		rpc MyMethod (MyRequest) returns (MyResponse);
	}

	message MyRequest {
		string name = 1;
	}

	message MyResponse {
		string greeting = 1;
	}


	Example content for service.avsc (Avro):
	json
	{
	  "type": "record",
	  "name": "MyService",
	  "fields": [
		 {"name": "name", "type": "string"},
		 {"name": "greeting", "type": "string"}
	  ]
	}


### **5. Generate code from proto/avro**

5.1 **Generate code from Protobuf:**
	bash
	protoc --proto_path=proto --go_out=. --go-grpc_out=. proto/service.proto

	For Java:
	bash
	protoc --java_out=src/main/java --grpc-java_out=src/main/java proto/service.proto


5.2 **Generate code from Avro schema (if using Avro):**
	*For Java:*
	bash
	mvn avro:generate

	*For Python:*
	bash
	python -m avro.schema avro/service.avsc


### **6. Implement business logic (editing main file)**

- **Edit the generated server and client stubs** to add your business logic:
  - Edit my_grpc_service.go for Go.
  - Edit MyServiceImpl.java for Java.
  - Edit my_grpc_service.py for Python.

### **7. Start the server**

7.1 **In the main server file (Go example):**
	go
	lis, err := net.Listen("tcp", ":50051")
	grpcServer := grpc.NewServer()
	pb.RegisterMyServiceServer(grpcServer, &server{})
	grpcServer.Serve(lis)


7.2 **Run the server:**
	bash
	go run my_grpc_service.go


	Or for Java:
	bash
	mvn exec:java -Dexec.mainClass="com.example.MyServiceServer"


	Or for Python:
	bash
	python my_grpc_service.py


### **8. Implement the client (editing client file)**

- **Write the client code** to call the server:
  - Edit my_grpc_client.go for Go.
  - Edit MyServiceClient.java for Java.
  - Edit my_grpc_client.py for Python.

### **9. Run the client**

9.1 **Run the client code:**
	bash
	go run my_grpc_client.go


	Or for Java:
	bash
	mvn exec:java -Dexec.mainClass="com.example.MyServiceClient"


	Or for Python:
	bash
	python my_grpc_client.py


### **10. Testing**

10.1 **Write tests for client and server**:
	- Use your language's testing framework (e.g., JUnit for Java, go test for Go, or pytest for Python).

10.2 **Run tests:**
	bash
	go test ./...

	Or for Java:
	bash
	mvn test


### **11. Build and Deploy (optional)**

11.1 **Build the project:**
	bash
	go build

	Or for Java:
	bash
	mvn package


11.2 **Deploy the server**:
	- Deploy to a cloud provider, containerize with Docker, or run on your local machine.

---

These steps cover a full gRPC/Protobuf or Avro project workflow, from setup to execution and testing.

`;
