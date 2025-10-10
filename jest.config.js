const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node", //or change to jsdom if testing react
    transform: {
        ...tsJestTransformCfg,
    },
};
