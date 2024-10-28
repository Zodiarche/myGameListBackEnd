import GameData from '../models/game-data.js';
import { normalizeString } from '../utils/normalizeString.js';

/**
 * Crée un nouveau GameData.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const createGameData = async (request, response) => {
  const gameData = new GameData(request.body);

  try {
    const savedGameData = await gameData.save();
    response.status(201).json(savedGameData);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

/**
 * Récupère la liste de tous les GameData.
 * @param {Express.Request} _ - L'objet de requête (non utilisé).
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameDataList = async (_, response) => {
  try {
    const gameDataList = await GameData.find();
    response.json(gameDataList);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Récupère une liste des jeux filtrés selon certains critères et triés.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getTopGames = async (request, response) => {
  try {
    const { limit = 10, platform, tag, rating, released } = request.query;
    const limitNum = parseInt(limit, 10);
    const filters = {};

    if (platform) filters['platforms.name'] = platform;
    if (tag) filters['tags.name'] = tag;
    if (rating) filters['rating'] = { $gte: parseFloat(rating) };
    if (released) filters['released'] = { $gte: new Date(released) };

    const mostRatedGames = await GameData.find(filters)
      .sort({ ratings_count: -1 })
      .limit(limitNum * 2);

    const topRatedGames = mostRatedGames.sort((a, b) => b.rating - a.rating);
    const topGames = topRatedGames.slice(0, limitNum);

    response.json(topGames);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Recherche de jeux par nom avec support pour les accents et la casse.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const searchGames = async (request, response) => {
  try {
    const searchQuery = request.query.search ? request.query.search : '';
    const normalizedQuery = normalizeString(searchQuery);

    const gameDataList = await GameData.find({
      name: { $regex: new RegExp(`.*${normalizedQuery}.*`, 'i') },
    });

    response.json(gameDataList);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Récupère un GameData par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameDataById = async (request, response) => {
  try {
    const gameData = await GameData.findById(request.params.id);
    if (!gameData) return response.status(404).json({ message: 'Jeu non trouvé' });

    response.json(gameData);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour un GameData par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const updateGameData = async (request, response) => {
  try {
    const updatedGameData = await GameData.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!updatedGameData) return response.status(404).json({ message: 'Jeu non trouvé' });

    response.json(updatedGameData);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

/**
 * Supprime un GameData par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const deleteGameData = async (request, response) => {
  try {
    const deletedGameData = await GameData.findByIdAndDelete(request.params.id);
    if (!deletedGameData) return response.status(404).json({ message: 'Jeu non trouvé' });

    response.json({ message: 'Jeu supprimé' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Récupère tous les filtres pertinents pour les jeux.
 * @param {Express.Request} _ - L'objet de requête (non utilisé).
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getFilters = async (_, response) => {
  try {
    // Récupération des filtres uniques pour diverses propriétés
    const platforms = await GameData.distinct('platforms');
    const tags = await GameData.distinct('tags');
    const stores = await GameData.distinct('stores');
    const esrbRatings = await GameData.distinct('esrb_rating.name');

    // Pour récupérer les années de sortie uniques, on extrait l'année de la date de sortie
    const releaseYears = await GameData.aggregate([
      { $group: { _id: { $year: '$released' } } },
      { $sort: { _id: 1 } }, // Tri par année croissante
      { $project: { _id: 0, year: '$_id' } },
    ]);

    // Filtrage par évaluations des utilisateurs (rating) - on regroupe pour obtenir les valeurs uniques
    const userRatings = await GameData.aggregate([{ $group: { _id: '$rating' } }, { $sort: { _id: 1 } }, { $project: { _id: 0, rating: '$_id' } }]);

    // Filtrage par évaluations Metacritic
    const metacriticRatings = await GameData.aggregate([{ $group: { _id: '$metacritic' } }, { $sort: { _id: 1 } }, { $project: { _id: 0, metacritic: '$_id' } }]);

    // Filtrage par temps de jeu moyen
    const playtimeRanges = await GameData.aggregate([{ $group: { _id: '$playtime' } }, { $sort: { _id: 1 } }, { $project: { _id: 0, playtime: '$_id' } }]);

    // Statut d'ajout par les utilisateurs (regroupe par différents statuts comme "possédé", "battu", etc.)
    const addedByStatus = await GameData.aggregate([
      {
        $group: {
          _id: null,
          yet: { $sum: '$added_by_status.yet' },
          owned: { $sum: '$added_by_status.owned' },
          beaten: { $sum: '$added_by_status.beaten' },
          toplay: { $sum: '$added_by_status.toplay' },
          dropped: { $sum: '$added_by_status.dropped' },
          playing: { $sum: '$added_by_status.playing' },
        },
      },
      {
        $project: { _id: 0 }, // Retire le champ `_id`
      },
    ]);

    response.json({
      platforms,
      tags,
      stores,
      esrbRatings,
      releaseYears: releaseYears.map((item) => item.year),
      userRatings: userRatings.map((item) => item.rating),
      metacriticRatings: metacriticRatings.map((item) => item.metacritic),
      playtimeRanges: playtimeRanges.map((item) => item.playtime),
      addedByStatus: addedByStatus[0],
    });
  } catch (error) {
    console.error('Error fetching filters:', error.message);
    response.status(500).json({ message: error.message });
  }
};
