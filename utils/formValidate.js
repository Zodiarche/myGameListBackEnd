/**
 * Vérifie si le nom d'utilisateur est valide.
 * @param {string} username - Le nom d'utilisateur à vérifier.
 * @returns {string|null} Un message d'erreur si le nom d'utilisateur est invalide, sinon `null`.
 */
export const isUsernameValid = (username) => {
  if (!username) return 'Le nom d’utilisateur est requis.';
  if (typeof username !== 'string') return 'Le nom d’utilisateur doit être une chaîne de caractères.';
  if (username.length < 3) return 'Le nom d’utilisateur doit comporter au moins 3 caractères.';

  return null;
};

/**
 * Vérifie si l'adresse email est valide.
 * @param {string} email - L'adresse email à vérifier.
 * @returns {string|null} Un message d'erreur si l'email est invalide, sinon `null`.
 */
export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "L'adresse email est requise.";
  if (typeof email !== 'string') return "L'adresse email doit être une chaîne de caractères.";
  if (!emailRegex.test(email)) return "L'adresse email doit être valide.";

  return null;
};

/**
 * Vérifie si le mot de passe est valide.
 * @param {string} password - Le mot de passe à vérifier.
 * @returns {string|null} Un message d'erreur si le mot de passe est invalide, sinon `null`.
 */
export const isPasswordValid = (password) => {
  if (!password) return 'Le mot de passe est requis.';
  if (typeof password !== 'string') return 'Le mot de passe doit être une chaîne de caractères.';
  if (password.length < 6) return 'Le mot de passe doit comporter au moins 6 caractères.';

  return null;
};

/**
 * Vérifie si la valeur de l'administrateur est valide.
 * @param {boolean} isAdmin - La valeur de l'administrateur à vérifier.
 * @returns {string|null} Un message d'erreur si la valeur de l'administrateur est invalide, sinon `null`.
 */
export const isAdminValid = (isAdmin) => {
  if (typeof isAdmin !== 'boolean') return "La valeur d'administrateur doit être un booléen.";

  return null;
};
