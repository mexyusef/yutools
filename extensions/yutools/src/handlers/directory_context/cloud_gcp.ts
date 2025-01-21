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
		main.dart,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\cloud_gcp.ts=BACA.md)
`;

export function register_dir_context_create_cloud_gcp(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.register_dir_context_create_cloud_gcp`,
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
Here’s a step-by-step list of commands and activities you’ll need to invoke or perform when starting a Google Cloud Platform (GCP) project from start to finish, using the Google Cloud CLI (gcloud):

### 1. **Install and Initialize the Google Cloud SDK**
	 - **Command**: Install the SDK from [here](https://cloud.google.com/sdk/docs/install).
	 - **Command**: gcloud init
		 - This will guide you to log in, select your account, and choose an existing project or create a new one.

### 2. **Authenticate with Google Cloud**
	 - **Command**: gcloud auth login
		 - Logs you into your Google Cloud account.

### 3. **Set Default Project and Region**
	 - **Command**: gcloud config set project <PROJECT_ID>
	 - **Command**: gcloud config set compute/region <REGION>
		 - Example: gcloud config set compute/region us-central1

### 4. **Create a New Project** (Optional)
	 - **Command**: gcloud projects create <PROJECT_ID> --set-as-default
		 - Replace <PROJECT_ID> with your desired project name.

### 5. **Enable Required APIs**
	 - **Command**: gcloud services enable <API_NAME>
		 - Example: gcloud services enable compute.googleapis.com (for Compute Engine)
		 - List other APIs as needed: Cloud Storage (storage.googleapis.com), Cloud Functions (cloudfunctions.googleapis.com), etc.

### 6. **Set Up Billing** (Required for Paid Services)
	 - **Command**: gcloud beta billing projects link <PROJECT_ID> --billing-account <BILLING_ACCOUNT_ID>
		 - You need to get your billing account ID from the GCP Console.

### 7. **Create a Service Account** (Optional)
	 - **Command**: gcloud iam service-accounts create <SERVICE_ACCOUNT_NAME> --description="Service account for <purpose>" --display-name="Service Account"

### 8. **Assign Roles to Service Account** (Optional)
	 - **Command**: gcloud projects add-iam-policy-binding <PROJECT_ID> --member="serviceAccount:<SERVICE_ACCOUNT_NAME>@<PROJECT_ID>.iam.gserviceaccount.com" --role="roles/<ROLE_NAME>"
		 - Example: roles/editor or roles/storage.admin.

### 9. **Create Resources (e.g., Virtual Machines, Storage Buckets, Functions)**
	 - **Create a Compute Engine instance (VM)**:
		 - **Command**: gcloud compute instances create <INSTANCE_NAME> --zone=<ZONE> --machine-type=<MACHINE_TYPE> --image-family=<IMAGE_FAMILY> --image-project=<IMAGE_PROJECT>
	 - **Create a Storage Bucket**:
		 - **Command**: gsutil mb -p <PROJECT_ID> gs://<BUCKET_NAME>/
	 - **Create a Cloud Function**:
		 - **Command**: gcloud functions deploy <FUNCTION_NAME> --runtime <RUNTIME> --trigger-http --allow-unauthenticated

### 10. **Editing Main Application Code**
	 - **Activity**: Edit your main application files using your preferred code editor (VS Code, etc.).
	 - **Example**: Editing main.py for a Cloud Function or modifying the configuration files like app.yaml for App Engine.

### 11. **Deploy Application (App Engine or Cloud Run)**
	 - **Command**: gcloud app deploy
		 - For App Engine, this deploys the app.yaml file.
	 - **Command**: gcloud run deploy <SERVICE_NAME> --source . --region <REGION>
		 - For Cloud Run.

### 12. **Verify Deployment**
	 - **Command**: gcloud app browse
		 - Opens the app in your browser if deployed to App Engine.
	 - **Command**: gcloud run services list
		 - Lists services if deployed to Cloud Run.

### 13. **Manage Logs**
	 - **Command**: gcloud logging read "resource.type=<RESOURCE_TYPE>" --limit <LIMIT>
		 - Example for Compute Engine: gcloud logging read "resource.type=gce_instance" --limit 10.

### 14. **Shut Down Resources**
	 - **Delete a VM**:
		 - **Command**: gcloud compute instances delete <INSTANCE_NAME> --zone=<ZONE>
	 - **Delete a Cloud Function**:
		 - **Command**: gcloud functions delete <FUNCTION_NAME>
	 - **Delete a Storage Bucket**:
		 - **Command**: gsutil rm -r gs://<BUCKET_NAME>/

### 15. **Project Cleanup (Delete Project)**
	 - **Command**: gcloud projects delete <PROJECT_ID>
		 - This will delete all resources associated with the project.

---
### Optional/Advanced Steps:
- **Set Up IAM Policies**: To manage access for different users or services.
	- **Command**: gcloud projects add-iam-policy-binding <PROJECT_ID> --member="user:<USER_EMAIL>" --role="roles/<ROLE_NAME>"

This outline covers the essential steps from setting up a project to deploying services and cleaning up resources. Let me know if you'd like additional details on any part!
`;
