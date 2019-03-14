const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const {
  introspectSchema,
  makeRemoteExecutableSchema,
  transformSchema,
  FilterRootFields,
} = require('graphql-tools');

const link = new HttpLink({
  uri: 'https://api.github.com/graphql',
  fetch,
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

const generateSchema = async () => {
  const schema = await introspectSchema(link);

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });

  return transformSchema(executableSchema, [
    // TODO: is there a nicer way to filtering out root fields?
    // filter all queries/mutations, we're gonna delegate schema
    new FilterRootFields((operation, field) => false),
  ]);
};

const resolvers = {
  Query: {
    github(parent, args, context, info) {
      return info.mergeInfo.delegateToSchema({
        schema: githubSchema,
        operation: 'query',
        fieldName: 'viewer',
        context,
        info,
      });
    },

  }
}

module.exports = {generateSchema, resolvers};
