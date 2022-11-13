const cors = require('cors'); 
const express = require('express'); 
const Apollo = require('apollo-server-express'); 
const { Sequelize, Model, DataTypes } = require('sequelize')
const app = express(); 
const port = 3000; 

const schema = require('./schema').schema
const resolvers = require('./resolvers').resolvers
const utilities = require('./utilities')

const server = new Apollo.ApolloServer({
    typeDefs: schema, 
    resolvers,
    context: ({ req }) => {
        return {
          req,
        };
    },
    formatError: (err) => {
        const error = utilities.getErrrorCode(err.message);
        return ({message: error.message, statusCode: error.statusCode})
    }
})

server.start().then(()=> {
    server.applyMiddleware({app, path: '/graphql'});
    app.use(cors); 
    app.listen(port, ()=>{
        console.log('Apollo Server is running on localhos:' + port + '/graphql');
    })
})
