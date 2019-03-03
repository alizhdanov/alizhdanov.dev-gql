require('dotenv').config();
const path = require('path');
const { GraphQLServer } = require('graphql-yoga');
const { makeSchema } = require('nexus');
const { mergeSchemas } = require('graphql-tools');
const githubSchemaGenerator = require('./schemas/github');
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

  const schema = mergeSchemas({
    schemas: [localSchema, githubSchema],
  });

  const server = new GraphQLServer({ schema });
  server.start(() => console.log('Server is running on localhost:4000'));
}

startServer().catch(error => {
  console.error(error);
});
