import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        ignores: ["client/**", "node_modules/**", "dist/**", "build/**"],
    },
    {
        files: ["**/*.js", "**/*.ts", "**/*.mjs"],
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "off", // Let TS handle this
        }
    }
];