const puppeteer = require("puppeteer");

// Configurations
const TIMEOUT = 1500;
const PROFILE_URL = "http://localhost:3000/profile";
const LOGIN_PAGE_URL = "http://localhost:3000/login";
const REGISTER_PAGE_URL = "http://localhost:3000/register";

// Selectors
const LOGIN_FORM_SELECTOR = "#login-form";
const REGISTER_FORM_SELECTOR = "#register-form";
const NAME_FIELD_SELECTOR = "#name";
const EMAIL_FIELD_SELECTOR = "#email";
const PASSWORD_FIELD_SELECTOR = "#password";
const SUBMIT_BUTTON_SELECTOR = "#submit-button";

const CONFIRM_PROFILE_PICTURE_BUTTON_SELECTOR =
  "#confirm-profile-picture-button";
const DELETE_ACCOUNT_BUTTON_SELECTOR = "#delete-account-button";
const CONFIRM_PASSWORD_FORM_SELECTOR = "#password-form";
const CONFIRM_PASSWORD_FIELD_SELECTOR = "#password-field";
const SUBMIT_PASSWORD_BUTTON_SELECTOR = "#submit-password-button";

// Globals
let browser;
let page;

let name = "tester";
let email = `tester@test.com`;
let password = "123456";
const user_registered = false;
let consoleMessages = [];

/* -------------------------------------------------------------------------- */
/*                               HELPER METHODS                               */
/* -------------------------------------------------------------------------- */
async function newBrowser() {
  if (browser) await browser.close();
  browser = await puppeteer.launch({ defaultViewport: null });
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

async function expectText(text) {
  await page.waitForFunction(
    `document.querySelector("body").innerText.includes("${text}")`
  );
}

async function clearInputFromField(fieldSelector) {
  const input = await page.$(fieldSelector);
  await input.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
}

async function autoScroll() {
  await page.waitForTimeout(TIMEOUT);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
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

async function fillInForm(inputEmail, inputPassword) {
  await page.waitForSelector(LOGIN_FORM_SELECTOR);
  await page.type(EMAIL_FIELD_SELECTOR, inputEmail);
  await page.type(PASSWORD_FIELD_SELECTOR, inputPassword);

  await page.click(SUBMIT_BUTTON_SELECTOR);
}

async function updateParticularField(userProp, newInput, editMode) {
  if (editMode) {
    await page.waitForSelector(`#${userProp}-edit-button`);
    await page.click(`#${userProp}-edit-button`);
  }
  await page.waitForSelector(`#${userProp}-particular-form`);
  const inputSelector = `#${userProp}-particular-field`;
  await clearInputFromField(inputSelector);
  await page.type(inputSelector, newInput);
  await page.click(`#${userProp}-submit-edit-button`);
}

async function confirmPasswordField(inputPassword) {
  await page.waitForSelector(CONFIRM_PASSWORD_FORM_SELECTOR);
  await page.type(CONFIRM_PASSWORD_FIELD_SELECTOR, inputPassword);
  await page.click(SUBMIT_PASSWORD_BUTTON_SELECTOR);
  await page.waitForTimeout(TIMEOUT);
}
/* -------------------------------------------------------------------------- */

describe("Profile Page", () => {
  beforeAll(async () => {
    if (user_registered) {
      await loginAccount();
    } else {
      await registerAccount();
    }
    await page.goto(PROFILE_URL);
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Profile picture change", async () => {
    await page.waitForTimeout(TIMEOUT);
    const inputUploadHandle = await page.$("input[type=file]");
    await inputUploadHandle.uploadFile("./src/Images/profile-picture.jpeg");
    await page.click(CONFIRM_PROFILE_PICTURE_BUTTON_SELECTOR);
    await page.waitForTimeout(TIMEOUT);

    const avatarElement = await page.$(".MuiAvatar-img");
    const src = await avatarElement.evaluate((element) => element.src);
    expect(src).not.toBe("/static/images/avatar/2.jpg");
  });

  test("Blank username change", async () => {
    await updateParticularField("username", "", true);
    await expectValidationErrorMessage(
      page,
      "username-particular-field",
      "Required"
    );
  });

  test("Short username change", async () => {
    await updateParticularField("username", "a");
    await expectValidationErrorMessage(
      page,
      "username-particular-field",
      "Too Short!"
    );
  });

  test("Successful username change", async () => {
    name = "test";
    await updateParticularField("username", name);
    await confirmPasswordField(password);
    await page.waitForTimeout(TIMEOUT);
    await expectText(name);
  });

  test("Invalid email change", async () => {
    await updateParticularField("email", "test", true);
    await expectValidationErrorMessage(
      page,
      "email-particular-field",
      "Invalid email"
    );
  });

  test("Successful email change", async () => {
    const old_email = email;
    email = "test@test.com";
    await updateParticularField("email", email);
    await confirmPasswordField(password);

    await reset(LOGIN_PAGE_URL);
    await fillInForm(old_email, password);
    await expectErrorMessage(page, "auth/user-not-found");

    await reset(LOGIN_PAGE_URL);
    await fillInForm(email, password);
    await page.waitForNavigation();
  });

  test("Invalid password change", async () => {
    await page.goto(PROFILE_URL);

    await updateParticularField("password", "123", true);
    await expectValidationErrorMessage(
      page,
      "password-particular-field",
      "Too short!"
    );
  });

  test("Successful password change", async () => {
    const old_password = password;
    password = "1234567";
    await updateParticularField("password", password);
    await confirmPasswordField(old_password);

    await reset(LOGIN_PAGE_URL);
    await fillInForm(email, old_password);
    await expectErrorMessage(page, "auth/wrong-password");

    await reset(LOGIN_PAGE_URL);
    await fillInForm(email, password);
    await page.waitForNavigation();
  });

  test("Invalid password confirmation", async () => {
    await page.goto(PROFILE_URL);
    await autoScroll();

    await page.click(DELETE_ACCOUNT_BUTTON_SELECTOR);
    await confirmPasswordField("111111");
    await page.waitForTimeout(TIMEOUT);

    await expectErrorMessage(page, "auth/wrong-password");
  });

  test("Successful account deletion", async () => {
    await clearInputFromField(CONFIRM_PASSWORD_FIELD_SELECTOR);
    await confirmPasswordField(password);
    await page.waitForTimeout(TIMEOUT);

    await reset(LOGIN_PAGE_URL);
    await fillInForm(email, password);
    await expectErrorMessage(page, "auth/user-not-found");
  });
});
