// test/tools.test.ts

import {
  FileDeleteTool, DataVisualizationTool,
  MachineLearningTool, DatabaseTool,
  FileUploadTool, DataValidationTool,
  FileDownloadTool, DataTransformationTool,
  EncryptionTool, CompressionTool, AuthenticationToolFirebase, LoggingToolWinston,
  FileSyncTool, DataAggregationTool,
  AuthenticationTool, LoggingTool,
  EmailTool, NotificationTool,
  APITool, FileProcessingTool,
  DataAnalysisTool, ChatbotTool,
  AudioProcessingTool, DocumentProcessingTool,
  VideoProcessingTool, TranslationTool, ImageProcessingTool, TextToSpeechTool, SpeechToTextTool, VisitWebpageTool,
  DataExportTool,
  FileRenameTool,
  DataImportTool,
  FileCopyTool,
  FileMoveTool,
  DataMergeTool,
  FileCompressTool,
  DataFilterTool,
  FileEncryptTool,
  DataSortTool,
  FileDecryptTool,
  DataGroupTool,
  FileHashTool,
  DataPivotTool,
  FileMetadataTool,
  DataNormalizationTool

} from "../tools";

// Create instances of the tools
const imageProcessingTool = new ImageProcessingTool();
const textToSpeechTool = new TextToSpeechTool();
const speechToSpeechTool = new SpeechToTextTool();
const visitWebpageTool = new VisitWebpageTool();

// Test the ImageProcessingTool
const fakeImage = Buffer.from("fake image data");
imageProcessingTool.execute({ image: fakeImage, options: {} })
  .then(result => console.log("Image processing result:", result))
  .catch((error: any) => console.error(error));


// Test the ImageProcessingTool
const fakeImage2 = Buffer.from("fake image data");
imageProcessingTool.execute({ image: fakeImage2, options: { width: 100, height: 100 } })
  .then(result => console.log("Image processing result:", result))
  .catch((error: any) => console.error(error));


// Test the TextToSpeechTool
textToSpeechTool.execute({ text: "Hello, world!" })
  .then(result => console.log("Text-to-speech result:", result))
  .catch((error: any) => console.error(error));

// Test the SpeechToTextTool
const fakeAudio = Buffer.from("fake audio data");
speechToSpeechTool.execute({ audio: fakeAudio })
  .then(result => console.log("Speech-to-text result:", result))
  .catch((error: any) => console.error(error));

// Test the VisitWebpageTool
visitWebpageTool.execute({ url: "https://example.com" })
  .then(result => console.log("Webpage content:", result))
  .catch((error: any) => console.error(error));




// Create instances of the tools
const videoProcessingTool = new VideoProcessingTool();
const translationTool = new TranslationTool();
// const textToSpeechTool = new TextToSpeechTool();
// const imageProcessingTool = new ImageProcessingTool();

// Test the VideoProcessingTool
const fakeVideo = Buffer.from("fake video data");
videoProcessingTool.execute({ video: fakeVideo, options: {} })
  .then(result => console.log("Video processing result:", result))
  .catch((error: any) => console.error(error));

// Test the TranslationTool
translationTool.execute({ text: "Hello, world!", targetLanguage: "es" })
  .then(result => console.log("Translation result:", result))
  .catch((error: any) => console.error(error));

// Test the TextToSpeechTool
textToSpeechTool.execute({ text: "Hello, world!" })
  .then(result => console.log("Text-to-speech result:", result))
  .catch((error: any) => console.error(error));

const documentProcessingTool = new DocumentProcessingTool();
const audioProcessingTool = new AudioProcessingTool();

// Test the AudioProcessingTool
const fakeAudio2 = Buffer.from("fake audio data");
audioProcessingTool.execute({ audio: fakeAudio2, options: {} })
  .then(result => console.log("Audio processing result:", result))
  .catch((error: any) => console.error(error));

// Test the DocumentProcessingTool
const fakeDocument = Buffer.from("fake document data");
documentProcessingTool.execute({ document: fakeDocument, options: {} })
  .then(result => console.log("Document processing result:", result))
  .catch((error: any) => console.error(error));

// Test the TranslationTool
translationTool.execute({ text: "Hello, world!", targetLanguage: "es" })
  .then(result => console.log("Translation result:", result))
  .catch((error: any) => console.error(error));

