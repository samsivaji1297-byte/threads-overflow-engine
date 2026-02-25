// post.js
import { chromium } from 'playwright';

async function postToThreads(text) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Inject cookie from GitHub Secret
  await context.addCookies([
    {
      name: "sessionid",
      value: process.env.THREADS_SESSIONID,
      domain: ".threads.net",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }
  ]);

  const page = await context.newPage();

  await page.goto('https://www.threads.net/', { waitUntil: 'networkidle' });

  await page.waitForSelector('div[role="textbox"]');
  await page.click('div[role="textbox"]');
  await page.keyboard.type(text);
  await page.click('button:has-text("Post")');

  await browser.close();
}

postToThreads("Hello from cookie-based login!");

