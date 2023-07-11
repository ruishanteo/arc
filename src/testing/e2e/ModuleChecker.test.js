const puppeteer = require("puppeteer");

// Configurations
const TIMEOUT = 1500;
const PLANNER_URL = "http://localhost:3000/ModulePlanner";
const LOGIN_PAGE_URL = "http://localhost:3000/login";
const REGISTER_PAGE_URL = "http://localhost:3000/register";

// Selectors
const LOGIN_FORM_SELECTOR = "#login-form";
const REGISTER_FORM_SELECTOR = "#register-form";
const NAME_FIELD_SELECTOR = "#name";
const EMAIL_FIELD_SELECTOR = "#email";
const PASSWORD_FIELD_SELECTOR = "#password";
const SUBMIT_BUTTON_SELECTOR = "#submit-button";

const INSTRUCTION_OPEN_BUTTON_SELECTOR = "#instruction-open-button";
const INSTRUCTION_CLEAR_BUTTON_SELECTOR = "#instruction-clear-button";
const SAVE_PLANNER_BUTTON_SELECTOR = "#save-planner-button";
const CLEAR_PLANNER_BUTTON_SELECTOR = "#clear-planner-button";
const CONFIRM_CLEAR_PLANNER_BUTTON_SELECTOR =
  "#confirm-clear-planner-button";

const DEGREE_AUTOCOMPLETE_SELECTOR = "#degree-selector";
const ADDON_AUTOCOMPLETE_SELECTOR = "#addon-selector";
const PROG_AUTOCOMPLETE_SELECTOR = "#addon2-selector";

const ADD_SEMESTER_BUTTON_SELECTOR = "#add-semester-button";
const DELETE_SEMESTER_BUTTON_SELECTOR = "#remove-semester-button";
const LINEAR_PROGRESS_SELECTOR = "#linear-progress-credits";
const LINEAR_PROGRESS_TEXT_SELECTOR = "#progress-total-credits";

const TABLE_HEADER_TEXT_SELECTOR = "#table-header";
const ADD_MODULE_PLANNER_BUTTON_SELECTOR = "#add-module-planner-button";

const DELETE_MODULE_BUTTON_SELECTOR = "#delete-module-planner-button";
const CATEGORY_AUTOCOMPLETE_SELECTOR = "#categ-selector";
const MODULE_AUTOCOMPLETE_SELECTOR = "#module-selector";

const PROG_MOD_CELL1_SELECTOR = "#prog-mod-table1";
const PROG_MOD_CELL2_SELECTOR = "#prog-mod-table2";
const COMMON_MOD_CELL1_SELECTOR = "#common-mod-table1";
const COMMON_MOD_CELL2_SELECTOR = "#common-mod-table2";
const UNRESTRICTED_MOD_CELL_SELECTOR = "#unrestricted-mod";

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
  
  function appendSemIndex(selector, semIndex) {
    return `${selector}-${semIndex}`;
  }
  
  function appendModuleIndex(selector, semIndex, moduleIndex) {
    console.log(selector, semIndex, moduleIndex);
    return `${appendSemIndex(semIndex)}-${moduleIndex}`;
  }
  /* -------------------------------------------------------------------------- */

  describe("Module planner", () => {
    const semIndex = 0;
    const moduleIndex = 0;
  
    beforeAll(async () => {
      if (user_registered) {
        await loginAccount();
      } else {
        await registerAccount();
      }
      await page.goto(PLANNER_URL);
    });
  
    afterAll(async () => {
      await browser.close();
    });


});