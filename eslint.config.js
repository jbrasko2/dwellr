import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';
import typescript from 'typescript-eslint';
import path from 'path';

export default typescript.config(
    {
        name: 'Global Ignores',
        ignores: [
            '**/node_modules/*',
            '**/dist/*',
            '**/build/*',
            '.*',
            '**/coverage/*',
            'src/generated/**',
        ],
    },
    {
        name: 'All Files',
        plugins: {
            import: importPlugin,
            jsdoc,
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        rules: {
            // Base ESLint Rules
            ...js.configs.recommended.rules,
            eqeqeq: ['error', 'smart'],
            'no-duplicate-imports': 'error',
            'guard-for-in': 'error',
            'no-template-curly-in-string': 'error',
            radix: 'error',
            'no-shadow': 'error',
            'spaced-comment': 'error',
            'no-bitwise': 'error',
            'no-caller': 'error',
            'no-eval': 'error',
            'no-new-wrappers': 'error',
            'no-return-await': 'error',
            'no-throw-literal': 'error',
            'no-trailing-spaces': 'error',
            'no-unused-expressions': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-const': 'error',
            'no-undef': 'off',
            // Import Rules
            'import/order': [
                'error',
                {
                    groups: [
                        'external',
                        'builtin',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: false,
                    },
                },
            ],
            'import/no-extraneous-dependencies': [
                'error',
                {
                    includeTypes: true,
                },
            ],
            // JSDoc rules
            'jsdoc/tag-lines': ['warn', 'any', { startLines: 1 }],
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-param-description': 'off',
            'jsdoc/no-undefined-types': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-returns-type': 'off',
            'jsdoc/require-returns-description': 'off',
        },
    },
    {
        name: 'All TypeScript Files',
        files: ['**/*.ts', '**/*.tsx'],
        extends: [...typescript.configs.recommended],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'objectLiteralProperty',
                    format: null,
                    modifiers: ['requiresQuotes'],
                },
                {
                    selector: ['typeAlias', 'interface', 'class'],
                    format: ['PascalCase'],
                },
            ],
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { destructuredArrayIgnorePattern: '^_' },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    fixStyle: 'inline-type-imports',
                    disallowTypeAnnotations: false,
                },
            ],
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'warn',
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                {
                    assertionStyle: 'never',
                },
            ],
            // Relaxed rules - tune as needed
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    },
    {
        name: 'Client TypeScript',
        files: ['src/client/**/*.ts', 'src/client/**/*.tsx'],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: path.join(import.meta.dirname, 'src/client'),
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'no-console': 'error',
        },
    },
    {
        name: 'React Components/Hooks/Context',
        files: ['src/client/**/*.tsx'],
        plugins: {
            react,
            'react-compiler': reactCompiler,
            'jsx-a11y': jsxA11yPlugin,
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,
            ...jsxA11yPlugin.flatConfigs.strict.rules,
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            'react/jsx-max-depth': ['error', { max: 10 }],
            'react-compiler/react-compiler': 'warn',
            'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
            'jsx-a11y/no-static-element-interactions': 'error',
        },
    },
    {
        name: 'Server TypeScript',
        files: ['src/server/**/*.ts', 'src/generated/**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        name: 'All Test Files',
        files: ['**/*.test.ts', '**/*.test.tsx'],
        plugins: {
            jest: jestPlugin,
        },
        rules: {
            ...jestPlugin.configs['flat/recommended'].rules,
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/consistent-type-assertions': 'off',
            'jest/no-disabled-tests': 'error',
        },
    },
    {
        name: 'React Tests',
        files: ['src/client/**/*.test.tsx'],
        plugins: {
            ...testingLibraryPlugin.configs['flat/react'].plugins,
            ...jestDomPlugin.configs['flat/recommended'].plugins,
            'react-compiler': reactCompiler,
        },
        rules: {
            ...testingLibraryPlugin.configs['flat/react'].rules,
            ...jestDomPlugin.configs['flat/recommended'].rules,
            'testing-library/no-debugging-utils': 'error',
            'testing-library/no-dom-import': 'error',
            'testing-library/no-manual-cleanup': 'error',
            'testing-library/no-node-access': 'error',
            'testing-library/prefer-screen-queries': 'error',
            'testing-library/no-wait-for-multiple-assertions': 'warn',
            'react-compiler/react-compiler': 'off',
            'jsdoc/check-tag-names': [
                'error',
                {
                    definedTags: ['jest-environment'],
                },
            ],
            'testing-library/prefer-explicit-assert': 'off',
            'testing-library/no-unnecessary-act': 'off',
        },
    },
    {
        name: 'Mock Files',
        files: ['src/**/*.mock*', 'src/**/__mocks__/**'],
        rules: {
            '@typescript-eslint/consistent-type-assertions': 'off',
        },
    },
    {
        name: 'Boundaries',
        plugins: {
            boundaries,
        },
        settings: {
            'boundaries/elements': [
                { type: 'client', pattern: 'src/client/*' },
                { type: 'server', pattern: 'src/server/*' },
                { type: 'generated', pattern: 'src/generated/*' },
                { type: 'components', pattern: 'src/components/*' },
            ],
        },
        rules: {
            'boundaries/dependencies': [
                'error',
                {
                    default: 'disallow',
                    rules: [
                        {
                            from: { type: 'client' },
                            allow: [
                                { to: { type: 'client' } },
                                { to: { type: 'generated' } },
                                { to: { type: 'components' } },
                            ],
                        },
                        {
                            from: { type: 'server' },
                            allow: [
                                { to: { type: 'server' } },
                                { to: { type: 'generated' } },
                                { to: { type: 'components' } },
                            ],
                        },
                        {
                            from: { type: 'generated' },
                            allow: [{ to: { type: 'generated' } }],
                        },
                        {
                            from: { type: 'components' },
                            allow: [{ to: { type: 'components' } }],
                        },
                    ],
                },
            ],
        },
    },
    // Disables stylistic rules covered by prettier formatting
    prettier,
);
