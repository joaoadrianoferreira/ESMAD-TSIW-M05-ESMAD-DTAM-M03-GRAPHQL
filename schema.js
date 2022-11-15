const Apollo = require('apollo-server-express'); 

const schema = Apollo.gql `
    type Query {
        user(id: ID!): User,
        users: [User!],
        message(id: ID!): Message,
        messages: [Message!],
        login(username: String!, password: String!): String!
    }

    type User {
        id: ID!,
        username: String!,
        messages: [Message!]
    }

    type Message {
        id: ID!,
        text: String!,
        user: User!
    }

    type Mutation {
        register(username: String!, password: String!): String!,
        createMessage(text: String!): Message!,
        deleteMessage(id:ID!): String!
    }
`; 

exports.schema =  schema