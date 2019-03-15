import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  transformSchema,
  FilterRootFields,
  RenameRootFields,
  // IGraphQLToolsResolveInfo
} from 'graphql-tools';

const link = new HttpLink({
  uri: 'https://api.github.com/graphql',
  fetch,
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

export const generateSchema = async () => {
  const schema = await introspectSchema(link);

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });

  return transformSchema(executableSchema, [
    new FilterRootFields((operation, field) => ['viewer'].includes(field)),
    new RenameRootFields((operation, name) => {
      if (name === 'viewer') {
        return 'github';
      }

      return name;
    }),
  ]);
};

// Nice code, I'd keep it here as example

// export const resolvers = {
//   Query: {
//     async github(parent: any, args: any, context: any, info: IGraphQLToolsResolveInfo) {
//       const githubSchema = await generateSchema();
//       return info.mergeInfo.delegateToSchema({
//         schema: githubSchema,
//         operation: 'query',
//         fieldName: 'viewer',
//         context,
//         info,
//       });
//     },
//
//   }
// };
//
// export const extend: string = `
//   extend type Query {
//     github: User!
//   }
// `;
