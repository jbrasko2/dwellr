import js from '@eslint/js';
import typescript from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'path';

export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    prettier,
    {
        files: ['src/client/**/*.{ts,tsx}'],
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
        },
    },
    {
        files: ['src/server/**/*.ts', 'src/generated/**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            boundaries,
        },
        settings: {
            'boundaries/elements': [
                { type: 'client', pattern: 'src/client/*' },
                { type: 'server', pattern: 'src/server/*' },
                { type: 'generated', pattern: 'src/generated/*' },
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
                            ],
                        },
                        {
                            from: { type: 'server' },
                            allow: [
                                { to: { type: 'server' } },
                                { to: { type: 'generated' } },
                            ],
                        },
                        {
                            from: { type: 'generated' },
                            allow: [{ to: { type: 'generated' } }],
                        },
                    ],
                },
            ],
        },
    },
];