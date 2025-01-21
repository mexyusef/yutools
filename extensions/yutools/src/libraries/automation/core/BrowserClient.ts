import { chromium, firefox, webkit, Browser, Page, LaunchOptions } from 'playwright';
import { DEFAULT_GOTO_TIMEOUT, WAIT_FOR_SELECTOR_TIMEOUT } from '../constants';

type BrowserType = 'chromium' | 'firefox' | 'webkit';

const commonArgs = [
  '--start-maximized',
  '--disable-blink-features=AutomationControlled', // Disable automation flags
  '--disable-infobars', // Disable infobars
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--disable-gpu',
  '--disable-extensions',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-domain-reliability',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-popup-blocking',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-sync',
  '--force-color-profile=srgb',
  '--metrics-recording-only',
  '--no-first-run',
  '--safebrowsing-disable-auto-update',
  '--enable-automation', // This is a flag that websites often check for
];

export class BrowserClient {
  private browser: Browser | null = null;
  page: Page | null = null;

  constructor(private browserType: BrowserType = 'chromium') { }

  async launch(options: LaunchOptions = {
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  }) {

    switch (this.browserType) {
      case 'chromium':
        // this.browser = await chromium.launch(options);
        // this.browser = await chromium.launch({
        //   ...options,
        //   args: ['--start-maximized'],
        // });
        this.browser = await chromium.launch({
          ...options,
          args: [...(options.args || []), ...commonArgs],
        });
        break;
      case 'firefox':
        this.browser = await firefox.launch(options);
        break;
      case 'webkit':
        this.browser = await webkit.launch(options);
        break;
      default:
        throw new Error(`Unsupported browser type: ${this.browserType}`);
    }
    this.page = await this.browser.newPage();


    // // Set a common user-agent string
    // await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // For Firefox and WebKit, set the window size manually
    if (this.browserType === 'firefox' || this.browserType === 'webkit') {
      await this.page.setViewportSize({ width: 1920, height: 1080 }); // Set to a large size
    }
  }

  async delay(min: number, max: number) {
    const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delayTime));
  }
  
  async goto(url: string, timeout: number = DEFAULT_GOTO_TIMEOUT) {
    if (!this.page) throw new Error('Page not initialized. Call launch() first.');
    await this.page.goto(url, { timeout });
  }

  async fill(selector: string, value: string) {
    if (!this.page) throw new Error('Page not initialized. Call launch() first.');
    await this.page.fill(selector, value);
  }

  async click(selector: string) {
    if (!this.page) throw new Error('Page not initialized. Call launch() first.');
    await this.page.click(selector);
  }

  async waitForSelector(selector: string, timeout: number = WAIT_FOR_SELECTOR_TIMEOUT) {
    if (!this.page) throw new Error('Page not initialized. Call launch() first.');
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForFunction(
    fn: (arg?: any) => any,
    arg?: any,
    timeout: number = WAIT_FOR_SELECTOR_TIMEOUT
  ) {
    if (!this.page) throw new Error('Page not initialized. Call launch() first.');
    await this.page.waitForFunction(fn, arg, { timeout });
  }

  async takeScreenshot(path: string) {
    if (!this.page) throw new Error('Page not initialized. Call launch() first.');
    await this.page.screenshot({ path });
  }

  async close() {
    if (this.browser) await this.browser.close();
  }
}