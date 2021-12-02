const cors = require('cors')
const express =  require('express')
const Apollo = require('apollo-server-express')
const app = express()
const port = 3000

const schema = Apollo.gql `
    type Query {
        me: User
    }

    type User {
        usersame: String!
    }
`

const resolvers = {
    Query: {
        me: () => {
            return {
                username: "João Ferreira"
            }
        }
    }
}

const server = new Apollo.ApolloServer({
    typeDefs: schema, 
    resolvers
}); 

server.applyMiddleware({app, path: '/graphql'}); 
app.use(cors()); 
app.listen(port, function() {
    console.log("Apollo Server on localhost:" + port + "/graphql"); 
})  