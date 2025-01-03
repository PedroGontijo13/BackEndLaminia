import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';

const app = express();

const allowedOrigins = [
    'https://nextjsfullstack-wheat.vercel.app',
    'https://nextjsfullstack-3z5m-7uvbwk5wa-pedrogontijo13s-projects.vercel.app'
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                console.log(`CORS request allowed from origin: ${origin}`);
            } else {
                console.error(`CORS request blocked from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.options('*', cors());

app.use(express.json());

connectDB();

app.use(authRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
