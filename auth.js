const passport = require('passport');
const LocalStrategy = require('passport-local');
const Person = require('./models/Person');

passport.use(new LocalStrategy(async (USERNAME, PASSWORD, done) => {
    try{
        // console.log('Recieved credentials:', USERNAME, PASSWORD);
        const user = await Person.findOne({username: USERNAME});

        if(!user){
            return done(null, false, {message: 'Incorrect username.'});
        }

        const isPasswordMatch = await user.comparePassword(PASSWORD) ? true : false;
        if(isPasswordMatch){
            return done(null, user);
        } else{
            return done(null, false, {message: 'Incorrect password'});
        }


    } catch (err) {
        return done(err);
    }
}))

module.exports = passport;