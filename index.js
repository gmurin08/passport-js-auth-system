require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const passport = require('passport')
const app = express()
require('./auth.js');

function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

app.get('/', (req,res)=>{
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
    passport.authenticate('google', {scope:['email', 'profile']})
)

app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    })
)

app.get('/auth/failure', (req,res)=>{
    res.send('something went wrong')
})

app.get('/protected', isLoggedIn, (req,res)=>{
    res.send("Hello World!")
})

const start = async () => {
    try {
      await mongoose.connect(
        `mongodb+srv://gmurin08:${process.env.MONGO_PW}@cluster0.ev3vlct.mongodb.net/?retryWrites=true&w=majority`
      ).then(console.log('Connected to MongoDB'));
      app.listen(5000, () => console.log("Server started on port 5000"));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  start()