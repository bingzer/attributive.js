// karma.conf.js
module.exports = config => {
  config.set({
    frameworks: ["jasmine"],

    files: [
      "src/*.ts",
      "src/data-attributes/*.ts",
      "src/data-models/*.ts",
      "src/data-templates/*.ts",
      "src/data-spinners/*.ts",
      "src/data-walls/*.ts",
      "src/data-partials/*.ts",
      "src/data-apps/*.ts",
      
      "tests/**/*.ts"
    ],

    preprocessors: {
      '**/*.ts': ['typescript']
    },

    typescriptPreprocessor: {
      project: './tsconfig.json'
    },

    browsers: ['ChromeHeadless']
  })
}