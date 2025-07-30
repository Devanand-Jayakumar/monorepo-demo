import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import allureWriter from '@shelex/cypress-allure-plugin/writer';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
export default defineConfig({
  e2e: {
    setupNodeEvents: async (on, config) => {
      await addCucumberPreprocessorPlugin(on, config);
      allureWriter(on, config);
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      return config;
    },
    env: {
      allure: true,
      allureReuseAfterSpec: true
    },
   // specPattern: "apps/frontend/my-new-app-e2e/src/e2e/features/**/*.feature",
    // supportFile: "apps/frontend/my-new-app-e2e/src/support/e2e.ts",
    specPattern: "src/e2e/features/**/*.feature",
    supportFile: "src/support/e2e.ts",
    baseUrl: "https://visitcloud.com/", // Change as needed
  },
  video: true,
  videosFolder: 'apps/frontend/my-new-app-e2e/cypress/videos',
  reporter: require.resolve('mochawesome'),
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    json: true,
    html: false
  }
});