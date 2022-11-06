const cors = require('cors'); 
const express = require('express'); 
const Apollo = require('apollo-server-express'); 
const { Sequelize, Model, DataTypes } = require('sequelize')
const app = express(); 
const port = 3000; 

const sequelize = new Sequelize('joaoferr_tsiw', 'joaoferr_tsiw', 'GAa8xvmV3eKrVa8C', {
    host: 'www.joaoferreira.eu',
    dialect: 'mysql' 
})

const User_GQL = sequelize.define('gql_user', {
    username: {
        type: DataTypes.STRING
    }
})

const Message_GQL = sequelize.define('gql_message', {
    text: {
        type: DataTypes.STRING
    }
})

User_GQL.hasMany(Message_GQL)
Message_GQL.belongsTo(User_GQL)

const schema = Apollo.gql `
    type Query {
        me: User,
        user(id: ID!): User,
        users: [User!],
        message(id: ID!): Message,
        messages: [Message!]
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
        createMessage(text: String!, userID: ID!): Message!,
        createUser(username: String!): User!,
        deleteMessage(id:ID!): Boolean!
    }
`; 

const resolvers = {
    Query: {
        me: async ()=> {
            return await User_GQL.findByPk(1);
        },
        user: async (parent, {id}) => {
            return await User_GQL.findByPk(id)
        },
        users: async () => {
            return await User_GQL.findAll()
        },
        message: async (parent, {id}) => {
            return await Message_GQL.findByPk(id)
        },
        messages: async () => {
            return await Message_GQL.findAll()
        }
    },

    Mutation: {
        createMessage: async (parent, {text, userID}) => {
            return await Message_GQL.create({
                text: text, 
                gqlUserId: userID
            })
        },
        createUser: async (parent, {username}) => {
            return await User_GQL.create({
                username: username
            })
        },
        deleteMessage: (parent, {id}) => {
            return Message_GQL.destroy({
                where: {
                    id: id
                }
            }) 
        }
    },

    User: {
        messages: async user => {
            return await Message_GQL.findAll({
                where: {
                    gqlUserId: user.id
                }
            })
        }
    },

    Message: {
        user: async message => {
            return await User_GQL.findByPk(message.gqlUserId)
        }
    }
}

const server = new Apollo.ApolloServer({
    typeDefs: schema, 
    resolvers
})

server.start().then(()=> {
    server.applyMiddleware({app, path: '/graphql'});
    app.use(cors); 
    app.listen(port, ()=>{
        console.log('Apollo Server is running on localhos:' + port + '/graphql');
        sequelize.sync().then(()=> {
            console.log("Connected to Database");
        }).catch(error => {
            console.log(error);
        })
    })
})
