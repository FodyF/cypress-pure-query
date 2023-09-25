const { defineConfig } = require("cypress")
const webpackPreprocessor = require("@cypress/webpack-preprocessor")
const path = require('path')
const browserLaunch = require("./cypress.config-browser.launch.js")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", browserLaunch)

      // @src & @cypress aliases
      const options = {
        webpackOptions: {             
          resolve: {            
            extensions: ['.ts', '.js', '.mjs'],     
            alias: {                     
              '@cypress': path.resolve(__dirname, './cypress'),
              '@src': path.resolve(__dirname, './src')          
            },             
          },         
        },     
        watchOptions: {},
      }
      on('file:preprocessor', file => webpackPreprocessor(options)(file))
      return config
    },
  },
  reporter: 'mochawesome',
});
