/**
 * Generates a unique inquiry ID in the format SCC-XXXXXX
 * where X is a random uppercase alphanumeric character.
 * @returns {string} The generated inquiry ID
 */
const generateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SCC-';

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

module.exports = generateId;
