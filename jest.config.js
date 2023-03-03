module.exports = {
    bail: 1,
    verbose: true,
    testTimeout: 60000,
    testMatch: ["<rootDir>/__tests__/*/*/*.js", "<rootDir>/__tests__/*/*/*.ts"],
    modulePathIgnorePatterns: ["<rootDir>/.aws-sam/"],
    preset: "ts-jest",
};
