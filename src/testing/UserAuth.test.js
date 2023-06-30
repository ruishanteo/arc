const puppeteer = require("puppeteer");
const MailSlurp = require("mailslurp-client").default;

// Configurations
const TIMEOUT = 4000;
const REGISTER_PAGE_URL = "http://localhost:3000/register";
const LOGIN_PAGE_URL = "http://localhost:3000/login";

// Selectors
const NAME_FIELD_SELECTOR = "#name";
const EMAIL_FIELD_SELECTOR = "#email";
const PASSWORD_FIELD_SELECTOR = "#password";
const LOGIN_FORM_SELECTOR = "#login-form";
const REGISTER_FORM_SELECTOR = "#register-form";
const GOOGLE_SIGNIN_BUTTON_SELECTOR = "#google-signin-button";

// Globals
const mailSlurpClient = new MailSlurp({
  apiKey: "f5d65b5a5a7877c7fa7da82dc8ff4001bdb4b11b2a9f5b6fde3b135bb377e117",
});

let browser;
let page;

const name = "tester";
const email = "dbfb088b-1b53-4028-a40b-b10bc3bdbc54@mailslurp.com";
const password = "123456";

let consoleMessages = [];

/* -------------------------------------------------------------------------- */
/*                               HELPER METHODS                               */
/* -------------------------------------------------------------------------- */

async function newBrowser() {
  if (browser) await browser.close();
  browser = await puppeteer.launch();
  page = null;
}

async function newPage(freshPage) {
  if (!freshPage && page) page.close();
  page = await browser.newPage();

  consoleMessages.length = 0;
  page.on("console", (message) => {
    consoleMessages.push(message.text());
  });
}

async function expectValidationErrorMessage(page, field, message) {
  const helperTextElement = await page.$(`#${field}-helper-text`);
  const validationError = await page.evaluate(
    (e) => e.textContent,
    helperTextElement
  );
  expect(validationError).toBe(message);
}

async function expectErrorMessage(page, errorCode) {
  await page.waitForTimeout(TIMEOUT);
  const errorMessages = consoleMessages.filter((message) =>
    message.startsWith("Err")
  );
  expect(errorMessages.length).toBeGreaterThan(0);
  expect(errorMessages[0]).toContain(errorCode);
}

async function login() {
  await newPage();
  await page.goto(LOGIN_PAGE_URL);
  await page.waitForSelector(LOGIN_FORM_SELECTOR);
  await page.type(EMAIL_FIELD_SELECTOR, email);
  await page.type(PASSWORD_FIELD_SELECTOR, password);
  await page.click("#login-button");
  await page.waitForNavigation();
}
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                  */
/* -------------------------------------------------------------------------- */
describe("Register Page", () => {
  async function fillInForm(inputName, inputEmail, inputPassword) {
    await newPage();
    await page.goto(REGISTER_PAGE_URL);
    await page.waitForSelector(REGISTER_FORM_SELECTOR);
    await page.type(NAME_FIELD_SELECTOR, inputName);
    await page.type(EMAIL_FIELD_SELECTOR, inputEmail);
    await page.type(PASSWORD_FIELD_SELECTOR, inputPassword);

    await page.click("#login-button");
  }

  beforeAll(async () => {
    await newBrowser();
    await newPage(true);
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Empty form fields", async () => {
    await fillInForm("", "", "");

    const fields = ["name", "email", "password"];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      await expectValidationErrorMessage(page, field, "Required");
    }
  });

  test("Invalid email", async () => {
    await fillInForm(name, "123", password);
    await expectValidationErrorMessage(
      page,
      "email",
      "Please enter a valid email"
    );
  });

  test("Invalid password", async () => {
    await fillInForm(name, email, "123");
    await expectValidationErrorMessage(
      page,
      "password",
      "Password is too short"
    );
  });

  test("Successfully registered", async () => {
    await fillInForm(name, email, password);
    await page.waitForNavigation();
  });

  test("Account already exists", async () => {
    await newBrowser();
    await fillInForm(name, email, password);
    await expectErrorMessage(page, "auth/email-already-in-use");
  });

  test("Google Sign-in", async () => {
    await newBrowser();
    await newPage();
    await page.goto(REGISTER_PAGE_URL);
    await page.waitForSelector(GOOGLE_SIGNIN_BUTTON_SELECTOR);

    const newPagePromise = new Promise((promise) =>
      browser.once("targetcreated", (target) => promise(target.page()))
    );
    await page.click(GOOGLE_SIGNIN_BUTTON_SELECTOR);
    const popup = await newPagePromise;
    await page.waitForTimeout(TIMEOUT);

    const found = (await popup.content()).match("Sign in");
    expect(found).toContainEqual("Sign in");
  });
});
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
describe("Login Page", () => {
  async function fillInForm(inputEmail, inputPassword) {
    await newPage();
    await page.goto(LOGIN_PAGE_URL);
    await page.waitForSelector(LOGIN_FORM_SELECTOR);
    await page.type(EMAIL_FIELD_SELECTOR, inputEmail);
    await page.type(PASSWORD_FIELD_SELECTOR, inputPassword);

    await page.click("#login-button");
  }

  beforeAll(async () => {
    await newBrowser();
    await newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Empty form fields", async () => {
    await fillInForm("", "");

    const fields = ["email", "password"];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      await expectValidationErrorMessage(page, field, "Required");
    }
  });

  test("Invalid email", async () => {
    await fillInForm("123", password);
    await expectValidationErrorMessage(
      page,
      "email",
      "Please enter a valid email"
    );
  });

  test("Invalid password", async () => {
    await fillInForm(email, "123");
    await expectValidationErrorMessage(
      page,
      "password",
      "Password is too short"
    );
  });

  test("Wrong email", async () => {
    await fillInForm(`wrong_${email}`, password);
    await expectErrorMessage(page, "auth/user-not-found");
  });

  test("Wrong password", async () => {
    await fillInForm(email, `wrong_${password}`);
    await expectErrorMessage(page, "auth/wrong-password");
  });

  test("Google Sign-in", async () => {
    await page.goto(LOGIN_PAGE_URL);
    await page.waitForSelector(GOOGLE_SIGNIN_BUTTON_SELECTOR);

    const newPagePromise = new Promise((promise) =>
      browser.once("targetcreated", (target) => promise(target.page()))
    );
    await page.click(GOOGLE_SIGNIN_BUTTON_SELECTOR);
    const popup = await newPagePromise;
    await page.waitForTimeout(TIMEOUT);

    const found = (await popup.content()).match("Sign in");
    expect(found).toContainEqual("Sign in");
  });

  test("Successfully logged in", async () => {
    await login();
  });
});
/* -------------------------------------------------------------------------- */
