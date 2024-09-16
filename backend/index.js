import express, { response } from 'express'
import mongoose from 'mongoose';
const mongoURL = 'mongodb+srv://saiananyakatakam:NLnqR9ifdN8qbVft@cluster0.lbvmb.mongodb.net/EchoVoyages'
import adminRoute from './routes/adminRoutes.js'
import customerRoute from './routes/customerRoutes.js'
import packageRoute from './routes/packageRoutes.js'
import reviewRoute from './routes/reviewRoutes.js'
import cors from 'cors'

mongoose.connect(mongoURL)
.then(()=>{
    console.log("MongoDB connected")
})
.catch((error)=>{
    console.log((error))
})

const app = express()
app.use(express.json());
app.use(cors())

app.get('/',(req,res)=>{
    res.render('')
});

app.use('/admin',adminRoute)
app.use('/customers',customerRoute)
app.use('/packages',packageRoute)
app.use('/reviews',reviewRoute)
const port = 5000
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})