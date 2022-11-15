exports.errorName = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    DUPLICATED: 'DUPLICATED',
    NOTFOUND: 'NOTFOUND',
    INVALIDCREDENTIALS: 'INVALIDCREDENTIALS'
} 

exports.errorType = {
    UNAUTHORIZED: {
        message: "Invalid Token",
        statusCode: 401
    },
    DUPLICATED: {
        message: "Duplicated User",
        statusCode: 406
    },
    NOTFOUND: {
        message: "Not Found",
        statusCode: 404
    },
    INVALIDCREDENTIALS: {
        message: "Invalid Credentials",
        statusCode: 401
    }
}