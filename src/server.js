const gql = require("graphql-tag");
const {ApolloServer} = require("apollo-server");
const {AuthDirective, DateFormatterDirective} = require("./directives");
const typeDefs = gql`
    directive @autho(requiredRole: String) on FIELD_DEFINITION

    type User {
        id: ID @autho(requiredRole: "Admdin")
        username: String!
        createdAt: String
        settings: Setting
    }

    type Setting {
        user: User
        theme: String
    }

    input NewSettingInput {
        user: ID!
        theme: String
    }

    type Date {
        time: String
    }

    type Query {
        me: User 
        date: Date
        settings(user: ID!): Setting
    }

    input NewUserInput {
        id: ID!
        username: String!
    }

    type Mutation {
        newSetting(input: NewSettingInput) : Setting
        newUser(input: NewUserInput) : User
    }
`;

const resolvers = {
    Mutation: {
        newSetting() {

        },
        newUser() {

        }
    },
    Query: {
        date(_, {input}) {
            console.log("IN QUERY")
            return {
                time: Date.now() + ""
            }
        },   
        me(_, {input}) {
            return {
                id: "123123",
                username: "geroge costanza",
                createdAt: "23123123",
                settings: {}
            }
        },
        settings(_, {input}) {
            return input;
        }
    },
    Setting: {
        user() {
            return {
                id: "123123",
                username: "geroge costanza",
                createdAt: "23123123"
            };
        },
        theme(settings) {
            return (settings && settings.theme) || "DaRK"
        }
    }
}; 


const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
        autho: AuthDirective
    },
    context: () => {
        return  {
            user: {
                role: "Admin"
            }
        }
    }
});

server.listen().then(({url}) => console.log(`listening on ${url}`));