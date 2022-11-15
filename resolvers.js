const models = require('./models')
const utilities = require('./utilities')
const { errorName } = require('./error')
const bcrypt = require('bcrypt');

const resolvers = {
    Query: {
        login: async (parent, {username, password}, {req})=> {
            let exist = await models.User_GQL.findAll({
                where: {
                    username: username
                }
            })
            if(exist.length > 0) {
                let valid = await bcrypt.compare(password, exist[0].password)
                if(valid) {
                    let token = await utilities.generateToken({user: username})
                    return token
                } else {
                    throw new Error(errorName.INVALIDCREDENTIALS)
                }
            } else {
                throw new Error(errorName.NOTFOUND)
            }
        },
        user: async (parent, {id}, {req})=> {  
            let auth = await utilities.validateToken(req.headers.authorization)
            if(auth) {
                return await models.User_GQL.findByPk(id)
            } else {
                throw new Error(errorName.UNAUTHORIZED)
            }
        },
        users: async (parent, arg, {req})=> {  
            let auth = await utilities.validateToken(req.headers.authorization)
            if(auth) {
                return await models.User_GQL.findAll()
            } else {
                throw new Error(errorName.UNAUTHORIZED)
            }
        },
        message: async (parent, {id}, {req})=> {  
            let auth = await utilities.validateToken(req.headers.authorization)
            if(auth) {
                return await models.Message_GQL.findByPk(id)
            } else {
                throw new Error(errorName.UNAUTHORIZED)
            }
        },
        messages: async (parent, arg, {req})=> {  
            let auth = await utilities.validateToken(req.headers.authorization)
            if(auth) {
                return await models.Message_GQL.findAll()
            } else {
                throw new Error(errorName.UNAUTHORIZED)
            }
        }
    },

    Mutation: {
        register: async (parent, {username, password}) => {
            let duplicated = await models.User_GQL.findAll({
                where: {
                    username: username
                }
            }) 

            if(duplicated.length > 0) {
                throw new Error(errorName.DUPLICATED)
            } else {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, async function(err, hash) {
                        await models.User_GQL.create({
                            username: username, 
                            password: hash
                        })
                        
                    })
                })
                return "User Registered"
            }
        }, 
        createMessage: async (parent, {text}, {req})=> {
            let auth = await utilities.validateToken(req.headers.authorization)
            if(auth) {
                let user = await models.User_GQL.findOne({
                    where: {
                        username: auth.data.user
                    }
                })
                return await models.Message_GQL.create({
                    text: text, 
                    gqlUser2Id: user.id
                })
            } else {
                throw new Error(errorName.UNAUTHORIZED)
            }
        },
        deleteMessage: async (parent, {id}, {req}) => {
            let auth = await utilities.validateToken(req.headers.authorization)
            if(auth) {

                let user = await models.User_GQL.findOne({
                    where: {
                        username: auth.data.user
                    }
                })

                let id_user = user.id; 

                let deletedMessage = await models.Message_GQL.destroy({
                    where: {
                        id: id,
                        gqlUser2Id: id_user
                    }
                }) 

                if(deletedMessage == 1) {
                    return "Message Deleted"
                } else {
                    throw new Error(errorName.NOTFOUND)
                }
            } else {
                throw new Error(errorName.UNAUTHORIZED)
            } 
        }
    },

    User: {
        messages: async user => {
            return await models.Message_GQL.findAll({
                where: {
                    gqlUser2Id: user.id
                }
            })
        }
    },

    Message: {
        user: async message => {
            return await models.User_GQL.findByPk(message.gqlUser2Id)
        }
    }
}

exports.resolvers = resolvers;