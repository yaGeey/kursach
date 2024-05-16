import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import tenderRoutes from './routes/tenders.js';
import userRoutes from './routes/users.js';
import proposRoutes from './routes/propos.js';

const app = express();
dotenv.config();

mongoose.connection.on('disconnected', () => console.error('Disconnected from MongoDB'))
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'))

const connect = async() => {
   try {
      await mongoose.connect(process.env.MONGO)
   } catch(err) {
      throw err
   }
}

//* middlewares
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/tenders', tenderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/propos', proposRoutes)

app.listen(8000, () => {
   connect()
   console.log('Api server is running on port 8000')
})