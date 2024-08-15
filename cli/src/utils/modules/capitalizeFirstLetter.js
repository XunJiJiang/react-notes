// @ts-check

/**
 *
 * @param {string} string
 * @returns {string}
 */
export default function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
