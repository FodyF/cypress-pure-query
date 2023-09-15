
module.exports = (browser = {}, launchOptions) => {

  if (browser.family === 'chromium' && browser.name !== 'electron') {
    // auto open devtools
    launchOptions.args.push('--auto-open-devtools-for-tabs')
  }

  if (browser.family === 'firefox') {
    // auto open devtools
    launchOptions.args.push('-devtools')
  }

  if (browser.name === 'electron') {
    // auto open devtools
    launchOptions.preferences.devTools = true
  }

  return launchOptions
}