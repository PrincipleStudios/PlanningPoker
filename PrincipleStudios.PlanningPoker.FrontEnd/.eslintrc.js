module.exports = {
  extends: [
    "airbnb-typescript",
    // "plugin:import/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "next",
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  ignorePatterns: ["/*.js", "node_modules/", "package*.json", "src/api/"],
  env: {
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    "react",
    "@typescript-eslint",
    "prettier"
  ],
  overrides: [
    {
      files: ['']

    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: "latest",
        "sourceType": "module"
      }
    }
  ],
  rules: {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.stories.tsx", "**/*.test.tsx"]
    }],
		"import/prefer-default-export": 0,
		"react/require-default-props": 0,
		"@typescript-eslint/explicit-module-boundary-types": 0,
		"no-nested-ternary": 0,
		"global-require": 0,
		"react/display-name": 0,
		"@typescript-eslint/no-use-before-define": 0,
		"@typescript-eslint/ban-types": 0,
		"@typescript-eslint/no-non-null-assertion": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"prettier/prettier": ["error", { "endOfLine": "auto" }],
		"react/react-in-jsx-scope": 0,
		"react/jsx-props-no-spreading": 0,
		"react/prop-types": 0,
		"jsx-a11y/label-has-associated-control": 0
  }
};
