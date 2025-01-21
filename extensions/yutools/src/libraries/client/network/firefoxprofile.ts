import { firefox, Browser, BrowserContext } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import * as ini from 'ini';
import { execSync, spawn } from 'child_process';

interface ProfileConfig {
  Name?: string;
  Path?: string;
  Default?: string;
  Locked?: string;
  IsRelative?: string;
}

interface ProfilesConfig {
  [key: string]: ProfileConfig;
}

function killExistingFirefox() {
  try {
    execSync('taskkill /F /IM firefox.exe /T', { stdio: 'ignore' });
    console.log('Killed existing Firefox processes');
  } catch (e) {
    // It's okay if no Firefox processes were found
  }
}

async function launchFirefoxWithProfile(profileName: string): Promise<BrowserContext> {
  console.log(`Starting to launch Firefox with profile: ${profileName}`);
  
  // Kill any existing Firefox processes
  killExistingFirefox();
  
  // Read Firefox profiles.ini
  const profilesPath: string = path.join(
    process.env.APPDATA || '',
    'Mozilla',
    'Firefox',
    'profiles.ini'
  );
  
  console.log(`Reading profiles from: ${profilesPath}`);
  
  if (!fs.existsSync(profilesPath)) {
    throw new Error(`Profiles.ini not found at: ${profilesPath}`);
  }

  const profilesConfig: ProfilesConfig = ini.parse(fs.readFileSync(profilesPath, 'utf-8'));
  
  // Find the specified profile
  let profilePath: string | undefined;
  for (const section in profilesConfig) {
    if (profilesConfig[section].Name === profileName) {
      profilePath = profilesConfig[section].Path;
      console.log(`Found profile path: ${profilePath}`);
      break;
    }
  }
  
  if (!profilePath) {
    throw new Error(`Profile ${profileName} not found`);
  }

  // Get the full path to the profile directory
  const fullProfilePath = path.isAbsolute(profilePath) 
    ? profilePath 
    : path.join(path.dirname(profilesPath), profilePath);
  
  console.log(`Using full profile path: ${fullProfilePath}`);

  console.log('Launching Firefox...');
  
  // Launch browser with persistent context using the profile directory
  const context = await firefox.launchPersistentContext(
    fullProfilePath,
    {
      executablePath: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
      args: ['-no-remote', '--wait-for-browser'],
      firefoxUserPrefs: {
        // Disable various features that might interfere
        'browser.shell.checkDefaultBrowser': false,
        'browser.startup.homepage': 'about:blank',
        'browser.startup.page': 0,
        'browser.startup.homepage_override.mstone': 'ignore',
        'browser.sessionstore.restore_on_demand': false,
        'browser.sessionstore.resume_from_crash': false,
        'browser.warnOnQuit': false,
        'browser.tabs.warnOnClose': false,
        'browser.tabs.warnOnCloseOtherTabs': false,
        // Enable remote debugging
        'devtools.debugger.remote-enabled': true,
        'devtools.debugger.prompt-connection': false,
        'devtools.chrome.enabled': true
      },
      viewport: { width: 1280, height: 720 },
      timeout: 60000,
      headless: false,
      slowMo: 100
    }
  );

  console.log('Firefox launched successfully');
  return context;
}

async function example(): Promise<void> {
  let context: BrowserContext | undefined;
  
  try {
    console.log('Starting example...');
    const profile = 'saiful.firefox';
    
    context = await launchFirefoxWithProfile(profile);
    console.log('Context created');

    // Wait a moment for Firefox to fully initialize
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Opening new page...');
    const page = await context.newPage();
    console.log('Page opened, navigating...');
    
    await page.goto('https://chat.deepseek.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    console.log('Navigation complete');

    // Keep the browser open for interaction
    await new Promise(resolve => setTimeout(resolve, 30000));

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    if (context) {
      try {
        console.log('Cleaning up...');
        await context.close();
        console.log('Cleanup complete');
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }
    console.log('Example finished');
    process.exit(0);
  }
}

// Run the example
console.log('Starting script...');
example().catch(console.error);