// post.js
import { chromium } from 'playwright';

async function postToThreads(text) {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext();

  // Inject all required Threads cookies
  await context.addCookies([
    {
      name: "sessionid",
      value: process.env.THREADS_SESSIONID,
      domain: ".threads.net",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None"
    },
    {
      name: "ds_user_id",
      value: process.env.THREADS_DS_USER_ID,
      domain: ".threads.net",
      path: "/",
      secure: true,
      sameSite: "None"
    },
    {
      name: "csrftoken",
      value: process.env.THREADS_CSRF,
      domain: ".threads.net",
      path: "/",
      secure: true,
      sameSite: "None"
    },
    {
      name: "mid",
      value: process.env.THREADS_MID,
      domain: ".threads.net",
      path: "/",
      secure: true,
      sameSite: "None"
    },
    {
      name: "ig_did",
      value: process.env.THREADS_IG_DID,
      domain: ".threads.net",
      path: "/",
      secure: true,
      sameSite: "None"
    }
  ]);

  const page = await context.newPage();

  // Load Threads homepage with your authenticated session
  await page.goto('https://www.threads.net/', { waitUntil: 'networkidle' });

  // Wait for the post composer to appear
  await page.waitForSelector('div[role="textbox"]');

  // Type the post
  await page.click('div[role="textbox"]');
  await page.keyboard.type(text);

  // Click the Post button
  await page.click('button:has-text("Post")');

  await browser.close();
}

// Test post
postToThreads("Hello from cookie-based login!");
