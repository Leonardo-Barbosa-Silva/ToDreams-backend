const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add an password'],
        select: false
    }
},
{
    timestamps: true
})




module.exports = mongoose.model('users', userSchema)