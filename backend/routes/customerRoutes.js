import express from 'express'
import { customers } from '../models/customerModel.js';
const router = express.Router()

//save a customer
router.post('/',async(req,res)=>{
    try {
        if(
            !req.body.username ||
            !req.body.Name ||
            !req.body.phno ||
            !req.body.gmail ||
            !req.body.password
        ){
            return res.status(400).send({
                message: "Send all required feilds"
            })
        }
        const newCust = {
            username: req.body.username, 
            Name: req.body.Name, 
            phno: req.body.phno, 
            gmail: req.body.gmail, 
            password: req.body.password
        }
        const customer = await customers.create(newCust)
        return res.status(201).send(customer)
    } catch (error) {
        console.log(error)
    }
})

export default router