// Test the VideoProcessingTool
const fakeVideo2 = Buffer.from("fake video data");
videoProcessingTool.execute({ video: fakeVideo2, options: { width: 640, height: 480 } })
  .then(result => console.log("Video processing result:", result))
  .catch((error: any) => console.error(error));

const dataAnalysisTool = new DataAnalysisTool();
const chatbotTool = new ChatbotTool();

// Test the DataAnalysisTool
const fakeData = [1, 2, 3, 4, 5];
dataAnalysisTool.execute({ data: fakeData, options: {} })
  .then(result => console.log("Data analysis result:", result))
  .catch((error: any) => console.error(error));

// Test the ChatbotTool
chatbotTool.execute({ message: "Hello, chatbot!" })
  .then(result => console.log("Chatbot response:", result))
  .catch((error: any) => console.error(error));
//
// test/tools.test.ts

// Create instances of the tools
const machineLearningTool = new MachineLearningTool();
const databaseTool = new DatabaseTool();
// const dataAnalysisTool = new DataAnalysisTool();
// const chatbotTool = new ChatbotTool();

// Test the MachineLearningTool
const fakeInput = { feature1: 1, feature2: 2 };
machineLearningTool.execute({ input: fakeInput, options: {} })
  .then(result => console.log("Machine learning result:", result))
  .catch((error: any) => console.error(error));

// Test the DatabaseTool
const fakeQuery = "SELECT * FROM users";
databaseTool.execute({ query: fakeQuery, options: {} })
  .then(result => console.log("Database result:", result))
  .catch((error: any) => console.error(error));


// Test the MachineLearningTool
machineLearningTool.loadModel("file://path/to/your/model.json")
  .then(() => machineLearningTool.execute({ input: [[1, 2, 3]], options: {} }))
  .then(result => console.log("Machine learning result:", result))
  .catch((error: any) => console.error(error));

// Test the DatabaseTool
// databaseTool.connect("mongodb://localhost:27017/your-database")
//   .then(() => databaseTool.execute({ query: {}, options: {} }))
//   .then(result => console.log("Database result:", result))
//   .catch((error: any) => console.error(error));

// Test the DatabaseTool
databaseTool.connect("mongodb://localhost:27017/your-database")
  .then(() => databaseTool.execute({ query: "SELECT * FROM users", options: {} })) // Pass a valid query string
  .then(result => console.log("Database result:", result))
  .catch((error: any) => console.error(error));
  
// Test the DataAnalysisTool
const fakeData2 = [{ value: 1 }, { value: 2 }, { value: 3 }];
dataAnalysisTool.execute({ data: fakeData2, options: {} })
  .then(result => console.log("Data analysis result:", result))
  .catch((error: any) => console.error(error));

