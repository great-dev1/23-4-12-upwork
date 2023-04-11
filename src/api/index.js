const express = require('express');
const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { Actions } = require('selenium-webdriver/lib/input');
const { CLOSING } = require('ws');
const { personData } = require('../const');
const emojis = require('./emojis');
const chrome = require('selenium-webdriver/chrome');
const router = express.Router();

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const pageTime = 2500;
const intervalTime = 1000;
router.get('/', async (req, res) => {
  console.log(req.query.count);
  for (let i = 0; i < Number(req.query.count); i++) {
    console.log(i);
    try {

      let options = new chrome.Options();
      options.addArguments("--start-maximized");
      options.addArguments("--force-device-scale-factor=0.8"); // Change the scale factor as per your requirement.

      let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      const actions = new Actions(driver);

      await driver.get('https://www.upwork.com/nx/signup/?dest=home');
      await driver.manage().window().maximize();
      // Zoom out using actions() and sendKeys() methods
      await sleep(5000);
      await driver.findElement(By.id('onetrust-accept-btn-handler')).click();
      const radioBtns = await driver.findElements(By.className('up-button-box up-button-box-radio'))
      await radioBtns[1].click();
      const signUpBtn = await driver.findElement(By.className('up-btn up-btn-primary width-md up-btn-block'));
      await signUpBtn.click();
      let upworkTab = await driver.getWindowHandle();
      await driver.switchTo().newWindow('tab');
      await driver.get('https://www.minuteinbox.com/');
      await driver.wait(until.titleIs('MinuteInbox | 10 Minute Mail Service'), 5000);
      const emailCopty = await driver.findElement(By.className('animace'));
      const email = await emailCopty.getText();
      await driver.findElement(By.css('a[title="1 month"]')).click();
      // await sleep(3000);
      // await driver.findElement(By.css('a[title="1 month"]')).click();

      let mailBox = await driver.getWindowHandle();
      await driver.switchTo().window(upworkTab);

      const firstName = personData.firstName[Math.floor(Math.random() * personData.firstName.length)];
      const lastName = personData.lastName[Math.floor(Math.random() * personData.lastName.length)];
      await driver.findElement(By.id('first-name-input')).sendKeys(firstName);
      await driver.findElement(By.id('last-name-input')).sendKeys(lastName);
      await driver.findElement(By.id("redesigned-input-email")).sendKeys(email);
      await driver.findElement(By.id("password-input")).sendKeys(personData.password);
      await driver.findElement(By.css('div[data-test="dropdown-toggle"]')).click();
      await sleep(1000);
      const searchBox = await driver.findElement(By.css('input[type="search"]'));
      await driver.executeScript(`arguments[0].focus()`, searchBox);
      await driver.executeScript(`arguments[0].value = "Ukraine"`, searchBox);
      await searchBox.sendKeys(Key.BACK_SPACE, Key.TAB, Key.TAB, Key.ENTER);

      const checkbox = await driver.findElements(By.className("up-checkbox"));
      await sleep(1000);
      await checkbox[1].click();
      await driver.findElement(By.id("button-submit-form")).click();
      await driver.switchTo().window(mailBox);
      await sleep(12000);
      const mailList = await driver.findElements(By.tagName('td'))
      for (let mail of mailList) {
        const mailContent = await mail.getText();
        if (mailContent === "Verify your email address") {
          console.log(mail);
          await mail.click();
          break;
        }
      }

      await sleep(1000);
      await driver.switchTo().frame("iframeMail");
      await sleep(1000);
      const linkList = await driver.findElements(By.tagName("a"));
      console.log("linkList", linkList);
      await sleep(1000);
      let verifyHref;
      for (let item of linkList) {
        const content = await item.getText();
        console.log(content);
        if (content === "Verify Email") {
          verifyHref = await item.getAttribute("href");
          console.log("href", verifyHref);
          await driver.get(verifyHref)
          break;
        }
      }
      await sleep(3000);

      let startBtns = await driver.findElement(By.className('air3-btn-primary')).click();
      await sleep(intervalTime);
      await driver.findElement(By.className('air3-btn-box-input')).click();
      await sleep(intervalTime);
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(intervalTime);
      await driver.findElement(By.css('input[value="MAIN_INCOME"]')).click();
      await sleep(intervalTime);
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(intervalTime);
      await driver.findElement(By.css('input[aria-labelledby="button-box-15"]')).click();
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime * 2);
      const buttons = await driver.findElements(By.className('air3-btn-secondary'));
      for (let item of buttons) {
        const content = await item.getText();
        console.log(content);
        if (content === "Fill out manually (15 min)") {
          await item.click();
          break;
        }
      }

      /* Title Input Page */
      const inputField = await driver.findElement(By.className('air3-input form-control')).sendKeys(personData.title[Math.floor(Math.random() * personData.title.length)]);
      await sleep(intervalTime);
      const expBtn = await driver.findElement(By.className('air3-btn mb-0 mr-0 air3-btn-primary'));
      await expBtn.click();
      await sleep(intervalTime);
      await driver.findElement(By.css('html[theme=air-3-0] body.fe-onboarding-welcome .b-fe-horizontal-scroll-addnew .air3-btn')).click();
      await sleep(pageTime);
      /* Company Experience Input Page */
      const jobTitleField = await driver.findElement(By.css('input[placeholder="Ex: Software Engineer"]')); await sleep(intervalTime);
      await driver.executeScript(`arguments[0].focus()`, jobTitleField); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(personData.companyData.role); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.ENTER); await sleep(intervalTime);
      const companyField = await driver.findElement(By.css('input[placeholder="Ex: Microsoft"]')); await sleep(intervalTime);
      await driver.executeScript(`arguments[0].focus()`, companyField); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(personData.companyData.name); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.ENTER); await sleep(intervalTime);
      await sleep(500);
      const locationField = await driver.findElement(By.css('input[placeholder="Ex: London"]')); await sleep(intervalTime);
      await driver.executeScript(`arguments[0].focus()`, locationField); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(personData.companyData.city); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.ENTER); await sleep(intervalTime);

      const startMonth = await driver.findElement(By.css('div[aria-labelledby="start-date-month dropdown-label-32"]'));
      await startMonth.click();
      await sleep(intervalTime);
      const startMonthOpt = await driver.findElement(By.xpath('//span[contains(text(), "January")]'));
      await startMonthOpt.click();
      await sleep(intervalTime);
      const startYear = await driver.findElement(By.css('div[aria-labelledby="start-date-year dropdown-label-33"]'));
      await sleep(intervalTime);
      await startYear.click();
      await sleep(intervalTime);
      const startYearOpt = await driver.findElement(By.xpath('//span[contains(text(), "2018")]'));
      await startYearOpt.click();
      await sleep(intervalTime);
      const endMonth = await driver.findElement(By.css('div[aria-labelledby="end-date-month dropdown-label-34"]'));
      await endMonth.click();
      await sleep(intervalTime);
      const endMothOpt = await driver.findElement(By.xpath('//span[contains(text(), "November")]'));
      await endMothOpt.click();
      await sleep(intervalTime);
      const endYear = await driver.findElement(By.css('div[aria-labelledby="end-date-year dropdown-label-35"]'));
      await endYear.click();
      await sleep(intervalTime);
      const endYearOpt = await driver.findElement(By.xpath('//span[contains(text(), "2022")]'));
      await endYearOpt.click();
      await sleep(intervalTime);
      const description = await driver.findElement(By.css('textarea[aria-labelledby="description-label"]'));
      await description.sendKeys(personData.companyData.description);
      const expSaveBtn = await driver.findElement(By.css('button[data-test="save-btn"]'));
      await expSaveBtn.click();
      await sleep(intervalTime);
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime);


      /* Education Experience Input Page */
      await driver.findElement(By.css('button[aria-labelledby="add-education-label"]')).click();
      await sleep(intervalTime);
      const schoolName = await driver.findElement(By.css('input[placeholder="Ex: Boston University"]')); await sleep(intervalTime);
      await driver.executeScript(`arguments[0].focus()`, schoolName); await sleep(intervalTime);
      await schoolName.click(); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(personData.educationData.universityName); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.TAB, Key.TAB, Key.ENTER); await sleep(intervalTime);
      const degree = await driver.findElement(By.css('input[placeholder="Ex: Bachelors"]')); await sleep(intervalTime);
      await driver.executeScript(`arguments[0].focus()`, degree); await sleep(intervalTime);
      await degree.click(); await sleep(1000);
      await driver.switchTo().activeElement().sendKeys(personData.educationData.degree); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.TAB, Key.TAB, Key.ENTER); await sleep(intervalTime);
      const major = await driver.findElement(By.css('input[placeholder="Ex: Business"]')); await sleep(intervalTime);
      await driver.executeScript(`arguments[0].focus()`, major); await sleep(intervalTime);
      await major.click(); await sleep(1000);
      await driver.switchTo().activeElement().sendKeys(personData.educationData.sector); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.TAB, Key.TAB, Key.ENTER); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(personData.educationData.startYear); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.DOWN, Key.ENTER); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.TAB, Key.ENTER); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(personData.educationData.endYear); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.DOWN, Key.ENTER); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(Key.TAB, Key.ENTER); await sleep(intervalTime); //select desciption
      await driver.switchTo().activeElement().sendKeys(personData.educationData.description); await sleep(intervalTime);
      await driver.findElement(By.css('button[data-test="save-btn"]')).click();
      await sleep(intervalTime);
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime);

      /* Language Input Page */
      await driver.findElement(By.css('div[data-test="dropdown-toggle"]')).click();
      await driver.findElement(By.xpath('//span[contains(text(), "Fluent")]')).click();
      await sleep(500);
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime);

      /* Skills Input Page */
      const skillInputField = await driver.findElement(By.css('input[placeholder="Enter skills here"]'));
      await driver.executeScript(`arguments[0].focus()`, skillInputField); await sleep(intervalTime);
      await skillInputField.click(); await sleep(intervalTime);
      for (let skill of personData.skills) {
        await driver.switchTo().activeElement().sendKeys(skill); await sleep(intervalTime);
        await driver.switchTo().activeElement().sendKeys(Key.DOWN, Key.ENTER); await sleep(intervalTime);
      }
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime);

      /* Summary Input Page */
      const overview = await driver.findElement(By.css('textarea[data-test="overview"]'));
      await overview.sendKeys(personData.summary);
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime);
      await driver.findElement(By.css('button[aria-label="Web Development"]')).click();
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime);
      const hourlyField = await driver.findElement(By.css('input[aria-describedby="hourly-rate-description"]'));
      await driver.executeScript(`arguments[0].focus()`, hourlyField); await sleep(1000);
      await hourlyField.click(); await sleep(500);
      await driver.switchTo().activeElement().sendKeys(personData.hourlyRate); await sleep(500);
      await driver.findElement(By.css('button[data-test="step-next-button"]')).click();
      await sleep(pageTime);


      /* Avatar, Address Input Page */
      const streetInput = await driver.findElement(By.css('input[aria-labelledby="street-label"]'));
      await streetInput.click(); await sleep(intervalTime);
      streetInput.sendKeys(personData.street);
      const cityInput = await driver.findElement(By.css('input[aria-labelledby="city-label"]'));
      await driver.executeScript(`arguments[0].focus()`, cityInput); await sleep(intervalTime);
      await cityInput.click(); await sleep(intervalTime);
      await driver.switchTo().activeElement().sendKeys(personData.city); await sleep(1500);
      await driver.switchTo().activeElement().sendKeys(Key.DOWN, Key.ENTER); await sleep(intervalTime);
      const telInput = await driver.findElement(By.css('input[type="tel"]'));
      await driver.executeScript(`arguments[0].focus()`, telInput); await sleep(intervalTime);
      await telInput.sendKeys(personData.phone); await sleep(intervalTime);
      await sleep(intervalTime);
      //upload image
      await driver.findElement(By.css('button[data-cy="open-loader"]')).click();
      await sleep(intervalTime);
      const fileInput = await driver.findElement(By.css('input[name="imageUpload"]'));
      const filePath = personData.avatarUrl[Math.floor(Math.random() * personData.avatarUrl.length)];
      await fileInput.sendKeys(filePath);
      await sleep(intervalTime);
      const btns = await driver.findElements(By.className("air3-btn air3-btn-primary"));
      await btns[1].click();
      await sleep(pageTime * 2);
      await btns[0].click();
      await sleep(pageTime * 2);
      await driver.findElement(By.className("air3-btn air3-btn-primary")).click();
      await sleep(pageTime * 2);
      /* Submit Page */
      await driver.findElement(By.className("air3-btn air3-btn-primary")).click();

      await sleep(pageTime);
      await driver.findElement(By.css('button[data-ev-unique_element_id="t-cfeui_qp_Close_8"]')).click();
      await sleep(pageTime);
      // await driver.findElement(By.css('button[data-test="job-search-button"]')).click();
      // await sleep(pageTime);

      // const filterInput = await driver.findElement(By.css('input[placeholder="Select Categories"]')); //all web
      // await driver.executeScript(`arguments[0].focus()`, filterInput); await sleep(intervalTime);
      // await filterInput.click(); await sleep(intervalTime);
      // await driver.switchTo().activeElement().sendKeys("web"); await sleep(1000);
      // await driver.switchTo().activeElement().sendKeys(Key.DOWN, Key.ENTER); await sleep(intervalTime);
      // const checkFilters = await driver.findElements(By.css('div[data-test-key="1"]')); //payment verified
      // await checkFilters[1].click();
      // await sleep(intervalTime);

      // await driver.switchTo().newWindow('tab');
      // await sleep(5000);
      // await driver.get('https://www.upwork.com/ab/messages/rooms/?sidebar=true');
      // await sleep(5000);

      const curTime = new Date();
      let newData = "\n" + email + " : " + curTime;
      console.log(newData);
      fs.appendFile('./emailList.txt', newData, (err) => {
        console.log(err);
      });


    } catch (err) {
      console.log(err);
    }
  }

  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});
// By.cssSelector("a[href='mysite.com']");
router.use('/emojis', emojis);

module.exports = router;
