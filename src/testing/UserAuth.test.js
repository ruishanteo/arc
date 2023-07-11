const axios = require("axios");
const puppeteer = require("puppeteer");

// Configurations
const TIMEOUT = 1500;
const REGISTER_PAGE_URL = "http://localhost:3000/register";
const LOGIN_PAGE_URL = "http://localhost:3000/login";
const RESET_PAGE_URL = "http://localhost:3000/reset";

// Selectors
const NAME_FIELD_SELECTOR = "#name";
const EMAIL_FIELD_SELECTOR = "#email";
const PASSWORD_FIELD_SELECTOR = "#password";
const LOGIN_FORM_SELECTOR = "#login-form";
const REGISTER_FORM_SELECTOR = "#register-form";
const RESET_FORM_SELECTOR = "#reset-form";
const SUBMIT_BUTTON_SELECTOR = "#submit-button";
const GOOGLE_SIGNIN_BUTTON_SELECTOR = "#google-signin-button";

// Globals
let browser;
let page;

const name = "tester";
const email = `tester@test.com`;
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

async function newPage() {
  if (page) page.close();
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
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                  */
/* -------------------------------------------------------------------------- */
describe("Register Page", () => {
  async function fillInForm(inputName, inputEmail, inputPassword) {
    await page.waitForSelector(REGISTER_FORM_SELECTOR);
    await page.type(NAME_FIELD_SELECTOR, inputName);
    await page.type(EMAIL_FIELD_SELECTOR, inputEmail);
    await page.type(PASSWORD_FIELD_SELECTOR, inputPassword);

    await page.click(SUBMIT_BUTTON_SELECTOR);
  }

  beforeEach(async () => {
    await reset(REGISTER_PAGE_URL);
  });

  test("Empty form fields", async () => {
    await page.waitForSelector(REGISTER_FORM_SELECTOR);
    await page.click(SUBMIT_BUTTON_SELECTOR);
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
    await fillInForm(name, email, password);
    await expectErrorMessage(page, "auth/email-already-in-use");
  });

  test("Google Sign-in", async () => {
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
    await page.waitForSelector(LOGIN_FORM_SELECTOR);
    await page.type(EMAIL_FIELD_SELECTOR, inputEmail);
    await page.type(PASSWORD_FIELD_SELECTOR, inputPassword);

    await page.click(SUBMIT_BUTTON_SELECTOR);
  }

  beforeEach(async () => {
    await reset(LOGIN_PAGE_URL);
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
    await fillInForm(email, password);
    await page.waitForNavigation();
  });
});
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    RESET                                   */
/* -------------------------------------------------------------------------- */
describe("Reset Password Page", () => {
  async function fillInForm(inputEmail) {
    await page.waitForSelector(RESET_FORM_SELECTOR);
    await page.type(EMAIL_FIELD_SELECTOR, inputEmail);
    await page.click(SUBMIT_BUTTON_SELECTOR);
  }

  beforeEach(async () => {
    await reset(RESET_PAGE_URL);
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  test("Empty form fields", async () => {
    await fillInForm("");
    await expectValidationErrorMessage(page, "email", "Required");
  });

  test("Invalid email", async () => {
    await fillInForm("123");
    await expectValidationErrorMessage(
      page,
      "email",
      "Please enter a valid email"
    );
  });

  test("Wrong email", async () => {
    await fillInForm(`wrong_${email}`);
    await expectErrorMessage(page, "auth/user-not-found");
  });

  test("Successfully sent email", async () => {
    await fillInForm(email);
    await page.waitForTimeout(TIMEOUT);

    const response = await axios.get(
      `http://127.0.0.1:9099/emulator/v1/projects/arc-backend-bac77/oobCodes`
    );
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.oobCodes).toBeDefined();
    expect(response.data.oobCodes).toBeInstanceOf(Array);

    const oobRequest = response.data.oobCodes[0];
    expect(oobRequest).toBeDefined();
    expect(oobRequest).toBeInstanceOf(Object);
    expect(oobRequest.email).toBe(email);
    expect(oobRequest.requestType).toBe("PASSWORD_RESET");
  });
});
/* -------------------------------------------------------------------------- */
