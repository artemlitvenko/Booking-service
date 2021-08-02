import express from 'express';
import { Application } from 'express';
import { router as authRouter } from './routes/auth.routes.js';
import { router as cityRouter } from './routes/city.routes.js';
import { router as masterRouter } from './routes/master.routes.js';
import { router as orderRouter } from './routes/order.routes.js';
import { router as clientRouter } from './routes/client.routes.js';
import { corsMiddleware } from './middleware/cors.middleware';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/city', cityRouter);
app.use('/api/master', masterRouter);
app.use('/api/order', orderRouter);
app.use('/api/client', clientRouter);

export { app };
