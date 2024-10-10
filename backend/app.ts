import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
dotenv.config();

const app = express();

connectDB();

app.listen(3000, () => console.log('Server running on port 3000'));