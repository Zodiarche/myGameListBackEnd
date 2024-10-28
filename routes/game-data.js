import express from 'express';
import { createGameData, getGameDataList, getTopGames, getGameDataById, updateGameData, deleteGameData, searchGames, getFilters } from '../controllers/game-data.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Création d'un nouveau jeu
router.post('/', isAdmin, createGameData);

// Récupération de tous les jeux
router.get('/', getGameDataList);

// Recherche de jeux
router.get('/search', searchGames);

// Récupération les meilleurs jeux
router.get('/top-games', getTopGames);

// Récupération des plateformes et tags
router.get('/filters', getFilters);

// Récupération d'un jeu par ID
router.get('/:id', getGameDataById);

// Mise à jour d'un jeu
router.put('/:id', isAdmin, updateGameData);

// Suppression d'un jeu
router.delete('/:id', isAdmin, deleteGameData);

export default router;
