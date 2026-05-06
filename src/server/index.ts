import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { join } from 'path';
import { searchResolvers } from './graphql/search/search.resolver';

const app = express();
const PORT = 4000;

app.use(express.json());

const typesArray = loadFilesSync(join(__dirname, '**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

async function startServer() {
  const server = new ApolloServer({
      typeDefs,
      resolvers: searchResolvers,
  });

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