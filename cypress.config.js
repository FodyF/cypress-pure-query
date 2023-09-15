const { defineConfig } = require("cypress");
const browserLaunch = require("./cypress.config-browser.launch.js");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", browserLaunch);
    },
  },
});
