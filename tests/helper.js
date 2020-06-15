const {ApolloServer, gql} = require("apollo-server");
const {createTestClient} = require("apollo-server-testing");
const resolvers = require("../src/resolvers");
const typeDefs = require("../src/typedefs");


module.exports = ctx => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ctx,
    mocks: true,
    mockEntireSchema: false,
  });

  return createTestClient(server);
}