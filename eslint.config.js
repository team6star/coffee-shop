const vuePlugin = require("eslint-plugin-vue");
const typescriptEslintParser = require("@typescript-eslint/parser");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const prettierPlugin = require("eslint-plugin-prettier");

// 调试信息
console.log("vuePlugin:", vuePlugin);
console.log("typescriptEslintPlugin:", typescriptEslintPlugin);
console.log("prettierPlugin:", prettierPlugin);

try {
  console.log(
    'vuePlugin.configs["vue3-essential"]:',
    vuePlugin.configs["vue3-essential"],
  );
  console.log(
    "typescriptEslintPlugin.configs.recommended:",
    typescriptEslintPlugin.configs.recommended,
  );
  console.log(
    "prettierPlugin.configs.recommended:",
    prettierPlugin.configs.recommended,
  );
} catch (error) {
  console.error("Error accessing config rules:", error);
}

module.exports = [
  {
    ignores: ["node_modules", "dist"],
    files: ["**/*.js", "**/*.ts", "**/*.vue"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        node: true,
        es6: true,
      },
    },
    plugins: {
      vue: vuePlugin,
      "@typescript-eslint": typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...(vuePlugin.configs["vue3-essential"] || {}).rules,
      ...(typescriptEslintPlugin.configs.recommended || {}).rules,
      "no-console": "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      ...(prettierPlugin.configs.recommended || {}).rules,
    },
  },
];
