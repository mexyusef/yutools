import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

/**
 * Ensures that the directory for the destination file exists.
 *
 * @param filePath - The full path to the destination file.
 */
async function ensureDirectoryExists(filePath: string): Promise<void> {
	const directory = path.dirname(filePath);
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
}

/**
 * Downloads a file from a GCP bucket to a local destination.
 *
 * @param bucketName - The name of the GCP bucket.
 * @param srcFilename - The name of the source file in the bucket.
 * @param destFilename - The local destination file path.
 */
export async function downloadFromGCPBucket(
	bucketName: string,
	srcFilename: string,
	destFilename: string
): Promise<void> {
	const storage = new Storage();
	await ensureDirectoryExists(destFilename);

	console.log(`Downloading ${srcFilename} from bucket ${bucketName}...`);
	await storage.bucket(bucketName).file(srcFilename).download({
		destination: destFilename,
	});
	console.log(`Downloaded to ${destFilename}`);
}

/**
 * Downloads a file directly from a URL to a local destination.
 *
 * @param fileUrl - The URL of the file to download.
 * @param destFilename - The local destination file path.
 */
export async function downloadUsingURL(fileUrl: string, destFilename: string): Promise<void> {
	await ensureDirectoryExists(destFilename);

	const response = await axios.get(fileUrl, { responseType: 'stream' });
	const writer = fs.createWriteStream(destFilename);

	console.log(`Downloading file from URL: ${fileUrl}`);
	return new Promise((resolve, reject) => {
		response.data.pipe(writer);
		writer.on('finish', () => {
			console.log(`Downloaded to ${destFilename}`);
			resolve();
		});
		writer.on('error', reject);
	});
}

// import { downloadFromGCPBucket, downloadUsingURL } from './cloud-storage';

// 1. Download a file from a GCP bucket
downloadFromGCPBucket('my-bucket', 'path/in/bucket/file.txt', '/local/path/file.txt')
	.then(() => console.log('File downloaded from GCP bucket!'))
	.catch(console.error);

// 2. Download a file from a URL
downloadUsingURL('https://example.com/file.txt', '/local/path/file.txt')
	.then(() => console.log('File downloaded from URL!'))
	.catch(console.error);
