import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import reactRecommended from "eslint-plugin-react";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default tseslint.config(
  { ignores: ["dist", "client"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-x": reactX,
      "react-dom": reactDom,
      "react": reactRecommended,
      "prettier": eslintPluginPrettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactX.configs["recommended-typescript"].rules,
      ...reactDom.configs.recommended.rules,
      ...reactRecommended.configs.recommended.rules,
      ...eslintPluginPrettier.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
