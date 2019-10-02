import { SirHelpalotError } from "./error";

const RE_SURROGATE_PAIRS = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

/**
 * Get padding text, of a repeating pattern and a given length.
 *
 * @param {object} args - an object: { length = 1, text = "#" }.
 *
 * "length" must be an integer: 0 < n < 25,000,000 (25MB as UTF-8)
 *
 * "text" must be a non-empty string - ASCII, UTF-8, and UTF-16 compatible - surrogate pairs are
 *  rejected due to string length guarantees 😀
 *
 * "text" must be a non-empty string - ASCII, UTF-8, and UTF-16 compatible - surrogate pairs are
 *  rejected due to string length guarantees
 *
 * @returns {string} the padding value
 * @throws SirHelpalotError - When text isn't a valid string, or length isn't a valid integer.
 * @example
 * pad({ length: 4, text: "ab" }); // => "abab"
 * pad({ length: 4, text: "a " }); // => "a a "
 * pad(); // with defaults: => "#"
 *
 */
export const pad = ({ length = 1, text = "#", prefix = "" } = {}) => {
  // preconditions
  if (typeof text !== "string") {
    throw new SirHelpalotError(`"text" must be a string`);
  }

  if (typeof length !== "number") {
    throw new SirHelpalotError(`"length" must be a positive integer`);
  }

  if (length < 1 || length > 25000000 || length !== parseInt(`${length}`, 10)) {
    // 25000000 @ 8bits is 25MB, and 50MB for UTF-16
    throw new SirHelpalotError(`"length" must an integer 1 < length < 25000000`);
  }

  if (RE_SURROGATE_PAIRS.test(text + prefix)) {
    throw new SirHelpalotError(
      `Surrogate pairs are not supported because they interfere with string length evaluation, and no guarantees can be made`
    );
  }

  if (prefix && length < prefix.length) {
    throw new SirHelpalotError(
      `"length", cannot be shorter than "prefix" length, this causes truncation - length: ${length}, prefix.length: ${prefix.length}`
    );
  }

  if (!text) {
    // cover empty string case
    throw new SirHelpalotError(`"text" cannot be empty`);
  }

  if (prefix) {
    text = prefix + text;
  }

  if (length < text.length) {
    // too short, truncate string
    return text.slice(0, length);
  }

  const freq = length / text.length; // repetitions
  const result = text.repeat(freq);
  const delta = length - result.length; // gap at the end

  return delta ? result + text.slice(0, delta) : result; // pad the gap
};
