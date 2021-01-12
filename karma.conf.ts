// karma.conf.js
module.exports = config => {
    config.set({
      frameworks: ["jasmine"],

      files: [
          "src/**/*.ts",
          "tests/**/*.ts"
      ],

      preprocessors: {
        '**/*.ts': ['typescript']
      },

      typescriptPreprocessor: {
        project: './tsconfig.json'
      }
    })
  }