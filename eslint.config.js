import dx from "@eoussama/dx";



export default dx().append({
  files: ["test/**/*.js"],
  languageOptions: {
    globals: {
      describe: "readonly",
      it: "readonly",
      test: "readonly",
      expect: "readonly",
      beforeAll: "readonly",
      beforeEach: "readonly",
      afterAll: "readonly",
      afterEach: "readonly",
      jest: "readonly",
      require: "readonly",
      module: "readonly",
      exports: "readonly",
    },
  },
});
