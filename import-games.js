import dotenv from 'dotenv';
import gameDataSchema from './models/game-data.js';

dotenv.config();

const RAWG_API_KEY = process.env.RAWG_API_KEY;

/**
 * Récupère tous les meilleurs jeux depuis l'API RAWG en gérant la pagination.
 *
 * @returns {Promise<Array>}
 */
export const fetchAllTopGames = async () => {
  let games = [];
  let page = 1;
  const pageSize = 40; // Limite par page de l'API RAWG
  const maxGames = 5000;
  let remainingGames = maxGames;

  try {
    while (remainingGames > 0) {
      const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=${pageSize}&page=${page}`);

      if (!response.ok) throw new Error(`Erreur HTTP ! Statut : ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        games = games.concat(data.results);
        remainingGames -= data.results.length;
        page += 1;

        if (!data.next) break; // Si pas de page suivante, on sort de la boucle
      } else {
        const text = await response.text();
        throw new Error(`La réponse n'est pas en JSON : ${text}`);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux :', error);
  }

  return games;
};

/**
 * Enregistre les meilleurs jeux dans la base de données.
 *
 * @returns {Promise<void>}
 */
export const saveGamesToDB = async () => {
  const games = await fetchAllTopGames();

  const gameDocs = games.map((game) => ({
    idGameBD: game.id.toString(),
    name: game.name,
    description: '',
    playtime: game.playtime || 0,
    platforms: game.platforms ? game.platforms.map((platform) => platform.platform.name) : [],
    stores: game.stores ? game.stores.map((store) => store.store.name) : [],
    released: game.released || null,
    rating: game.rating || 0,
    ratings: game.ratings
      ? game.ratings.map((rating) => ({
          id: rating.id,
          title: rating.title,
          count: rating.count,
          percent: rating.percent,
        }))
      : [],
    ratings_count: game.ratings_count || 0,
    reviews_text_count: game.reviews_text_count || 0,
    added: game.added || 0,
    added_by_status: game.added_by_status || {},
    metacritic: game.metacritic || null,
    suggestions_count: game.suggestions_count || 0,
    background_image: game.background_image || '',
    tags: game.tags ? game.tags.map((tag) => tag.name) : [],
    esrb_rating: game.esrb_rating
      ? {
          id: game.esrb_rating.id,
          name: game.esrb_rating.name,
        }
      : null,
    short_screenshots: game.short_screenshots ? game.short_screenshots.map((screenshot) => screenshot.image) : [],
  }));

  try {
    await gameDataSchema.insertMany(gameDocs);
    console.log('Jeux importés avec succès !');
  } catch (error) {
    console.error("Erreur lors de l'importation des jeux :", error);
  }
};
