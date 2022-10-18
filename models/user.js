const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    hash: String,
    salt: String
});

//takes in a password and generates a salted hash to store in user document
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, 'sha512').toString('hex');
}

//hash and salt the incoming password and return wether it matches
userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, 
        this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

userSchema.methods.generateJwt = function(){
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000, 10),
    }, process.env.JWT_SECRET); //pulling our secret from env 
};

module.exports = mongoose.model('users', userSchema);