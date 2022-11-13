
const jwt = require('jsonwebtoken');
const { errorType } = require('./error')

const secret = "%)$2sF55Idf(Rm&jyPnkqAL^+8m4dSw)"; 

const generateToken = (user_info) => {
    let token = jwt.sign({
        data: user_info,
    }, secret, {expiresIn: '24h'});
    return token; 
}

const validateToken = async (token) => {
    if(!token) {
        return null; 
    }
    let validation = await jwt.verify(token.replace('Bearer ', ''), secret)
    return validation;
}

const getErrrorCode = errorName => {
    return errorType[errorName]
}

exports.getErrrorCode = getErrrorCode
exports.generateToken = generateToken
exports.validateToken = validateToken