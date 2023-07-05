const jwt = require('jsonwebtoken')

module.exports = async function jwtGenerate(userID) {
    return jwt.sign({ id: userID }, process.env.JWT_SECRET)
}