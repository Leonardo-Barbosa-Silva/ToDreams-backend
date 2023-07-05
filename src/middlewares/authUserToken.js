const usersModel = require('../models/user/usersModel')
const jwt = require('jsonwebtoken')


module.exports = async (req, res, next) => {
    try {
        // Check header authorization
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({ message: 'No user token provided' })
        }

        // Check the parts of bearer user token
        const parts = authHeader.split(' ')

        if (parts.length !== 2) {
            return res.status(401).json({ message: 'Token format error' })
        }

        const [ scheme, token ] = parts

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ message: 'Token malformatted' })
        }

        // Check if user token is valid
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) return res.status(401).json({ message: 'User token invalid' })

            req.user = await usersModel.findById(decoded.id)

            next()
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}