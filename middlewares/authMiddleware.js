import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * Récupère et vérifie les données utilisateur à partir du token dans les cookies.
 *
 * @param {Express.Request} request - L'objet de la requête.
 * @returns {Object|null} Les données décodées de l'utilisateur ou null si le token est invalide.
 */
const getUserDataFromToken = (request) => {
  const token = getTokenFromCookies(request.cookies);

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch (err) {
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est authentifié.
 *
 * @param {Express.Request} request - L'objet de la requête.
 * @param {Express.Response} response - L'objet de la réponse.
 * @param {Function} next - La fonction de middleware suivante dans la pile.
 */
export const isAuthenticated = (request, response, next) => {
  const userData = getUserDataFromToken(request);
  if (!userData) return response.status(401).json({ message: 'Accès refusé, pas de token valide fourni' });

  request.userData = userData;
  next();
};

/**
 * Vérifie si l'utilisateur est administrateur.
 *
 * @param {Express.Request} request - L'objet de la requête.
 * @param {Express.Response} response - L'objet de la réponse.
 * @param {Function} next - La fonction de middleware suivante dans la pile.
 */
export const isAdmin = (request, response, next) => {
  const userData = getUserDataFromToken(request);
  if (!userData) return response.status(401).json({ message: 'Accès refusé, pas de token valide fourni' });
  if (!userData.isAdmin) return response.status(403).json({ message: 'Accès refusé, privilèges insuffisants' });

  request.userData = userData;
  next();
};

/**
 * Vérifie si l'utilisateur est soit le propriétaire de la ressource, soit un administrateur.
 *
 * @param {Express.Request} request - L'objet de la requête.
 * @param {Express.Response} response - L'objet de la réponse.
 * @param {Function} next - La fonction middleware suivante dans la pile.
 */
export const isSelfOrAdmin = (request, response, next) => {
  const userData = getUserDataFromToken(request);
  if (!userData) return response.status(401).json({ message: 'Accès refusé, pas de token valide fourni' });

  const userId = request.params.id;
  const requestUserId = userData.userId;
  const isAdmin = userData.isAdmin;
  if (!isAdmin && userId !== requestUserId) return response.status(403).json({ message: 'Accès refusé, privilèges insuffisants' });

  request.userData = userData;
  next();
};

/**
 * Extrait le token des cookies de la requête.
 *
 * @param {Object} cookies - Les cookies de la requête.
 * @returns {string|null} Le token ou null s'il n'est pas trouvé.
 */
const getTokenFromCookies = (cookies) => {
  return cookies?.token || null;
};

/**
 * Vérifie le token JWT.
 *
 * @param {string} token - Le token à vérifier.
 * @returns {Promise<Object>} - Les données décodées du token.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
