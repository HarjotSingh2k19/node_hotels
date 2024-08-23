const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');

router.post('/', async (req,res) => {
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
        res.status(200).json(response);

    } catch(err){
        console.log(err);
        res.status(500).json({err: 'Internal server error'});
    }

})

router.get('/', async (req, res) => {
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