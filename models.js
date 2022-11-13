const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize('joaoferr_tsiw', 'joaoferr_tsiw', 'GAa8xvmV3eKrVa8C', {
    host: 'www.joaoferreira.eu',
    dialect: 'mysql' 
})

const User_GQL = sequelize.define('gql_user2', {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
})

const Message_GQL = sequelize.define('gql_message2', {
    text: {
        type: DataTypes.STRING
    }
})

User_GQL.hasMany(Message_GQL)
Message_GQL.belongsTo(User_GQL)

sequelize.sync().then(()=> {
    console.log("Connected to Database");
}).catch(error => {
    console.log(error);
})

exports.User_GQL = User_GQL; 
exports.Message_GQL = Message_GQL;