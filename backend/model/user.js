const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required']
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    favorites: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
});
module.exports = mongoose.model('users', userSchema)