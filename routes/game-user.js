import express from 'express';
import { createGameUser, getGameUsers, getGameUserById, updateGameUser, deleteGameUser, getUserLibrary } from '../controllers/game-user.js';
import { isAdmin, isAuthenticated, isSelfOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Création d'un nouveau GameUser
router.post('/', createGameUser);

// Récupération de tous les GameUsers de l'utilisateur
router.get('/', isAuthenticated, getGameUsers);

// Récupération de la bibliothèque d'un utilisateur suivi
router.get('/library/:userId', getUserLibrary);

// Récupération d'un GameUser par ID de l'utilisateur
router.get('/:id', isAuthenticated, getGameUserById);

// Mise à jour d'un GameUser de l'utilisateur
router.put('/:id', isAuthenticated, updateGameUser);

// Suppression d'un GameUser de l'utilisateur
router.delete('/:id', isAuthenticated, deleteGameUser);

export default router;
