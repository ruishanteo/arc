const puppeteer = require("puppeteer");

// Configurations
const TIMEOUT = 1500;
const CALCULATOR_URL = "http://localhost:3000/GradeCalculator";
const LOGIN_PAGE_URL = "http://localhost:3000/login";
const REGISTER_PAGE_URL = "http://localhost:3000/register";

// Selectors
const LOGIN_FORM_SELECTOR = "#login-form";
const REGISTER_FORM_SELECTOR = "#register-form";
const NAME_FIELD_SELECTOR = "#name";
const EMAIL_FIELD_SELECTOR = "#email";
const PASSWORD_FIELD_SELECTOR = "#password";
const SUBMIT_BUTTON_SELECTOR = "#submit-button";

const CACLULATOR_FORM_SELECTOR = "#calculator-form";
const ADD_MODULE_BUTTON_SELECTOR = "#add-module-button";
const SAVE_CALCULATOR_BUTTON_SELECTOR = "#save-calculator-button";
const CLEAR_CALCULATOR_BUTTON_SELECTOR = "#clear-calculator-button";
const CONFIRM_CLEAR_CALCULATOR_BUTTON_SELECTOR =
  "#confirm-clear-calculator-button";

const DELETE_MODULE_BUTTON_SELECTOR = "#delete-module-button";
const ADD_COMPONENT_BUTTON_SELECTOR = "#add-component-button";
const DELETE_COMPONENT_BUTTON_SELECTOR = "#delete-component-button";
const CALCULATE_GRADE_BUTTON_SELECTOR = "#calculate-grade-button";
const DESIRED_SCORE_FIELD_SELECTOR = "#desired-score";
const GRADE_RESULT_TEXT_SELECTOR = "#grade-result";

const MODULE_COMPONENT_SELECTOR = ".module-card";
const ASSESSMENT_COMPONENT_SELECTOR = ".assessment-card";

const COMPONENT_TITLE_FIELD_SELECTOR = "#component-title";
const COMPONENT_SCORE_FIELD_SELECTOR = "#component-score";
const COMPONENT_TOTAL_FIELD_SELECTOR = "#component-total";
const COMPONENT_WEIGHT_FIELD_SELECTOR = "#component-weight";

const COMPONENT_TITLE_VALIDATION_SELECTOR = "#componentTitle-helper-text";
const COMPONENT_SCORE_VALIDATION_SELECTOR = "#score-helper-text";
const COMPONENT_TOTAL_VALIDATION_SELECTOR = "#total-helper-text";
const COMPONENT_WEIGHT_VALIDATION_SELECTOR = "#weight-helper-text";

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

async function expectTextMessageIn(selector, message) {
  const element = await page.$(selector);
  const textContent = await page.evaluate((e) => e.textContent, element);
  expect(textContent).toContain(message);
}

async function expectExactTextMessageIn(selector, message) {
  const element = await page.$(selector);
  const textContent = await page.evaluate((e) => e.textContent, element);
  expect(textContent).toBe(message);
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

function appendAssessmentIndex(selector, assessmentIndex) {
  return `${selector}-${assessmentIndex}`;
}

function appendComponentIndex(selector, assessmentIndex, componentIndex) {
  console.log(selector, assessmentIndex, componentIndex);
  return `${appendAssessmentIndex(assessmentIndex)}-${componentIndex}`;
}
/* -------------------------------------------------------------------------- */

describe("Grade Calculator", () => {
  const assessmentIndex = 0;
  const componentIndex = 0;

  beforeAll(async () => {
    if (user_registered) {
      await loginAccount();
    } else {
      await registerAccount();
    }
    await page.goto(CALCULATOR_URL);
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Add module button", async () => {
    await page.waitForTimeout(TIMEOUT);
    await page.click(ADD_MODULE_BUTTON_SELECTOR);
    const moduleCount = await page.$$eval(
      MODULE_COMPONENT_SELECTOR,
      (modules) => modules.length
    );
    await expect(moduleCount).toBe(1);
  });

  test("Add component button", async () => {
    await page.click(`${ADD_COMPONENT_BUTTON_SELECTOR}-0`);
    const componentCount = await page.$$eval(
      `${ASSESSMENT_COMPONENT_SELECTOR}-0`,
      (components) => components.length
    );
    await expect(componentCount).toBe(2);
  });

  test("Delete component button", async () => {
    await page.click(`${DELETE_COMPONENT_BUTTON_SELECTOR}-0-0`);
    const componentCount = await page.$$eval(
      `${ASSESSMENT_COMPONENT_SELECTOR}-0`,
      (components) => components.length
    );
    await expect(componentCount).toBe(1);
  });

  test("Input with default values", async () => {
    await page.waitForSelector(`${CACLULATOR_FORM_SELECTOR}-0`);
    await page.click(`${CALCULATE_GRADE_BUTTON_SELECTOR}-0`);
    await expectTextMessageIn(
      `${COMPONENT_TITLE_VALIDATION_SELECTOR}-0-0`,
      "Please enter a text"
    );
    await expectTextMessageIn(
      `${COMPONENT_TOTAL_VALIDATION_SELECTOR}-0-0`,
      "Total must be greater than 0"
    );
    await expectTextMessageIn(
      `${COMPONENT_WEIGHT_VALIDATION_SELECTOR}-0-0`,
      "Weightage must be greater than 0"
    );
  });

  test("Calculate grade", async () => {
    await page.type(`${COMPONENT_TITLE_FIELD_SELECTOR}-0-0`, "component");
    await page.type(`${COMPONENT_SCORE_FIELD_SELECTOR}-0-0`, "75");
    await page.type(`${COMPONENT_TOTAL_FIELD_SELECTOR}-0-0`, "100");
    await page.type(`${COMPONENT_WEIGHT_FIELD_SELECTOR}-0-0`, "20");
    await page.type(`${DESIRED_SCORE_FIELD_SELECTOR}-0`, "90");

    await page.click(`${CALCULATE_GRADE_BUTTON_SELECTOR}-0`);
    await expectExactTextMessageIn(
      `${GRADE_RESULT_TEXT_SELECTOR}-0`,
      "Score Required: 93.75"
    );
  });

  test("Delete module button", async () => {
    await page.click(`${DELETE_MODULE_BUTTON_SELECTOR}-0`);
    const moduleCount = await page.$$eval(
      MODULE_COMPONENT_SELECTOR,
      (modules) => modules.length
    );
    await expect(moduleCount).toBe(0);
  });

  test("Successfully saved calculator", async () => {
    await page.click(ADD_MODULE_BUTTON_SELECTOR);
    await page.click(SAVE_CALCULATOR_BUTTON_SELECTOR);
    await page.waitForTimeout(TIMEOUT);
    await page.reload();
    await page.waitForTimeout(TIMEOUT);
    await page.waitForSelector(`${CACLULATOR_FORM_SELECTOR}-0`);
  });

  test("Successfully cleared calculator", async () => {
    await page.click(CLEAR_CALCULATOR_BUTTON_SELECTOR);
    await page.click(CONFIRM_CLEAR_CALCULATOR_BUTTON_SELECTOR);
    await page.waitForTimeout(TIMEOUT);
    await page.reload();
    await page.waitForTimeout(TIMEOUT);
    await expectText("You have no saved data. Get started!");
  });
});
