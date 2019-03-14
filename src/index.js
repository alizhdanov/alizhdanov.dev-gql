require('dotenv').config();
const path = require('path');
const { GraphQLServer } = require('graphql-yoga');
const { makeSchema } = require('nexus');
const { mergeSchemas } = require('graphql-tools');
const {generateSchema: githubSchemaGenerator, resolvers: githubSchemaResolvers} = require('./schemas/github');
const query = require('./resolvers/Query');

async function startServer() {
  const localSchema = makeSchema({
    types: { ...query },
    outputs: {
      schema: path.join(__dirname, '../generated/schema.graphql'),
      typegen: path.join(__dirname, '../generated/types.d.ts'),
    },
  });

  const githubSchema = await githubSchemaGenerator();

  const extendableSchema = `
    extend type Query {
      stared(
        ownedByViewer: Boolean
        orderBy: StarOrder
        after: String
        before: String
        first: Int
        last: Int
        ): StarredRepositoryConnection
        
      github: User!
    }
  `;

  const schema = mergeSchemas({
    schemas: [localSchema, githubSchema, extendableSchema],
    resolvers: {
      ...githubSchemaResolvers
    },
  });

  const server = new GraphQLServer({ schema });
  server.start({ port: '4444' }, ({ port }) =>
    console.log(`Server is running on localhost:${port}`)
  );
}

startServer().catch(error => {
  console.error(error);
});
