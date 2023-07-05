const usersModel = require('../../models/user/usersModel')
const jwtGenerate = require('../../auth/jwtGenerate')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')



module.exports = {

    // @desc Create a new user
    // @route POST v1/api/users/register
    // @acess Public
    registerUser: async (req, res) => {

        const dataValidation = validationResult(req)

        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ message: dataValidation.array()[0].msg })
        }

        try {

            const { firstName, lastName, email, password } = req.body

            if (!firstName) {
                return res.status(400).json( { message: 'Please add your first name' })
            }
            if (!lastName) {
                return res.status(400).json( { message: 'Please add your last name' })
            } 
            if (!email) {
                return res.status(400).json( { message: 'Please add a email' })
            } 
            if (!password) {
                return res.status(400).json( { message: 'Please add a password' })
            }

            const userExists = await usersModel.findOne({ email })

            if (userExists) {
                return res.status(400).json( { message: 'User email already exists' })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const userCreated = await usersModel.create({
                firstName,
                lastName,
                email,
                password: hashedPassword
            })

            return res.status(201).json({
                message: 'User successfully registered',
                item: {
                    _id: userCreated._id,
                    firstName: userCreated.firstName,
                    lastName: userCreated.lastName,
                    email: userCreated.email,
                    createdAt: userCreated.createdAt,
                    updatedAt: userCreated.updatedAt
                },
                token: await jwtGenerate(userCreated._id)
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },

    // @desc Login user
    // @route POST v1/api/users/login
    // @acess Public
    loginUser: async (req, res) => {

        const dataValidation = validationResult(req)

        if (!dataValidation.isEmpty()) {
            return res.status(400).json({ message: dataValidation.array()[0].msg })
        }
        
        try {
            const { email, password } = req.body

            if (!email) {
                return res.status(400).json( { message: 'Please add a email' })
            }
            if (!password) {
                return res.status(400).json( { message: 'Please add a password' })
            }

            const user = await usersModel.findOne({ email }).select('+password')

            if (!user) {
                return res.status(400).json({ message: 'User not found' })
            }
            if (!await bcrypt.compare(password, user.password)) {
                return res.status(400).json({ message: 'Invalid user data' })
            }

            return res.status(200).json({
                message: 'Successfully login user',
                item: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                token: await jwtGenerate(user._id)
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },

    // @desc GET user data
    // @route GET v1/api/users/me
    // @acess Private
    getMe: async (req, res) => {
        try {
            if (!req.user._id) {
                return res.status(400).json({ message: 'User not found' })
            }

            return res.status(200).json({
                message: 'Successfully get user data',
                item: {
                    _id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt
                },
                token: await jwtGenerate(req.user._id)
            })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

}