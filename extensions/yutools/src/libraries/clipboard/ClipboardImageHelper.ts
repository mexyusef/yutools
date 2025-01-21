import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const execAsync = promisify(exec);

export class ClipboardImageHelper {
  public static async getImageFromClipboard(): Promise<string | null> {
    try {
      let base64Image: string | null = null;

      switch (process.platform) {
        case 'win32': // Windows
          base64Image = await this.getImageFromClipboardWindows();
          break;
        case 'darwin': // macOS
          base64Image = await this.getImageFromClipboardMacOS();
          break;
        case 'linux': // Linux
          base64Image = await this.getImageFromClipboardLinux();
          break;
        default:
          throw new Error(`Unsupported platform: ${process.platform}`);
      }

      return base64Image;
    } catch (error: any) {
      throw new Error(`Failed to read image from clipboard: ${error.message}`);
    }
  }

  private static async getImageFromClipboardWindows(): Promise<string | null> {
    try {
      // Step 1: Create a temporary file path in the system's temp directory
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, 'clipboard_image.png');

      // Step 2: Use PowerShell to save the clipboard image to the temporary file
      const command = `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::GetImage().Save('${tempFilePath}')"`;
      await execAsync(command);

      // Step 3: Read the temporary file and encode it as base64
      const imageBuffer = fs.readFileSync(tempFilePath);
      const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

      // Step 4: Clean up the temporary file
      fs.unlinkSync(tempFilePath);

      return base64Image;
    } catch (error: any) {
      throw new Error(`Failed to retrieve image from clipboard on Windows: ${error.message}`);
    }
  }

  private static async getImageFromClipboardMacOS(): Promise<string | null> {
    try {
      const command = 'osascript -e "get the clipboard as «class PNGf»"';
      const { stdout } = await execAsync(command);

      if (!stdout) {
        return null; // No image found in the clipboard
      }

      // Convert macOS hex data to base64
      const hexData = stdout.trim().replace(/«|»|class PNGf/g, '');
      const buffer = Buffer.from(hexData, 'hex');
      return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error: any) {
      throw new Error(`Failed to retrieve image from clipboard on macOS: ${error.message}`);
    }
  }

  private static async getImageFromClipboardLinux(): Promise<string | null> {
    try {
      const command = 'xclip -selection clipboard -t image/png -o | base64';
      const { stdout } = await execAsync(command);

      if (!stdout) {
        return null; // No image found in the clipboard
      }

      return `data:image/png;base64,${stdout.trim()}`;
    } catch (error: any) {
      throw new Error(`Failed to retrieve image from clipboard on Linux: ${error.message}`);
    }
  }
}
