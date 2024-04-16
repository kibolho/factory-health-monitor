import express from 'express';
import { makeRouters } from './src/router';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

makeRouters(app)

export default app