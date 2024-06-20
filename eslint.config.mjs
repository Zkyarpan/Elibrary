import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        project: "./tsconfig.json", // Specify it only if you have a tsconfig.json file in your project
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Customize your rules here
      "no-unused-vars": "warn", // Warn instead of error for unused variables
      "no-console": "off", // Allow console.log statements
      "no-debugger": "warn", // Warn instead of error for debugger statements
      "quotes": ["warn", "single"], // Warn instead of error for quote style
      "semi": ["warn", "always"], // Warn instead of error for missing semicolons
      "@typescript-eslint/no-unused-vars": "warn", // TypeScript specific rule for unused variables
      "@typescript-eslint/no-explicit-any": "off", // Allow usage of 'any' type
      "@typescript-eslint/explicit-function-return-type": "off", // Turn off explicit return type for functions
      "@typescript-eslint/no-var-requires": "off", // Allow require statements
      "@typescript-eslint/ban-ts-comment": "off", // Allow @ts-ignore comments
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
  },
];
