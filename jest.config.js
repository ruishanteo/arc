module.exports = {
  testTimeout: 10000,
  setupFiles: ["dotenv/config"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$":
      "<rootDir>/src/testing/integration/mocks/MockFile.js",
  },
};
