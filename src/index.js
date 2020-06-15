const {PubSub, ApolloServer} = require('apollo-server')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const {createToken, getUserFromToken} = require('./auth')
const db = require('./db')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({connection, req}) {
    if (connection) {
      return {...db, ...connection.context}
    };
    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return {...db, user, createToken}
  },
  subscriptions: {
    onConnect(headers) {
      const token = headers.authorization
      const user = getUserFromToken(token)
      return {user, createToken}
    }
  }
})

server.listen(4000).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`)
})
