import "core-js";
const puppeteer = require("puppeteer");

// Configurations
const TIMEOUT = 1500;
const FORUM_PAGE_URL = "http://localhost:3000/forum";
const NEW_FORUM_PAGE_URL = `${FORUM_PAGE_URL}/new`;
const LOGIN_PAGE_URL = "http://localhost:3000/login";
const REGISTER_PAGE_URL = "http://localhost:3000/register";

// Selectors
const TITLE_FIELD_SELECTOR = "#title";
const POST_FIELD_SELECTOR = "#post";
const POST_FORM_SELECTOR = "#post-form";
const COMMENT_FORM_SELECTOR = "#comment-form";
const COMMENT_FIELD_SELECTOR = "#comment";
const SUBMIT_BUTTON_SELECTOR = "#submit-button";

const VIEW_POST_BUTTON_SELECTOR = "#view-post-button";
const EDIT_POST_BUTTON_SELECTOR = "#edit-post-button";
const SUBMIT_EDIT_POST_BUTTON_SELECTOR = "#submit-post-button";
const DELETE_POST_BUTTON_SELECTOR = "#delete-post-button";
const CONFIRM_DELETE_POST_BUTTON_SELECTOR = "#confirm-delete-post-button";

const EDIT_COMMENT_FORM_SELECTOR = "#edit-comment-form";
const EDIT_COMMENT_FIELD_SELECTOR = "#edit-comment";
const EDIT_COMMENT_BUTTON_SELECTOR = "#edit-comment-button";
const SUBMIT_EDIT_COMMENT_BUTTON_SELECTOR = "#submit-comment-button";
const DELETE_COMMENT_BUTTON_SELECTOR = "#delete-comment-button";
const CONFIRM_DELETE_COMMENT_BUTTON_SELECTOR = "#confirm-delete-comment-button";

const NAME_FIELD_SELECTOR = "#name";
const EMAIL_FIELD_SELECTOR = "#email";
const PASSWORD_FIELD_SELECTOR = "#password";
const LOGIN_FORM_SELECTOR = "#login-form";
const REGISTER_FORM_SELECTOR = "#register-form";

// Globals
let browser;
let page;

const name = "forumtester";
const email = "forumtester@test.com";
const password = "123456";
const user_registered = false;
let consoleMessages = [];

