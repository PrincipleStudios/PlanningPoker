module.exports = {
  "extends": ["next","next/core-web-vitals"],
  ignorePatterns: [
    "/*.js",
    "node_modules/",
    "package*.json",
    "src/api/"
  ],
  "env": {
      "jest": true
  }
};
