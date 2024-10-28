import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.js';
import gamesRoutes from './routes/game-data.js';
import gamesUserRoutes from './routes/game-user.js';
import { saveGamesToDB } from './import-games.js';

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_LOCAL = process.env.MONGODB_URI_LOCAL;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const CORS_ORIGIN_LOCAL = process.env.CORS_ORIGIN_LOCAL;

const app = express();

/**
 * Configuration de la connexion à MongoDB.
 */
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // await saveGamesToDB();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/games', gamesRoutes);
app.use('/games-user', gamesUserRoutes);

/**
 * Démarrage du serveur.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
