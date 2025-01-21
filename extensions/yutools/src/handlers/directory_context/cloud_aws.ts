import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
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
		aws-amplify,d
		aws-cognito,d
		aws-dynamodb,d
		aws-lambda,d
		aws-s3,d
		terraform,d
		run.bat,f(n=ls -al)
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\handlers\\directory_context\\cloud_aws.ts=BACA.md)
`;

export function register_dir_context_create_cloud_aws(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_cloud_aws`,
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
Here’s a step-by-step guide for starting an AWS CLI project, including both the CLI commands and non-CLI activities like file editing. The steps assume you're setting up a basic project that interacts with AWS resources using the CLI.

### 1. **Set Up AWS CLI**

	 - **Install AWS CLI** (if not already installed):
		 bash
		 curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
		 sudo installer -pkg AWSCLIV2.pkg -target /

	 - **Verify Installation**:
		 bash
		 aws --version


### 2. **Configure AWS CLI**

	 - **Set up AWS credentials**:
		 bash
		 aws configure

		 You will be prompted to enter your AWS Access Key ID, Secret Access Key, default region, and default output format.

### 3. **Set Up Project Directory**

	 - **Create a project folder**:
		 bash
		 mkdir my-aws-project
		 cd my-aws-project


### 4. **Initialize Version Control (Optional but Recommended)**

	 - **Initialize a Git repository**:
		 bash
		 git init

	 - **Create a .gitignore file**:
		 <editing .gitignore to ignore files like *.env, *.log, etc.>

### 5. **Set Up Environment Variables (Optional but Common)**

	 - **Create a .env file**:
		 <editing .env to add AWS credentials or region-specific settings, e.g., AWS_REGION=us-west-2>

### 6. **Write Code that Uses AWS SDK or CLI**

	 - **Create main project file (e.g., Python or Node.js script)**:
		 <editing main.py or index.js to interact with AWS services using the AWS SDK>

### 7. **Verify IAM Roles and Policies**

	 - **List current IAM users and roles**:
		 bash
		 aws iam list-users
		 aws iam list-roles

	 - **Create an IAM role** (if needed):
		 bash
		 aws iam create-role --role-name MyRole --assume-role-policy-document file://trust-policy.json


### 8. **Create or Use AWS Resources**

	 Depending on your project, you might want to create resources like an S3 bucket, Lambda function, EC2 instance, etc.

	 - **Create an S3 bucket**:
		 bash
		 aws s3 mb s3://my-aws-project-bucket


	 - **Launch an EC2 instance**:
		 bash
		 aws ec2 run-instances --image-id ami-12345678 --count 1 --instance-type t2.micro --key-name MyKeyPair


### 9. **Use AWS CLI to Manage Resources**

	 - **List S3 buckets**:
		 bash
		 aws s3 ls

	 - **Upload a file to S3**:
		 bash
		 aws s3 cp file.txt s3://my-aws-project-bucket/

	 - **Terminate an EC2 instance**:
		 bash
		 aws ec2 terminate-instances --instance-ids i-1234567890abcdef0


### 10. **Automate Tasks (Optional)**

	 - **Create a shell script to automate resource creation**:
		 <editing create_resources.sh to write shell scripts to automate the provisioning of AWS resources>

	 - **Run the automation script**:
		 bash
		 ./create_resources.sh


### 11. **Deploy Resources (Optional)**

	 - **Using CloudFormation (Infrastructure as Code)**:
		 bash
		 aws cloudformation create-stack --stack-name my-stack --template-body file://template.yaml


	 - **Deploy Lambda function**:
		 bash
		 aws lambda create-function --function-name MyFunction --runtime python3.8 --role arn:aws:iam::account-id:role/MyRole --handler lambda_function.lambda_handler --zip-file fileb://function.zip


### 12. **Test and Debug**

	 - **Test API calls or resource interactions** (example: list S3 bucket contents):
		 bash
		 aws s3 ls s3://my-aws-project-bucket/


### 13. **Tear Down Resources**

	 - **Delete S3 bucket**:
		 bash
		 aws s3 rb s3://my-aws-project-bucket --force

	 - **Delete CloudFormation stack**:
		 bash
		 aws cloudformation delete-stack --stack-name my-stack


	 - **Terminate EC2 instances**:
		 bash
		 aws ec2 terminate-instances --instance-ids i-1234567890abcdef0


### 14. **Document the Project**

	 - **Create a README file**:
		 <editing README.md to explain how to set up and run the project>

### 15. **Version Control and Finalization**

	 - **Add files to Git**:
		 bash
		 git add .
		 git commit -m "Initial commit"

	 - **Push to GitHub or other Git hosting services**:
		 bash
		 git remote add origin https://github.com/username/my-aws-project.git
		 git push -u origin master


This covers the end-to-end process for starting and deploying an AWS CLI project.
`;