/* -------------------------------------------------------------------------- */
/*                               HELPER METHODS                               */
/* -------------------------------------------------------------------------- */
async function newBrowser() {
  if (browser) await browser.close();
  browser = await puppeteer.launch({ defaultViewport: null, headless: "old" });
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

async function registerAccount() {
  await reset(REGISTER_PAGE_URL);
  await page.waitForSelector(REGISTER_FORM_SELECTOR);
  await page.type(NAME_FIELD_SELECTOR, name);
  await page.type(EMAIL_FIELD_SELECTOR, email);
  await page.type(PASSWORD_FIELD_SELECTOR, password);
  await page.click(SUBMIT_BUTTON_SELECTOR);
  await page.waitForNavigation();
}

async function loginAccount() {
  await reset(LOGIN_PAGE_URL);
  await page.waitForSelector(LOGIN_FORM_SELECTOR);
  await page.type(EMAIL_FIELD_SELECTOR, email);
  await page.type(PASSWORD_FIELD_SELECTOR, password);

  await page.click(SUBMIT_BUTTON_SELECTOR);
  await page.waitForNavigation();
}

async function fillInPostForm(inputTitle, inputPost) {
  await page.goto(NEW_FORUM_PAGE_URL);
  await page.waitForSelector(POST_FORM_SELECTOR);
  await page.type(TITLE_FIELD_SELECTOR, inputTitle);
  await page.type(POST_FIELD_SELECTOR, inputPost);
  await page.click(SUBMIT_BUTTON_SELECTOR);
}
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                 FORUM: POST                                */
/* -------------------------------------------------------------------------- */
describe("Forum Page: Post", () => {
  const title = "Lorem, ipsum dolor sit amet consectetur!";
  const post =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  const edited_title = `edited_title`;
  const edited_post = `edited_post`;

  beforeAll(async () => {
    if (user_registered) {
      await loginAccount();
    } else {
      await registerAccount();
    }
  });

  test("Empty form fields", async () => {
    await page.goto(NEW_FORUM_PAGE_URL);
    await page.waitForSelector(POST_FORM_SELECTOR);
    await page.click(SUBMIT_BUTTON_SELECTOR);
    const fields = ["title", "post"];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      await expectValidationErrorMessage(page, field, "Required");
    }
  });

  test("Create new post", async () => {
    await fillInPostForm(title, post);
    await page.waitForNavigation();
    await expectText(title);
    await expectText(post);
  });

  test("Go to post", async () => {
    await page.waitForSelector(VIEW_POST_BUTTON_SELECTOR);
    await page.click(VIEW_POST_BUTTON_SELECTOR);

    await expectText(title);
    await expectText(post);
  });

  test("Edit post with blank", async () => {
    await page.click(EDIT_POST_BUTTON_SELECTOR);
    await page.waitForSelector(POST_FORM_SELECTOR);
    await clearInputFromField(TITLE_FIELD_SELECTOR);
    await clearInputFromField(POST_FIELD_SELECTOR);
    await page.click(SUBMIT_EDIT_POST_BUTTON_SELECTOR);
    await page.waitForTimeout(TIMEOUT);
    await expectValidationErrorMessage(page, "title", "Required");
    await expectValidationErrorMessage(page, "post", "Required");
  });

  test("Edit post", async () => {
    await page.type(TITLE_FIELD_SELECTOR, edited_title);
    await page.type(POST_FIELD_SELECTOR, edited_post);
    await page.click(SUBMIT_EDIT_POST_BUTTON_SELECTOR);

    await page.waitForTimeout(TIMEOUT);
    await page.reload();
    await expectText(edited_title);
    await expectText(edited_post);
  });

  test("Delete post", async () => {
    await page.click(DELETE_POST_BUTTON_SELECTOR);
    await page.click(CONFIRM_DELETE_POST_BUTTON_SELECTOR);
    await page.waitForNavigation();
    await expectText("No posts found.");
  });
});
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                POST: COMMENT                               */
/* -------------------------------------------------------------------------- */
describe("Forum Page: Comment", () => {
  const text =
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.";

  const edited_text = "edited_comment";

  async function fillInForm(inputText) {
    await page.waitForSelector(COMMENT_FORM_SELECTOR);
    await page.type(COMMENT_FIELD_SELECTOR, inputText);
    await page.click("#new-comment-button");
  }

  beforeAll(async () => {
    fillInPostForm("post", "post body");
    await page.waitForSelector(VIEW_POST_BUTTON_SELECTOR);
    await page.click(VIEW_POST_BUTTON_SELECTOR);
    await page.waitForTimeout(TIMEOUT);
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Empty form fields", async () => {
    await page.click("#new-comment-button");
    await expectValidationErrorMessage(page, "comment", "Required");
  });

  test("Create new comment", async () => {
    await fillInForm(text);
    await page.waitForTimeout(TIMEOUT);
    await expectText(text);
  });

  test("Edit comment with blank", async () => {
    await page.click(EDIT_COMMENT_BUTTON_SELECTOR);
    await page.waitForSelector(EDIT_COMMENT_FORM_SELECTOR);
    await clearInputFromField(EDIT_COMMENT_FIELD_SELECTOR);
    await page.click(SUBMIT_EDIT_COMMENT_BUTTON_SELECTOR);
    await page.waitForTimeout(TIMEOUT);
    await expectValidationErrorMessage(page, "edit-comment", "Required");
  });

  test("Edit comment", async () => {
    await page.type(EDIT_COMMENT_FIELD_SELECTOR, edited_text);
    await page.click(SUBMIT_EDIT_COMMENT_BUTTON_SELECTOR);

    await page.waitForTimeout(TIMEOUT);
    await page.reload();
    await expectText(edited_text);
  });

  test("Delete comment", async () => {
    await page.click(DELETE_COMMENT_BUTTON_SELECTOR);
    await page.click(CONFIRM_DELETE_COMMENT_BUTTON_SELECTOR);
    await expectText("No comments... Be the first to comment!");
  });
});
/* -------------------------------------------------------------------------- */
