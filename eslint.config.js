import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import typescript from "@typescript-eslint/eslint-plugin";

export default [
  prettier,
  js.configs.recommended,
  {
    plugins: {
      ts: typescript
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    rules: {}
  },
  {
    ignores: ["dist/", "node_modules/"]
  }
];
