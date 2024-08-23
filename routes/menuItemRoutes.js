const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.post('/', async (req,res) => {

    try{
        const data = req.body;

        const newMenu = new MenuItem(data);
    
        const response = await newMenu.save();
        console.log('data saved');
        res.status(200).json(response);

    } catch(err){
        console.log(err);
        res.status(500).json({err: 'Internal server error'});
    }

})

router.get('/', async (req, res) => {
    try{
        const data = await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data);
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})


// getting all menuitems according to their taste
router.get('/:tasteType', async (req, res) => {
    try{
        const tasteType = req.params.tasteType;

        if(tasteType == 'sweet' || tasteType == 'spicy' || tasteType == 'sour'){

            const response = await MenuItem
            .find({taste : tasteType});
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
        const menuItemId = req.params.id;
        const updatedMenuItemData = req.body;

        const response = await MenuItem.findByIdAndUpdate(menuItemId, updatedMenuItemData, {
            new: true,
            runValidators: true
        });

        if(!response){
            return res.status(404).json({error : 'Menu item not found'});
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
        const menuItemId = req.params.id;

        const response = await MenuItem.findByIdAndDelete(menuItemId);

        if(!response){
            return res.status(404).json({error : 'Menu item not found'});
        }

        console.log('data deleted');
        res.status(200).json({message: 'Menu item deleted successfully'});
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})

// new commment added
module.exports = router;