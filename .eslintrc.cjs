module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}, ./ckeditor5/**/*.{js,cjs,ts}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react"],
    rules: {
        "react/prop-types": "off",
    },
    globals: {
        it: true,
        vi: true,
        describe: true,
        afterEach: true,
        beforeEach: true,
        beforeAll: true,
        afterAll: true,
        describe: true,
        expect: true,
        test: true,
    },
};
