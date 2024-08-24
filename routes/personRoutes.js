const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

router.post('/signup', async (req,res) => {
    // const data = req.body;

    // // const newPerson = new Person();
    // // newPerson.name = data.name;
    // // newPerson.age = data.age;
    // // newPerson.email= data.email;
    // //        OR
    // const newPerson = new Person(data);

    // callback method (now deprecated) => instead we use try-catch block and async-await
    // newPerson.save((error, savedPerson) => {
    //     if(error){
    //         console.log('Error on saving person: ', error);
    //         res.status(500).json({error: 'Internal server error'});
    //     }
    //     else{
    //         console.log('data saved successfully');
    //         res.status(200).json({savedPerson});
    //     }
    // })

    try{
        const data = req.body;

        const newPerson = new Person(data);
    
        const response = await newPerson.save();
        console.log('data saved');

        const payload = {
            id: response.id,
            username: response.username
        }

        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});

    } catch(err){
        console.log(err);
        res.status(500).json({err: 'Internal server error'});
    }

})

// login route
router.post('/login', async (req, res) => {
    try{
        // extract username and password from request body
        const {userTypedName, userTypedPassword} = req.body;

        // find the user by username
        const user = await Person.findOne({username: userTypedName});

        // if user doest not exist or password does not match, return error
        if(!user || !(await user.comparePassword(userTypedPassword))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate token
        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload);

        // return token as response
        res.json({token});

    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;

        const userId = userData.id;
        const user =  await Person.findById(userId);

        res.status(200).json(user);
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get('/', jwtAuthMiddleware, async (req, res) => {
    try{
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})


// getting all persons according to their work
router.get('/:workType', async (req, res) => {
    try{
        const workType = req.params.workType;

        if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){

            const response = await Person.find({work : workType});
            console.log('response fetched');
            res.status(200).json(response);
        }
        else{
            res.status(404).json({error: 'Invalid work type'});
        }
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})

router.put('/:id', async (req, res) => {
    try{
        const personId = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runValidators: true
        });

        if(!response){
            return res.status(404).json({error : 'Person not found'});
        }

        console.log('data updated');
        res.status(200).json(response);
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})


router.delete('/:id', async (req, res) => { 
    try{
        const personId = req.params.id;

        const response = await Person.findByIdAndDelete(personId);

        if(!response){
            return res.status(404).json({error : 'Person not found'});
        }

        console.log('data deleted');
        res.status(200).json({message: 'person deleted successfully'});
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})


module.exports = router;