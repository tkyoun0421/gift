import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    plugins: {
      import: (await import("eslint-plugin-import")).default,
    },
    rules: {
      "prettier/prettier": "error",

      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // app은 모든 레이어를 import 가능 (최상위 레이어)

            // widgets는 features, entities, shared만 import 가능
            {
              target: "./widgets/**/*",
              from: "./app/**/*",
              message: "Widgets cannot import from app layer",
            },

            // features는 entities, shared만 import 가능 (같은 도메인 내부는 허용)
            {
              target: "./features/**/*",
              from: "./app/**/*",
              message: "Features cannot import from app layer",
            },
            {
              target: "./features/**/*",
              from: "./widgets/**/*",
              message: "Features cannot import from widgets layer",
            },
            // entities는 shared만 import 가능 (같은 도메인 내부는 허용)
            {
              target: "./entities/**/*",
              from: "./app/**/*",
              message: "Entities cannot import from app layer",
            },
            {
              target: "./entities/**/*",
              from: "./widgets/**/*",
              message: "Entities cannot import from widgets layer",
            },
            {
              target: "./entities/**/*",
              from: "./features/**/*",
              message: "Entities cannot import from features layer",
            },

            // shared는 다른 레이어를 import 불가하지만 같은 레이어끼리는 가능
            {
              target: "./shared/**/*",
              from: "./app/**/*",
              message: "Shared cannot import from app layer",
            },
            {
              target: "./shared/**/*",
              from: "./widgets/**/*",
              message: "Shared cannot import from widgets layer",
            },
            {
              target: "./shared/**/*",
              from: "./features/**/*",
              message: "Shared cannot import from features layer",
            },
            {
              target: "./shared/**/*",
              from: "./entities/**/*",
              message: "Shared cannot import from entities layer",
            },
          ],
        },
      ],

      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-const": "error",

      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];

export default eslintConfig;
