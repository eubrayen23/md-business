module.exports = {
  root: true,
  extends: ["expo", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/react-in-jsx-scope": "off"
  },
  ignorePatterns: ["dist", "build", "coverage"]
};
