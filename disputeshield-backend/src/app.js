import express from "express";
import cors from "cors";
import path from 'path';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';


const app = express();

//global middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/webhooks', webhookRoutes);

//health check route

app.get('/', (req, res) => {
    res.send("API is running...")
})

export default app;