
// Lecture - 2

// var fs = require('fs');
// var os = require('os');

// var lodash = require('lodash');

// const notes = require('./notes.js');
// console.log('server file is loaded');

// var age = notes.age;
// console.log(age);

// var result = notes.addNumber(age,18);
// console.log(result);


// var data = ["person","person", 1,2 , 1, 2, 'name', 'age', '2'];
// var filter = lodash.uniq(data);
// console.log(filter);

// var user = os.userInfo();
// console.log(user);

// fs.appendFile('greeting.txt', 'Hi ' + user.username + '!\n', ()=> {
//     console.log('file is created');
// })

// function callback(){
//     console.log("Harjot is calling this function now");
// }

// const add = function(a,b, callback){
//     var result = a+b;
//     console.log(result);
//     callback();
// }

// add(3,4, callback);

// const add = function(a,b, prince){
//     var result = a+b;
//     console.log(result);
//     prince();
// }

// add(2,3,() => console.log('add completed'))


// ----------------------------------------------


// Lecture 3

const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');


const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;


// Middleware function
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`);
    next();
}

app.use(logRequest);


app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false});

app.get('/', function(req, res){
    res.send('Welcome to our hotel')
})

app.get('/idli', (req, res) => {
    var customized_idli ={
        name: 'rava_idli',
        size: '10 cm',
        is_sambhar : true,
        is_chutney: false
    }
    res.send(customized_idli);
})


const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes.js');

// app.use('/person', localAuthMiddleware, personRoutes);
app.use('/person', personRoutes);
app.use('/menu',menuItemRoutes);



app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})

