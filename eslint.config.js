import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist', 'dist-extension'] },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
            }],
        },
    },
    {
        files: ['extension/**/*.js'],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.webextensions,
            },
        },
        rules: {
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
        },
    },
    {
        // The content-script bootstrap is the one classic (non-module) script;
        // it dynamically import()s the ES-module runtime.
        files: ['extension/content.js'],
        languageOptions: {
            sourceType: 'script',
        },
    },
    {
        // Node-run tooling and tests (node --test, build/validation scripts).
        files: ['scripts/**/*.mjs', 'extension/test/**/*.mjs'],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: globals.node,
        },
        rules: {
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
        },
    },
    {
        // Browser-integration tests run Node (Playwright driver) but their
        // page.evaluate() callbacks execute inside Chromium with the extension
        // loaded, so browser and webextension globals are legitimate here.
        files: ['extension/test/browser/**/*.mjs'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.webextensions,
            },
        },
        rules: {
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
        },
    },
)
