import express from 'express'
import { customers } from '../models/customerModel.js';
import { Agency } from '../models/agencyModel.js';
import { Guide } from '../models/guideModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = express.Router()


//save a customer
router.post('/signup',async(req,res)=>{
    try {
        if(
            !req.body.username ||
            !req.body.Name ||
            !req.body.phno ||
            !req.body.gmail ||
            !req.body.password ||
            !req.body.role
        ){
            return res.status(400).send({
                message: "Send all required feilds"
            });
        }
        console.log("Inside");
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        if(req.body.role == 'customer')
        {
            if(await customers.findOne({username: req.body.username}))
            {
                return res.status(404).send({error: 'User already Exists'});
            }
            const newCust = {
                username: req.body.username, 
                Name: req.body.Name, 
                phno: req.body.phno, 
                gmail: req.body.gmail, 
                password: hashedPassword,
                role: req.body.role
            }
            console.log("DON'T KNOW WHWRE I AM");
            const customer = await customers.create(newCust)
            return res.status(201).send(customer)
        }
        else if(req.body.role == 'travel agency')
        {
            if(await Agency.findOne({username: req.body.username}))
            {
                return res.status(404).send({error: 'User already Exists'});
            }
            const newAgency = {
                username: req.body.username, 
                name: req.body.Name, 
                contactInfo: {email: req.body.gmail, phone: req.body.phno},
                password: hashedPassword,
            }
            const agency = await Agency.create(newAgency)
            return res.status(201).send(agency)
            
        }
        else if(req.body.role == 'guide')
        {
            if(await Guide.findOne({username: req.body.username}))
            {
                return res.status(404).send({error: 'User already Exists'});
            }
            const newGuide = {
                username: req.body.username, 
                name: req.body.Name, 
                contact: {email: req.body.gmail, phone: req.body.phno},
                password: hashedPassword,
            }
            const guide = await Guide.create(newGuide)
            return res.status(201).send(guide)
        }
        
    } catch (error) {
        console.log(error)
    }
})
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        console.log(username, password, role);
        if(role == 'customer')
        {
            // Find user by username
            const user = await customers.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, 'Voyage_secret',{
                expiresIn: '1h',
            });
            

            res.status(200).json({ token: token, message: 'Login successful' });
        }
        else if(role == 'travel agency')
        {
            // Find user by username
            const user = await Agency.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, 'Voyage_secret',{
                expiresIn: '1h',
            });
            

            res.status(200).json({ token: token, message: 'Login successful' });
        }
        else if(role == 'guide')
        {
            // Find user by username
            const user = await Agency.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, 'Voyage_secret',{
                expiresIn: '1h',
            });
            

            res.status(200).json({ token: token, message: 'Login successful' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// get all coustomers
router.get('/customers',async (req,res) => {
    try {
        const custs = await customers.find({});
        return res.status(200).json({
            count: custs.length,
            data: custs
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})

// delete a customer
router.delete('/customers/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const result = await customers.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" User not found"})
        }
        return res.status(200).json({message:" User deleted"})


    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// update customers
router.put('/customers/:id',async (req,res) => {
    try {
        const {id} = req.params;
        const result = await customers.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" User not found"})
        }
        return res.status(200).json({message:" user updated"})

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// view a single customer
router.get('/customers/:id',async (req,res) => {
    try {
        let {id} = req.params
        id = id.toString()
        const custs = await customers.findOne({ _id: id });
        return res.status(200).json(custs)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})


export default router