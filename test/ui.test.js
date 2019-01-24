import faker from 'faker';
import puppeteer from "puppeteer";

const APP = "https://benkimeric.github.io/iReporter/UI/";

const lead = {
    fname: faker.name.firstName(),
    lname: faker.name.lastName(),
    mname: faker.name.firstName(),
    signup_username: faker.name.lastName(),
    email: faker.internet.email(),
    pass: 'us7cgsTs$',
    phone: '072'+faker.random.number(11111111,99999999)
};

const login = {
    username: 'alex',
    pass: 'us7cgsTs$'
}

let page;
let browser;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        args: ['--no-sandbox']
    });
    page = await browser.newPage();
});
afterAll(() => {
    browser.close();
});

describe("Loading", () => {
    test("test that index page can be loaded", async () => {
        await page.goto(APP);
        await page.waitForSelector('#logo');

        const html = await page.$eval('#logo', e => e.innerHTML);
        expect(html).toBe("iReporter");
    }, 10000);
});

describe("Auth tests", () => {
    test("test that a user can ceate an account", async () => {
        await page.goto(APP + 'signup.html');
        await page.waitForSelector("#signup");
        await page.click("input[name=fname]");
        await page.type("input[name=fname]", lead.fname);
        await page.click("input[name=lname]");
        await page.type("input[name=lname]", lead.lname);
        await page.click("input[name=mname]");
        await page.type("input[name=mname]", lead.mname);
        await page.click("input[name=username]");
        await page.type("input[name=username]", lead.signup_username);
        await page.click("input[name=email]");
        await page.type("input[name=email]", lead.email);
        await page.click("input[name=phone]");
        await page.type("input[name=phone]", lead.phone);
        await page.click("input[name=pass]");
        await page.type("input[name=pass]", lead.pass);
        await page.click("input[name=pass2]");
        await page.type("input[name=pass2]", lead.pass);
        // alert
        await page.keyboard.press('Enter');
        await page.on('dialog', async dialog => {
            await dialog.accept();
        });
        // to login
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });
    }, 16000000);

    test("test that a user can login", async () => {
        await page.goto(APP + 'login.html');
        await page.waitForSelector("#login");
        await page.click("input[name=Username]");
        await page.type("input[name=Username]", login.username);
        await page.click("input[name=Password]");
        await page.type("input[name=Password]", login.pass);
        await page.click("input[type=submit]");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    }, 70000);
});

const incident = {
    comment: "new comment from test",
    location: "Nairobi"
}

describe("Inncident tests", () => {
    test("test can load incident record page", async () => {
        await page.goto(APP + 'list.html')
        await page.$x("//a[contains(text(), '+Create New Interevention or Red-flag')]");
        await page.$x("//a[contains(text(), 'View My Red-flags')]");
        await page.$x("//a[contains(text(), 'View My Interventions')]");

    }, 200000)

    test("Create New Interevention or Red-flag", async () => {
        await page.goto(APP + 'flags.html')
        await page.waitForSelector("#new_incident_form");
        await page.click("textarea[name=description]");
        await page.type("textarea[name=description]", incident.comment);
        await page.click("input[name=location]");
        await page.type("input[name=location]", incident.location);
        // select suggested city
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Tab');
        await page.click("input[type=submit]");
        await page.waitForSelector("#flags_error_label");
        await page.screenshot({ path: 'test.png' });
        const success_response = await page.$eval('#flags_error_label', e => e.innerHTML);
        // await page.screenshot({ path: 'test.png' });
        expect(success_response).toBe("Created intervention record");

    }, 2000000)
});
