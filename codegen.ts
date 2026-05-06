import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'src/server/graphql/**/*.graphql',
    generates: {
        'src/generated/types.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
        },
    },
};

export default config;
