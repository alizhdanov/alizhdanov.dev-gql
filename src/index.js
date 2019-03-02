const path = require('path');
const { GraphQLServer } = require('graphql-yoga');
const { makeSchema } = require('nexus');

const query = require('./resolvers/Query');

const schema = makeSchema({
  types: { ...query },
  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/types.d.ts'),
  },
});

const server = new GraphQLServer({ schema });
server.start(() => console.log('Server is running on localhost:4000'));
