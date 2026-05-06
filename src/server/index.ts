import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

const app = express();
const PORT = 4000;

app.use(express.json());

// Basic schema to get started
const typeDefs = `
  type Query {
    hello: String
  }
`;

// Basic resolver to match
const resolvers = {
  Query: {
    hello: () => 'Hello from Dwellr!',
  },
};

async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
    });
}

startServer();