import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // Automatically finds the tsconfig.json for each file (most performant in typescript-eslint v8)
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 1. Core Code-Quality Rules
      "eqeqeq": ["error", "always"], // Enforces strict equality (=== and !==) to avoid JS type coercion issues
      "no-cond-assign": ["error", "always"], // Disallows assignment in conditionals (e.g., if (x = y)) which is usually a typo for == or ===
      "curly": ["error", "all"], // Forces curly braces for all control flow blocks to avoid dangling statement bugs
      "no-console": ["warn", { allow: ["warn", "error", "info"] }], // Discourages leftover debug logs in production

      // 2. TypeScript-Specific Rules
      "@typescript-eslint/no-explicit-any": "warn", // Warns against using "any" to encourage proper TypeScript typing

      // 3. Type-Aware TypeScript Rules (Critical for catching the async/promise bugs we found)
      "@typescript-eslint/no-floating-promises": "error", // REQUIRES promises to be handled (awaited, returned, or caught) to prevent unhandled rejections
      "@typescript-eslint/await-thenable": "error", // Disallows awaiting values that are not promises (helps catch typos where async is expected but not present)

      // Prevents passing async functions where synchronous functions are expected (e.g. event listeners)
      // We disable checksVoidReturn for arguments so Express route handlers returning void/Promise<void> are allowed
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],

      // Unused variables detection (TypeScript aware)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // Ignore build output, dependencies, and configuration files
    ignores: [
      "dist/**",
      "node_modules/**",
      "tsdown.config.ts",
      "eslint.config.js",
    ],
  }
);
