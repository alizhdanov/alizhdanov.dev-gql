const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const {
  introspectSchema,
  makeRemoteExecutableSchema,
  transformSchema,
  FilterRootFields,
  RenameRootFields,
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
    new FilterRootFields((operation, field) => ['viewer'].includes(field)),
    new RenameRootFields((operation, name) =>
      name === 'viewer' ? 'github' : name
    ),
  ]);
};

module.exports = generateSchema;
