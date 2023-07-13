const puppeteer = require("puppeteer");

// Configurations
const TIMEOUT = 1500;
const LOGIN_PAGE_URL = "http://localhost:3000/login";
const REGISTER_PAGE_URL = "http://localhost:3000/register";

// Selectors
const LOGIN_FORM_SELECTOR = "#login-form";
const REGISTER_FORM_SELECTOR = "#register-form";
const NAME_FIELD_SELECTOR = "#name";
const EMAIL_FIELD_SELECTOR = "#email";
const PASSWORD_FIELD_SELECTOR = "#password";
const SUBMIT_BUTTON_SELECTOR = "#submit-button";

const FEEDBACK_DIV = "#feedback-form-div";
const FEEDBACK_WINDOW = "#feedback-window"
const FEEDBACK_AVATAR = "#feedback-avatar";
const FEEDBACK_TEXTFILL = "#feedback-textfield";
const CHARACTER_COUNT = "#character-count";
const FEEDBACK_SUBMIT_BUTTON = "#feedback-submit-button";

// Globals
let browser;
let page;

let name = "tester";
let email = `tester@test.com`;
let password = "123456";
const user_registered = true;
let consoleMessages = [];

/* -------------------------------------------------------------------------- */
/*                               HELPER METHODS                               */
/* -------------------------------------------------------------------------- */

async function newBrowser() {
  if (browser) await browser.close();
  browser = await puppeteer.launch({ defaultViewport: null, headless: false });
  page = null;
}

async function newPage() {
  if (page) await page.close();
  page = await browser.newPage();

  consoleMessages.length = 0;
  page.on("console", (message) => {
    consoleMessages.push(message.text());
  });
}

async function reset(url) {
  await newBrowser();
  await newPage();
  await page.goto(url);
}

async function registerAccount() {
  await reset(REGISTER_PAGE_URL);
  await page.waitForSelector(REGISTER_FORM_SELECTOR);
  await page.type(NAME_FIELD_SELECTOR, name);
  await page.type(EMAIL_FIELD_SELECTOR, email);
  await page.type(PASSWORD_FIELD_SELECTOR, password);
  await page.click(SUBMIT_BUTTON_SELECTOR);
  await page.waitForTimeout(TIMEOUT);
}

async function loginAccount() {
  await reset(LOGIN_PAGE_URL);
  await page.waitForSelector(LOGIN_FORM_SELECTOR);
  await page.type(EMAIL_FIELD_SELECTOR, email);
  await page.type(PASSWORD_FIELD_SELECTOR, password);

  await page.click(SUBMIT_BUTTON_SELECTOR);
  await page.waitForNavigation();
}

/* -------------------------------------------------------------------------- */

describe("Feedback Form", () => { 
    beforeAll(async () => {
      if (user_registered) {
        await loginAccount();
      } else {
        await registerAccount();
      }
    });
    
  
    afterAll(async () => {
      await browser.close();
    });

    test('Feedback form button', async () => {
        await page.waitForSelector(FEEDBACK_AVATAR);
        await page.click(FEEDBACK_AVATAR);
        const textContent = await page.evaluate(() => {
            const element = document.getElementById('character-count');
            return element.textContent.trim();
        });
        expect(textContent).toBe(`270 characters left`);
    });

    test('Input with value', async () => {
        const inputElement = await page.$(FEEDBACK_TEXTFILL);
        await inputElement.type('Example feedback text');
        const enteredText = await page.$eval(FEEDBACK_TEXTFILL, (element) => element.value);
        expect(enteredText).toBe('Example feedback text');
    });

    test('Correctly change character count', async () => {
        const textContent = await page.evaluate(() => {
            const element = document.getElementById('character-count');
            return element.textContent.trim();
        });
        const enteredText = await page.$eval(FEEDBACK_TEXTFILL, (element) => element.value);
        const charCount = 270 - enteredText.length
        expect(textContent).toBe(`${charCount} characters left`);
    });

    test('Successfully submit feedback', async () => {
        await page.waitForSelector(FEEDBACK_SUBMIT_BUTTON);
        await page.click(FEEDBACK_SUBMIT_BUTTON);
        await page.waitForSelector(FEEDBACK_TEXTFILL)
        const textContent = await page.evaluate(() => {
            const element = document.getElementById('character-count');
            return element.textContent.trim();
        });
        expect(textContent).toBe(`270 characters left`);
    });

    test('Successfully close feedback form', async () => {          
        const clickX = 200;
        const clickY = 200;
      
        // Click the random point
        await page.mouse.click(clickX, clickY);
      
        const feedbackWindowVisible = await page.$eval(FEEDBACK_WINDOW, (element) => window.getComputedStyle(element).display === 'none');
        await page.waitForTimeout(1000);
        expect(feedbackWindowVisible).toBe(false);
      });
});