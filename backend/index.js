import express, { response } from 'express'
import mongoose from 'mongoose';
const mongoURL = 'mongodb+srv://saiananyakatakam:NLnqR9ifdN8qbVft@cluster0.lbvmb.mongodb.net/EchoVoyages'
import adminRoute from './routes/adminRoutes.js'
import customerRoute from './routes/customerRoutes.js'
import packageRoute from './routes/packageRoutes.js'
import reviewRoute from './routes/reviewRoutes.js'
import bookingRoute from './routes/bookingRoute.js'
import guideRoute from './routes/guideRoutes.js'
import agencyRoutes from './routes/agencyRoutes.js'
import cors from 'cors'
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';

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

app.use('/admin', verifyToken, adminRoute)
app.use('/customers', verifyToken, customerRoute)
app.use('/packages', verifyToken, packageRoute)
app.use('/reviews', verifyToken, reviewRoute)
app.use('/bookings', verifyToken, bookingRoute)
app.use('/guides', verifyToken, guideRoute)
app.use('/agency', verifyToken, agencyRoutes)
app.use('/public', express.static('public'));





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join("public", "uploads"))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
  const upload = multer({ storage: storage })                  

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if(!token) res.status(401).json({message: 'Token Not Found'});

  try {
    const data = jwt.verify(token, 'Voyage_secret');
    return data.id;
  } catch (error) {
    return res.status(401).json({message: 'Invalid Token'})
  }
}

const port = 5000
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})