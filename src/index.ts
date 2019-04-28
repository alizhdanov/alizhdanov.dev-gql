// tslint:disable-next-line no-var-requires
require('dotenv').config();
import path from 'path';
import { GraphQLServer, Options } from 'graphql-yoga';
import { makeSchema } from 'nexus';
import { mergeSchemas } from 'graphql-tools';
import { getUser } from './utils/jwt';
import { generateSchema as githubSchemaGenerator } from './schemas/github';
import * as query from './resolvers/Query';
import * as mutation from './resolvers/Mutation';
import { rule, shield, not } from 'graphql-shield';

async function startServer() {
  const localSchema = makeSchema({
    types: { ...query, ...mutation },
    outputs: {
      schema: path.join(__dirname, '../generated/schema.graphql'),
      typegen: path.join(__dirname, '../generated/types.d.ts'),
    },
  });

  const githubSchema = await githubSchemaGenerator();

  const schema = mergeSchemas({
    schemas: [localSchema, githubSchema],
  });

  const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return ctx.user !== null;
  });

  const permissions = shield({
    Query: {
      instagram: isAuthenticated,
      github: isAuthenticated,
    },
    Mutation: {
      login: not(isAuthenticated),
      signup: not(isAuthenticated),
    },
  });

  const server = new GraphQLServer({
    schema,
    middlewares: [permissions],
    context: ({ request }) => {
      const token = request.headers.authorization || '';

      const user = getUser(token);

      return {
        user,
      };
    },
  });

  server.start({ port: '4444' }, ({ port }: Options) =>
    // tslint:disable-next-line no-console
    console.log(`Server is running on localhost:${port}`)
  );
}

startServer().catch(error => {
  // tslint:disable-next-line no-console
  console.error(error);
});

// some bug with nodemon
process.on('SIGINT', () => {
  process.exit();
});
