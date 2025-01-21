import * as path from 'path';

export function is_image_file(filePath: string): boolean {
	const imageFileExtensions = new Set([
		'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico',
	]);
	const extension = path.extname(filePath).toLowerCase();
	return imageFileExtensions.has(extension);
}