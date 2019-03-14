require('dotenv').config();
import path from 'path';
import { GraphQLServer, Options } from 'graphql-yoga';
import { makeSchema } from 'nexus';
import { mergeSchemas } from 'graphql-tools';
import { generateSchema as githubSchemaGenerator, resolvers as githubSchemaResolvers, extend as githubSchemaExtends } from './schemas/github';
import  * as query  from './resolvers/Query';

async function startServer() {
  const localSchema = makeSchema({
    types: { ...query },
    outputs: {
      schema: path.join(__dirname, '../generated/schema.graphql'),
      typegen: path.join(__dirname, '../generated/types.d.ts'),
    },
  });

  const githubSchema = await githubSchemaGenerator();

  const schema = mergeSchemas({
    schemas: [localSchema, githubSchema, githubSchemaExtends],
    resolvers: {
      ...githubSchemaResolvers
    },
  });

  const server = new GraphQLServer({ schema });
  server.start({ port: '4444' }, ({ port }: Options) =>
    console.log(`Server is running on localhost:${port}`)
  );
}

startServer().catch(error => {
  console.error(error);
});