// Test the ChatbotTool
chatbotTool.execute({ message: "Hello, chatbot!" })
  .then(result => console.log("Chatbot response:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const apiTool = new APITool();
const fileProcessingTool = new FileProcessingTool();
// Test the APITool
apiTool.execute({ method: "GET", url: "https://jsonplaceholder.typicode.com/todos/1" })
  .then(result => console.log("API result:", result))
  .catch((error: any) => console.error(error));

// Test the FileProcessingTool
fileProcessingTool.execute({ filePath: "test.txt", operation: "write", data: "Hello, world!" })
  .then(result => console.log("File write result:", result))
  .catch((error: any) => console.error(error));

fileProcessingTool.execute({ filePath: "test.txt", operation: "read" })
  .then(result => console.log("File read result:", result))
  .catch((error: any) => console.error(error));
//
const emailTool = new EmailTool();
const notificationTool = new NotificationTool();
// Test the EmailTool
emailTool.execute({ to: "recipient@example.com", subject: "Test Email", text: "This is a test email." })
  .then(result => console.log("Email result:", result))
  .catch((error: any) => console.error(error));

// Test the NotificationTool
notificationTool.execute({ token: "your-device-token", title: "Test Notification", body: "This is a test notification." })
  .then(result => console.log("Notification result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const authenticationTool = new AuthenticationTool("your-secret-key");
const loggingTool = new LoggingTool("logs.txt");
// Test the AuthenticationTool
authenticationTool.execute({ userId: "123", payload: { role: "admin" } })
  .then(result => console.log("Authentication result:", result))
  .catch((error: any) => console.error(error));

// Test the LoggingTool
loggingTool.execute({ message: "This is a test log entry.", level: "INFO" })
  .then(result => console.log("Logging result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const encryptionTool = new EncryptionTool("your-secret-key");
const compressionTool = new CompressionTool();
const authenticationToolFirebase = new AuthenticationToolFirebase();
const loggingToolWinston = new LoggingToolWinston();

// Test the EncryptionTool
encryptionTool.execute({ data: "Hello, world!" })
  .then(result => console.log("Encryption result:", result))
  .catch((error: any) => console.error(error));

// Test the CompressionTool
compressionTool.execute({ data: "Hello, world!" })
  .then(result => console.log("Compression result:", result))
  .catch((error: any) => console.error(error));

// Test the AuthenticationTool
authenticationToolFirebase.createUser({ email: "test@example.com", password: "password123" })
  .then(result => console.log("User creation result:", result))
  .catch((error: any) => console.error(error));

// Test the LoggingTool
loggingToolWinston.execute({ message: "This is a test log entry.", level: "info" })
  .then(result => console.log("Logging result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileUploadTool = new FileUploadTool("your-bucket-name");
const dataValidationTool = new DataValidationTool();

// Test the FileUploadTool
const fakeFile = Buffer.from("fake file data");
fileUploadTool.execute({ file: fakeFile, destination: "test.txt" })
  .then(result => console.log("File upload result:", result))
  .catch((error: any) => console.error(error));

// Test the DataValidationTool
import Joi from "joi";
const schema = {
  name: Joi.string().required(),
  age: Joi.number().min(18).required(),
};
const data = { name: "John Doe", age: 25 };
dataValidationTool.execute({ data: data, schema: schema })
  .then(result => console.log("Data validation result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileDownloadTool = new FileDownloadTool("your-bucket-name");
const dataTransformationTool = new DataTransformationTool();

// Test the FileDownloadTool
fileDownloadTool.execute({ filePath: "test.txt" })
  .then(result => console.log("File download result:", result))
  .catch((error: any) => console.error(error));

// Test the DataTransformationTool
const data_for_transformation = [1, 2, 3, 4, 5];
const transform = (item: number) => item * 2;
dataTransformationTool.execute({ data: data_for_transformation, transform: transform })
  .then(result => console.log("Data transformation result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileSyncTool = new FileSyncTool("your-bucket-name");
const dataAggregationTool = new DataAggregationTool();

// Test the FileSyncTool
fileSyncTool.execute({ localPath: "local-file.txt", remotePath: "remote-file.txt" })
  .then(result => console.log("File sync result:", result))
  .catch((error: any) => console.error(error));

// Test the DataAggregationTool
const data_for_aggregation = [1, 2, 3, 4, 5];
dataAggregationTool.execute({ data: data_for_aggregation, operation: "sum" })
  .then(result => console.log("Data aggregation result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileDeleteTool = new FileDeleteTool("your-bucket-name");
const dataVisualizationTool = new DataVisualizationTool();

// Test the FileDeleteTool
fileDeleteTool.execute({ filePath: "remote-file.txt" })
  .then(result => console.log("File delete result:", result))
  .catch((error: any) => console.error(error));

// Test the DataVisualizationTool
const data_for_visualization = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 30 },
];
dataVisualizationTool.execute({ data: data_for_visualization, options: { type: "bar", label: "Sample Data" } })
  .then(result => console.log("Data visualization result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileRenameTool = new FileRenameTool("your-bucket-name");
const dataExportTool = new DataExportTool();

// Test the FileRenameTool
fileRenameTool.execute({ oldPath: "old-file.txt", newPath: "new-file.txt" })
  .then(result => console.log("File rename result:", result))
  .catch((error: any) => console.error(error));

// Test the DataExportTool
const data_to_export = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
];
dataExportTool.execute({ data: data_to_export, format: "csv", filePath: "export.csv" })
  .then(result => console.log("Data export result:", result))
  .catch((error: any) => console.error(error));
//
// test/tools.test.ts
// Create instances of the tools
const fileCopyTool = new FileCopyTool("your-bucket-name");
const dataImportTool = new DataImportTool();

// Test the FileCopyTool
fileCopyTool.execute({ sourcePath: "source-file.txt", destinationPath: "destination-file.txt" })
  .then(result => console.log("File copy result:", result))
  .catch((error: any) => console.error(error));

// Test the DataImportTool
dataImportTool.execute({ filePath: "data.csv", format: "csv" })
  .then(result => console.log("Data import result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileMoveTool = new FileMoveTool("your-bucket-name");
const dataMergeTool = new DataMergeTool();

// Test the FileMoveTool
fileMoveTool.execute({ sourcePath: "source-file.txt", destinationPath: "destination-file.txt" })
  .then(result => console.log("File move result:", result))
  .catch((error: any) => console.error(error));

// Test the DataMergeTool
const datasets = [
  [{ name: "John", age: 30 }, { name: "Jane", age: 25 }],
  [{ name: "Alice", age: 28 }],
];
dataMergeTool.execute({ datasets: datasets, options: { type: "array" } })
  .then(result => console.log("Data merge result:", result))
  .catch((error: any) => console.error(error));
//

// Create instances of the tools
const fileCompressTool = new FileCompressTool();
const dataFilterTool = new DataFilterTool();

// Test the FileCompressTool
fileCompressTool.execute({ files: ["file1.txt", "file2.txt"], outputPath: "archive.zip" })
  .then(result => console.log("File compress result:", result))
  .catch((error: any) => console.error(error));

// Test the DataFilterTool
const data_filter = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Alice", age: 28 },
];
dataFilterTool.execute({ data: data_filter, criteria: (item) => item.age > 26 })
  .then(result => console.log("Data filter result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileEncryptTool = new FileEncryptTool("your-secret-key");
const dataSortTool = new DataSortTool();

// Test the FileEncryptTool
fileEncryptTool.execute({ filePath: "file.txt", outputPath: "file.enc" })
  .then(result => console.log("File encrypt result:", result))
  .catch((error: any) => console.error(error));

// Test the DataSortTool
const data_sort_tool = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Alice", age: 28 },
];
dataSortTool.execute({ data: data_sort_tool, sortBy: "age", order: "asc" })
  .then(result => console.log("Data sort result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileDecryptTool = new FileDecryptTool("your-secret-key");
const dataGroupTool = new DataGroupTool();

// Test the FileDecryptTool
fileDecryptTool.execute({ filePath: "file.enc", outputPath: "file.txt" })
  .then(result => console.log("File decrypt result:", result))
  .catch((error: any) => console.error(error));

// Test the DataGroupTool
const data_group_tool = [
  { name: "John", age: 30, city: "New York" },
  { name: "Jane", age: 25, city: "Los Angeles" },
  { name: "Alice", age: 28, city: "New York" },
];
dataGroupTool.execute({ data: data_group_tool, groupBy: "city" })
  .then(result => console.log("Data group result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileHashTool = new FileHashTool();
const dataPivotTool = new DataPivotTool();

// Test the FileHashTool
fileHashTool.execute({ filePath: "file.txt", algorithm: "sha256" })
  .then(result => console.log("File hash result:", result))
  .catch((error: any) => console.error(error));

// Test the DataPivotTool
const data_pivot_tool = [
  { category: "A", value: 10 },
  { category: "B", value: 20 },
  { category: "A", value: 30 },
];
dataPivotTool.execute({ data: data_pivot_tool, pivotBy: "category", valueField: "value" })
  .then(result => console.log("Data pivot result:", result))
  .catch((error: any) => console.error(error));
//
// Create instances of the tools
const fileMetadataTool = new FileMetadataTool();
const dataNormalizationTool = new DataNormalizationTool();

// Test the FileMetadataTool
fileMetadataTool.execute({ filePath: "file.txt" })
  .then(result => console.log("File metadata result:", result))
  .catch((error: any) => console.error(error));

// Test the DataNormalizationTool
const data_for_normalization = [10, 20, 30, 40, 50];
dataNormalizationTool.execute({ data: data_for_normalization, min: 0, max: 1 })
  .then(result => console.log("Data normalization result:", result))
  .catch((error: any) => console.error(error));
//
//
//
//
//
