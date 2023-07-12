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

const DELETE_MODULE_PLANNER_BUTTON_SELECTOR = "#delete-module-planner-button";
const CATEGORY_AUTOCOMPLETE_SELECTOR = "#categ-selector";
const MODULE_AUTOCOMPLETE_SELECTOR = "#module-selector";

const PROG_MOD_CELL1_SELECTOR = "#prog-mod-table1";
const PROG_MOD_CELL2_SELECTOR = "#prog-mod-table2";
const COMMON_MOD_CELL1_SELECTOR = "#common-mod-table1";
const COMMON_MOD_CELL2_SELECTOR = "#common-mod-table2";
const UNRESTRICTED_MOD_CELL_SELECTOR = "#unrestricted-mod";

const SEMESTER_COMPONENT_SELECTOR = ".semester-card";
const MODULE_COMPONENT_SELECTOR = ".module-card";

// Globals
let browser;
let page;

let name = "tester";
let email = `tester@test.com`;
let password = "123456";
const user_registered = true;
let consoleMessages = [];

const path = require('path');
const fs = require('fs');
let progData = require('../../module_data/progMods.json');
let secProgData = require('../../module_data/secondProg.json');
let nonProg = require('../../module_data/nonprog.json');
let commonMods = require('../../module_data/commonMods.json');
let utcp = require('../../module_data/utcp.json');
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

  async function selectAutocompleteValue(inputSelector, desiredOptionTitle) {
    await page.waitForSelector(inputSelector);
    await page.focus(inputSelector);

    // Enter a value in the input field to trigger the Autocomplete options
    await page.keyboard.type(desiredOptionTitle);

    // Wait for the Autocomplete options to appear
    const optionsSelector = '[role="listbox"] [role="option"]';
    await page.waitForSelector(optionsSelector);

    // Find the option with the desired title
    const optionHandle = await page.evaluateHandle((selector, title) => {
      const options = Array.from(document.querySelectorAll(selector));
      const desiredOption = options.find(option => option.textContent.trim() === title);
      return desiredOption;
    }, optionsSelector, desiredOptionTitle);

    // Click on the desired option
    await optionHandle.click();
  }
  
  function appendSemIndex(selector, semIndex) {
    return `${selector}-${semIndex}`;
  }
  
  function appendModuleIndex(selector, semIndex, moduleIndex) {
    console.log(selector, semIndex, moduleIndex);
    return `${appendSemIndex(semIndex)}-${moduleIndex}`;
  }
  /* -------------------------------------------------------------------------- */

  describe("Module Planner", () => {
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

    jest.setTimeout(10000);
    
    test("Add semester button", async () => {
      await page.waitForSelector(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
      await page.click(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
      await page.click(ADD_SEMESTER_BUTTON_SELECTOR);
      const semCount = await page.$$eval(
        SEMESTER_COMPONENT_SELECTOR,
        (semesters) => semesters.length
      );
      await expect(semCount).toBe(1);
    });
    
    test("Add module button", async () => {
      await page.click(`${ADD_MODULE_PLANNER_BUTTON_SELECTOR}-0`);
      const moduleCount = await page.$$eval(
        `${MODULE_COMPONENT_SELECTOR}-0`,
        (modules) => modules.length
      );
      await expect(moduleCount).toBe(2);
    });
    
    test("Remove module button", async () => {
      await page.click(`${DELETE_MODULE_PLANNER_BUTTON_SELECTOR}-0-0`);
      const moduleCount = await page.$$eval(
        `${MODULE_COMPONENT_SELECTOR}-0`,
        (modules) => modules.length
      );
      await expect(moduleCount).toBe(1);
    });

    test("Remove semester button", async () => {
      await page.click(DELETE_SEMESTER_BUTTON_SELECTOR);
      const semCount = await page.$$eval(
        SEMESTER_COMPONENT_SELECTOR,
        (semesters) => semesters.length
      );
      await expect(semCount).toBe(0);
    });

    test("Select degree dropdown", async () => {
      const desiredOptionTitle = "Computer Science";
      await page.waitForSelector(DEGREE_AUTOCOMPLETE_SELECTOR);
      await page.focus(DEGREE_AUTOCOMPLETE_SELECTOR);

      // Enter a value in the input field to trigger the Autocomplete options
      await page.keyboard.type(desiredOptionTitle);

      // Wait for the Autocomplete options to appear
      const optionsSelector = '[role="listbox"] [role="option"]';
      await page.waitForSelector(optionsSelector);

      // Find the option with the desired title
      const optionHandle = await page.evaluateHandle((selector, title) => {
        const options = Array.from(document.querySelectorAll(selector));
        const desiredOption = options.find(option => option.textContent.trim() === title);
        return desiredOption;
      }, optionsSelector, desiredOptionTitle);

      // Click on the desired option
      await optionHandle.click();

      const selectedOption = await page.evaluate(() => {
        const autocompleteInput = document.querySelector("#degree-selector");
        return autocompleteInput.value;
      });

      await expect(selectedOption).toBe(desiredOptionTitle);
    });

    test("Correctly render Programme Table", async () => {      
      // Extract the rendered table rows
      const tableRows = await page.$$eval('.progTable1Rows', (rows) =>
        rows.map((row) => ({
          title: row.querySelector('.progTable1Cell').innerText.trim(),
        }))
      );      
      const expectedData = progData["Computer Science"].map(item => ({ title: item.title }));
        // Check if the rendered table rows match the expected data
      expect(tableRows).toEqual(expectedData);
    });

    test("Correctly render Common Mods Table", async () => {   
      // Wait for the table rows to be rendered
      //await page.waitForSelector('#prog-table');
    
      // Extract the rendered table rows
      const tableRows1 = await page.$$eval('.commonTable1Rows', (rows) =>
        rows.map((row) => ({
          title: row.querySelector('.commonTable1Cell').innerText.trim(),
        }))
      );

      const tableRows2 = await page.$$eval('.commonTable2Rows', (rows) =>
        rows.map((row) => ({
          title: row.querySelector('.commonTable2Cell').innerText.trim(),
        }))
      );

      const tableRows = tableRows1.concat(tableRows2)
    
      // Define the expected data for comparison
      const nonProgData = nonProg.map(item => ({ title: item.title }));
      const commonModsData = commonMods["SOC"].map(item => ({ title: item.title }));

      const expectedData = nonProgData.concat(commonModsData);
    
      // Check if the rendered table rows match the expected data
      expect(tableRows).toEqual(expectedData);
    });

    test("Select category dropdown", async () => {
      await page.click(ADD_SEMESTER_BUTTON_SELECTOR);
      const desiredOptionTitle = "Programme";
      await page.waitForSelector(`${CATEGORY_AUTOCOMPLETE_SELECTOR}-0-0`);
      await page.focus(`${CATEGORY_AUTOCOMPLETE_SELECTOR}-0-0`);

      // Enter a value in the input field to trigger the Autocomplete options
      await page.keyboard.type(desiredOptionTitle);

      // Wait for the Autocomplete options to appear
      const optionsSelector = '[role="listbox"] [role="option"]';
      await page.waitForSelector(optionsSelector);

      // Find the option with the desired title
      const optionHandle = await page.evaluateHandle((selector, title) => {
        const options = Array.from(document.querySelectorAll(selector));
        const desiredOption = options.find(option => option.textContent.trim() === title);
        return desiredOption;
      }, optionsSelector, desiredOptionTitle);

      // Click on the desired option
      await optionHandle.click();

      const selectedOption = await page.evaluate(() => {
        const autocompleteInput = document.querySelector("#categ-selector-0-0");
        return autocompleteInput.value;
      });

      await expect(selectedOption).toBe(desiredOptionTitle);
    });
    
    test("Select module dropdown", async () => {
      const desiredOptionTitle = "CS1101S";
      await page.waitForSelector(`${MODULE_AUTOCOMPLETE_SELECTOR}-0-0`);
      await page.focus(`${MODULE_AUTOCOMPLETE_SELECTOR}-0-0`);

      // Enter a value in the input field to trigger the Autocomplete options
      await page.keyboard.type(desiredOptionTitle);

      // Wait for the Autocomplete options to appear
      const optionsSelector = '[role="listbox"] [role="option"]';
      await page.waitForSelector(optionsSelector);

      // Find the option with the desired title
      const optionHandle = await page.evaluateHandle((selector, title) => {
        const options = Array.from(document.querySelectorAll(selector));
        const desiredOption = options.find(option => option.textContent.trim() === title);
        return desiredOption;
      }, optionsSelector, desiredOptionTitle);

      // Click on the desired option
      await optionHandle.click();

      const selectedOption = await page.evaluate(() => {
        const autocompleteInput = document.querySelector("#module-selector-0-0");
        return autocompleteInput.value;
      });

      await expect(selectedOption).toBe(desiredOptionTitle);
    });

    test("Correctly update Module cell from Programme Table", async () => {   
      const tableRows = await page.$eval(`${PROG_MOD_CELL1_SELECTOR}-0`, (cell) =>
      getComputedStyle(cell).backgroundColor
    )
    
      // Define the expected data for comparison
      const expectedColour = "rgb(207, 248, 223)";
    
      // Check if the rendered table rows match the expected data
      expect(tableRows).toEqual(expectedColour);
    });

    test("Select 2nd major dropdown", async () => {
      const desiredOptionTitle = "Economics";
      await page.waitForSelector(ADDON_AUTOCOMPLETE_SELECTOR);
      await page.focus(ADDON_AUTOCOMPLETE_SELECTOR);

      // Enter a value in the input field to trigger the Autocomplete options
      await page.keyboard.type(desiredOptionTitle);

      // Wait for the Autocomplete options to appear
      const optionsSelector = '[role="listbox"] [role="option"]';
      await page.waitForSelector(optionsSelector);

      // Find the option with the desired title
      const optionHandle = await page.evaluateHandle((selector, title) => {
        const options = Array.from(document.querySelectorAll(selector));
        const desiredOption = options.find(option => option.textContent.trim() === title);
        return desiredOption;
      }, optionsSelector, desiredOptionTitle);

      // Click on the desired option
      await optionHandle.click();

      const selectedOption = await page.evaluate(() => {
        const autocompleteInput = document.querySelector("#addon-selector");
        return autocompleteInput.value;
      });

      await expect(selectedOption).toBe(desiredOptionTitle);
    });

    test("Correctly update Programme Table", async () => {      
      // Extract the rendered table rows
      const tableRows1 = await page.$$eval('.progTable1Rows', (rows) =>
        rows.map((row) => ({
          title: row.querySelector('.progTable1Cell').innerText.trim(),
        }))
      );
      const tableRows2 = await page.$$eval('.progTable2Rows', (rows) =>
        rows.map((row) => ({
          title: row.querySelector('.progTable2Cell').innerText.trim(),
        }))
      );

      const tableRows = tableRows1.concat(tableRows2);
    
      // Define the expected data for comparison
      const primaryModData = progData["Computer Science"].map(item => ({ title: item.title }));
      const secModData = secProgData["Economics"].map(item => ({ title: item.title }));
      const expectedData = primaryModData.concat(secModData);
    
      // Check if the rendered table rows match the expected data
      expect(tableRows).toEqual(expectedData);
    });

    test("Select programme dropdown", async () => {
      const desiredOptionTitle = "CAPT";
      await page.waitForSelector(PROG_AUTOCOMPLETE_SELECTOR);
      await page.focus(PROG_AUTOCOMPLETE_SELECTOR);

      // Enter a value in the input field to trigger the Autocomplete options
      await page.keyboard.type(desiredOptionTitle);

      // Wait for the Autocomplete options to appear
      const optionsSelector = '[role="listbox"] [role="option"]';
      await page.waitForSelector(optionsSelector);

      // Find the option with the desired title
      const optionHandle = await page.evaluateHandle((selector, title) => {
        const options = Array.from(document.querySelectorAll(selector));
        const desiredOption = options.find(option => option.textContent.trim() === title);
        return desiredOption;
      }, optionsSelector, desiredOptionTitle);

      // Click on the desired option
      await optionHandle.click();

      const selectedOption = await page.evaluate(() => {
        const autocompleteInput = document.querySelector("#addon2-selector");
        return autocompleteInput.value;
      });

      await expect(selectedOption).toBe(desiredOptionTitle);
    });

    test("Correctly update Common Mods Table", async () => {      
      // Extract the rendered table rows
      const tableRows1 = await page.$$eval('.commonTable1Rows', (rows) =>
        rows.map((row) => ({
          title: row.querySelector('.commonTable1Cell').innerText.trim(),
        }))
      );
      const tableRows2 = await page.$$eval('.commonTable2Rows', (rows) =>
        rows.map((row) => ({
          title: row.querySelector('.commonTable2Cell').innerText.trim(),
        }))
      );

      const tableRows = tableRows1.concat(tableRows2);
    
      // Define the expected data for comparison
      const utcpData = utcp.map(item => ({ title: item.title }));
      const commonModsData = commonMods["SOC"].map(item => ({ title: item.title }));

      const expectedData = utcpData.concat(commonModsData);
   
      // Check if the rendered table rows match the expected data
      expect(tableRows).toEqual(expectedData);
    });

    test("Open instruction panel button", async () => {
      await page.click(INSTRUCTION_OPEN_BUTTON_SELECTOR);
      await page.waitForSelector(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
      await page.click(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
    });

    test("Successfully saved planner", async () => {
      await page.click(SAVE_PLANNER_BUTTON_SELECTOR);
      await page.waitForTimeout(TIMEOUT);
      await page.reload();
      await page.waitForTimeout(TIMEOUT);
      await page.waitForSelector(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
      await page.click(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
      await page.waitForSelector("#degree-selector");
      const selectedOption = await page.evaluate(() => {
        const autocompleteInput = document.querySelector("#degree-selector");
        return autocompleteInput.value;
      });
      await expect(selectedOption).toBe("Computer Science");
    });
  
    test("Successfully cleared planner", async () => {
      await page.click(CLEAR_PLANNER_BUTTON_SELECTOR);
      await page.waitForSelector(CONFIRM_CLEAR_PLANNER_BUTTON_SELECTOR);
      await page.click(CONFIRM_CLEAR_PLANNER_BUTTON_SELECTOR);
      await page.waitForTimeout(TIMEOUT);
      await page.reload();
      await page.waitForTimeout(TIMEOUT);
      await page.waitForSelector(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
      await page.click(INSTRUCTION_CLEAR_BUTTON_SELECTOR);
      const emptyTableText = await page.evaluate(() => {
        const emptyTableRow = document.querySelector(".progTable1Cell");
        return emptyTableRow.innerText;
      });
      await expect(emptyTableText).toEqual("Please select a degree");
    });
});