/**
 * Normalize une chaîne de caractères en supprimant les accents et en convertissant tous les caractères en minuscules.
 *
 * @param {string} string - La chaîne de caractères à normaliser.
 * @returns {string} La chaîne de caractères normalisée, sans accents et en minuscules.
 */
export const normalizeString = (string) =>
  string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
