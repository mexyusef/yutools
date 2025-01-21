import { execSync } from "child_process";
import { readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { promises as fs } from "fs";
import { GenerativePart } from "./GenerativePart";
import { exec } from "child_process";
// import { tmpdir } from "os";
// import { join } from "path";

/**
 * Generates a GenerativePart object from an image file path.
 * @param {string} filePath - The path to the image file.
 * @returns {Promise<GenerativePart>} - A promise resolving to the GenerativePart object.
 */
export async function generateGenerativePartFromFile(filePath: string, mimeType = "image/png"): Promise<GenerativePart> {
  const data = await readFile(filePath, { encoding: "base64" });
  // const mimeType = "image/png"; // You can extend this to dynamically determine mimeType based on the file extension.
  return {
    inlineData: {
      data,
      mimeType
    }
  };
}


/**
 * Generates a GenerativePart object from an image file path.
 * @param {string} filePath - The path to the image file.
 * @returns {Promise<GenerativePart>} - A promise resolving to the GenerativePart object.
 */
export async function generateGenerativePartFromFileSafe(filePath: string, mimeType = "image/png"): Promise<GenerativePart> {
  try {
    await fs.access(filePath); // Checks if the file exists and is accessible.
  } catch {
    throw new Error(`File not found or inaccessible: ${filePath}`);
  }

  const fileData = await fs.readFile(filePath);
  // const mimeType = "image/png"; // Extend to infer MIME type dynamically if needed.
  return {
    inlineData: {
      data: fileData.toString("base64"),
      mimeType,
    },
  };
}


/**
 * Creates a temporary file path in the system's temp directory with a timestamped filename.
 * @param {string} extension - The file extension (e.g., ".png").
 * @returns {string} - The temporary file path.
 */
export function createTemporaryFile(extension = ".png") {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");
  const tempFilePath = join(tmpdir(), `clipboard_image_${timestamp}${extension}`);
  return tempFilePath;
}

/**
 * Saves the clipboard image to a temporary file using PowerShell.
 * @returns {string} - The path to the saved clipboard image.
 * @throws {Error} - If no image is found or an error occurs.
 */
export async function saveClipboardImageToTempFile() {
  const tempFilePath = createTemporaryFile(".png");

  try {
    // PowerShell command to save clipboard image to the temp file
    const command = `
      $image = Get-Clipboard -Format Image;
      if ($image) {
        $image.Save("${tempFilePath}");
        Write-Output "success";
      } else {
        Write-Output "no image";
      }
    `;

    const result = execSync(`powershell -Command "${command}"`, { encoding: "utf8" }).trim();

    if (result === "success") {
      return tempFilePath;
    } else if (result === "no image") {
      throw new Error("No image found in clipboard.");
    } else {
      throw new Error("Unexpected PowerShell output.");
    }
  } catch (error: any) {
    console.error("Failed to save clipboard image:", error.message);
    throw error;
  }
}

/**
 * Reads a file and returns its content as a Buffer.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<Buffer>} - The file's content as a Buffer.
 */
export async function readFileAsBuffer(filePath: string) {
  try {
    const buffer = await readFile(filePath);
    return buffer;
  } catch (error: any) {
    console.error("Failed to read file:", error.message);
    throw error;
  }
}

/**
 * Converts the clipboard image to a Base64 string.
 * @returns {Promise<{ data: string, mimeType: string }>} - The Base64 string and its MIME type.
 */
export async function clipboardImageToBase64_2() {
  try {
    const tempFilePath = await saveClipboardImageToTempFile();

    const buffer = await readFileAsBuffer(tempFilePath);
    const base64Data = buffer.toString("base64");

    // Assuming the clipboard contains PNG images (PowerShell defaults to PNG).
    // const mimeType = "image/png";

    return { data: base64Data };
  } catch (error: any) {
    console.error("Failed to convert clipboard image to Base64:", error.message);
    throw error;
  }
}

export async function clipboardImageToBase64(): Promise<{ data: string; mimeType: string }> {
  const tempFilePath = join(tmpdir(), "clipboard_image.png");

  return new Promise((resolve, reject) => {
    const command = `powershell -command "Add-Type -AssemblyName PresentationCore; ` +
                    `$img = Get-Clipboard -Format Image; ` +
                    `$stream = New-Object IO.FileStream('${tempFilePath}', 'Create'); ` +
                    `$img.Save($stream, 'Png'); ` +
                    `$stream.Close()"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("PowerShell Error:", error.message);
        reject(new Error("Failed to execute PowerShell command."));
        return;
      }
      if (stderr) {
        console.error("PowerShell Stderr:", stderr);
        reject(new Error("PowerShell error: " + stderr));
        return;
      }

      const fs = require("fs");
      try {
        const fileData = fs.readFileSync(tempFilePath);
        fs.unlinkSync(tempFilePath); // Clean up the temp file
        resolve({
          data: Buffer.from(fileData).toString("base64"),
          mimeType: "image/png"
        });
      } catch (readError) {
        reject(new Error("Failed to read temporary image file."));
      }
    });
  });
}

// export async function clipboardImageToBase64(): Promise<{ data: string; mimeType: string }> {
//   return new Promise((resolve, reject) => {
//     exec(
//       'powershell -command "Get-Clipboard -Format Image | Out-File -FilePath <temp_path>;..."',
//       (error, stdout, stderr) => {
//         if (error) {
//           console.error("PowerShell Error:", error.message);
//           reject(new Error("Failed to execute PowerShell command."));
//           return;
//         }
//         if (stderr) {
//           console.error("PowerShell Stderr:", stderr);
//           reject(new Error("Unexpected PowerShell output: " + stderr));
//           return;
//         }
//         try {
//           // Process stdout here
//           resolve({ data: stdout.trim(), mimeType: "image/png" });
//         } catch (processError) {
//           console.error("Processing Error:", processError);
//           reject(new Error("Failed to process PowerShell output."));
//         }
//       }
//     );
//   });
// }

/**
 * Generates a GenerativePart object from clipboard image data.
 * @returns {Promise<GenerativePart>} - A promise resolving to the GenerativePart object.
 */
export async function generateGenerativePartFromClipboard(mimeType = "image/png"): Promise<GenerativePart> {
  const { data } = await clipboardImageToBase64();
  return {
    inlineData: {
      data,
      mimeType
    }
  };
}
