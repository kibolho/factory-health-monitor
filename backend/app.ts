import express from 'express';
import { makeRouters } from './src/router';

const app = express();
const port = process.env.PORT;

// Middleware to parse JSON request bodies
app.use(express.json());

makeRouters(app)

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
