import GameUser from '../models/game-user.js';

/**
 * Crée un nouveau GameUser.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const createGameUser = async (request, response) => {
  const gameUser = new GameUser(request.body);

  try {
    const savedGameUser = await gameUser.save();
    response.status(201).json(savedGameUser);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

/**
 * Récupère la liste de tous les GameUsers.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameUsers = async (request, response) => {
  try {
    const userId = request.userData.userId;
    const gameUserList = await GameUser.find({ idUser: userId }).populate('idUser idGameBD');

    response.json(gameUserList);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Récupère la bibliothèque de jeux d'un utilisateur suivi par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getUserLibrary = async (request, response) => {
  try {
    const { userId } = request.params;
    const userLibrary = await GameUser.find({ idUser: userId }).populate('idGameBD');

    response.json(userLibrary);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Récupère un GameUser par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameUserById = async (request, response) => {
  try {
    const { userId } = request.query;
    const gameId = request.params.id;

    const gameUser = await GameUser.findOne({ idUser: userId, idGameBD: gameId }).populate('idUser idGameBD');
    if (!gameUser) return response.status(404).json({ message: 'GameUser non trouvé' });

    response.json(gameUser);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour un GameUser par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const updateGameUser = async (request, response) => {
  try {
    const { idUser, id: gameId } = request.body;

    const updatedGameUser = await GameUser.findOneAndUpdate({ idUser: idUser, idGameBD: gameId }, request.body, { new: true });
    if (!updatedGameUser) return response.status(404).json({ message: 'GameUser non trouvé' });

    response.json(updatedGameUser);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

/**
 * Supprime un GameUser par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const deleteGameUser = async (request, response) => {
  try {
    const deletedGameUser = await GameUser.findByIdAndDelete(request.params.id);
    if (!deletedGameUser) return response.status(404).json({ message: 'GameUser non trouvé' });

    response.json({ message: 'GameUser supprimé' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
