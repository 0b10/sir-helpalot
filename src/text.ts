import { SirHelpsalotError } from "./error";

/**
 * Get padding text, of a repeating pattern and a given length.
 *
 * @param {object} args - an object: { length = 1, text = "#" }.
 *
 * "length" must be an integer: 0 < n < 25,000,000 (25MB as UTF-8)
 *
 * "text" must be a non-empty string - ASCII, UTF-8, and UTF-16 compatible.
 *
 * @returns {string} the padding value
 * @throws SirHelpsalotError - When text isn't a valid string, or length isn't a valid integer.
 * @example
 * pad({ length: 4, text: "ab" }); // => "abab"
 * pad({ length: 4, text: "a " }); // => "a a "
 * pad(); // with defaults: => "#"
 *
 */
export const pad = ({ length = 1, text = "#" } = {}) => {
  // preconditions
  if (typeof text !== "string") {
    throw new SirHelpsalotError(`"text" must be a string`);
  }
  if (typeof length !== "number") {
    throw new SirHelpsalotError(`"length" must be a positive integer`);
  }
  if (length < 1 || length > 25000000 || length !== parseInt(`${length}`, 10)) {
    // 25000000 @ 8bits is 25MB, and 50MB for UTF-16
    throw new SirHelpsalotError(`"length" must an integer 1 < length < 25000000`);
  }
  if (!text) {
    // cover empty string case
    throw new SirHelpsalotError(`"text" cannot be empty`);
  }

  if (length < text.length) {
    // too short, truncate string
    return text.slice(0, length);
  }
  const freq = length / text.length; // repetitions
  const result = text.repeat(freq);
  const delta = length - result.length; // gap at the end

  return delta ? result + result.slice(0, delta) : result; // pad the gap
};
