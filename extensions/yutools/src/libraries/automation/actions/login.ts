import { BrowserClient } from '../core/BrowserClient';

export async function loginSimple(
  client: BrowserClient,
  url: string,
  email: string,
  password: string,
  emailSelector: string = '#email',
  passwordSelector: string = '#password',
  submitSelector: string = 'button[type="submit"]'
) {
  try {
    await client.goto(url);
    await client.fill(emailSelector, email);
    await client.fill(passwordSelector, password);
    await client.click(submitSelector);
    console.log('Login successful!');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

type LoginOptions = {
  emailSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  timeout?: number;
};

export async function login(
  client: BrowserClient,
  url: string,
  email: string,
  password: string,
  options: LoginOptions = {}
) {
  const {
    emailSelector = '#email',
    passwordSelector = '#password',
    submitSelector = 'button[type="submit"]',
    timeout = 60_000,
  } = options;

  // Input validation
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  try {
    // Navigate to the login page
    await client.goto(url);

    // Wait for the login form to load
    await client.waitForSelector(emailSelector, timeout);
    await client.waitForSelector(passwordSelector, timeout);
    await client.waitForSelector(submitSelector, timeout);

    // Fill in the email and password
    await client.fill(emailSelector, email);
    await client.fill(passwordSelector, password);

    // Submit the form
    await client.click(submitSelector);

    // Optional: Wait for navigation or a success indicator
    // Example: await client.waitForSelector('.welcome-message', timeout);

    console.log('Login successful!');
    return true;
  } catch (error) {
    console.error('Login failed:', error);

    // Optional: Take a screenshot for debugging
    await client.takeScreenshot('login_failure.png');

    throw error;
  }
}