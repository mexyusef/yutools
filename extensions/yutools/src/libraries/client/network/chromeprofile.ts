import { chromium } from 'playwright';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function isProfileLocked(userDataDir: string, profileName: string = 'Default'): Promise<boolean> {
  const lockFile = path.join(userDataDir, profileName, 'Lock');
  const singletonFile = path.join(userDataDir, profileName, 'Singleton');
  
  return fs.existsSync(lockFile) || fs.existsSync(singletonFile);
}

async function removeLockFiles(userDataDir: string, profileName: string = 'Default') {
  const lockFile = path.join(userDataDir, profileName, 'Lock');
  const singletonFile = path.join(userDataDir, profileName, 'Singleton');
  
  try {
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
    if (fs.existsSync(singletonFile)) {
      fs.unlinkSync(singletonFile);
    }
  } catch (error) {
    console.log('Error removing lock files:', error);
  }
}

async function launchBrowserWithProfile() {
  const userDataDir = 'C:\\Users\\usef\\AppData\\Local\\Google\\Chrome\\User Data';
  const profileName = 'Default';
  
  // Check if profile is locked and remove lock files if necessary
  if (await isProfileLocked(userDataDir, profileName)) {
    console.log('Profile is locked. Removing lock files...');
    await removeLockFiles(userDataDir, profileName);
  }

  const browser = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      `--profile-directory=${profileName}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-features=TranslateUI'
    ],
    headless: false,
    ignoreDefaultArgs: [
      '--enable-automation',
      '--enable-blink-features=IdleDetection'
    ],
    viewport: { width: 1280, height: 720 }
  });

  // Example usage
  const page = await browser.newPage();
  await page.goto('https://chat.deepseek.com');

  // Handle browser disconnection
  browser.on('close', () => {
    console.log('Browser was closed');1
  });
  
  return browser;
}

// Error handling wrapper
async function main() {
  try {
    const browser = await launchBrowserWithProfile();
    
    // Keep the script running
    process.on('SIGINT', async () => {
      console.log('Closing browser...');
      await browser.close();
      process.exit();
    });
  } catch (error) {
    console.error('Failed to launch browser:', error);
  }
}

main();