import js from '@eslint/js';
import typescript from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    prettier,
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
