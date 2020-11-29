const cors = require('cors')
const express = require('express')
const Apollo = require('apollo-server-express')
const app = express()
const port = 3000

let users = {
    1: {
        id: 1, 
        username: "João Ferreira",
    },
    2: {
        id: 2, 
        username: "Manuel Marques",
    }, 
    3: {
        id: 3, 
        username: "Pedro Couto",
    }
}

let messages = {
    1: {
        id: 1, 
        text: "Hello",
        userID: 1
    },
    2: {
        id: 2,
        text: "World",
        userID: 2
    },
    3: {
        id: 3,
        text: "ESMAD",
        userID: 3
    }
}

const schema = Apollo.gql `
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]

        message(id: ID!): Message
        messages: [Message!]
    }

    type User {
        id: ID!
        username: String!
        special: String!
        messages: [Message!]
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }

    type Mutation {
        createMessage(text: String!, userID: ID!): Message!
        deleteMessage(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        me: () => {
            return users[1]
        },
        user: (parent, {id}) => {
            return users[id]
        }, 
        users: () => {
            return Object.values(users)
        },
        message: (parent, {id}) => {
            return messages[id]
        },
        messages: () => {
            return Object.values(messages)
        }
    },

    Mutation: {
        createMessage: (parent, {text, userID}) => {
            let id = Object.keys(messages).length + 1
            let message = {
                id: id,
                text: text,
                userID: userID
            }

            messages[id] = message; 

            return message; 
        },
        deleteMessage: (parent, {id}) => {
            if (!messages[id]) {
                return false;
            } else {
                delete messages[id];
                return true;
            }
        }
    },

    User: {
        special: parent => {
            return parent.username + "_" + parent.id
        }, 
        messages: user => {
            return Object.values(messages).filter(
                message => message.userID == user.id
            )
        }
    },

    Message: {
        user: message => {
            return users[message.userID]
        }
    }
}; 

const server = new Apollo.ApolloServer({
    typeDefs: schema, 
    resolvers
}); 

server.applyMiddleware({app, path: '/graphql'}); 
app.use(cors()); 
app.listen(port, function() {
    console.log("Apollo Server on localhost:" + port + "/graphql"); 
})  