import fc from "fast-check";

import { pad } from "../../text";
import { SirHelpalotError } from "./../../error";

const maxLength = 25000000;
const minLength = 1;

const hasSurrogatePair = (str: string) => /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(str);

describe("unit tests: text", () => {
  // >>> OK >>>
  // +++ smoke +++
  describe("pad()", () => {
    it("should return a default string [#smoke]", () => {
      expect(pad()).toBeDefined();
    });

    // +++ default +++
    it("should return an expected default value", () => {
      expect(pad()).toMatchInlineSnapshot(`"#"`);
    });

    // +++ simple return length +++
    it("should return an expected length of string when text is a single char", () => {
      fc.assert(
        fc.property(fc.integer(1, 300), (length) => {
          return pad({ length, text: "#" }).length === length;
        }),
        { verbose: true }
      );
    });

    // +++ with prefix +++
    it("should return an expected length of string when given a prefix", () => {
      fc.assert(
        fc.property(fc.integer(6, 300), (length) => {
          // prefix is length 6, functions throws when length is smaller than prefix
          return pad({ length, text: "#", prefix: "prefix" }).length === length;
        }),
        { verbose: true }
      );
    });

    // +++ prefix fuzz +++
    it("should return an expected length of string, when given varying lengths and prefix lengths", () => {
      fc.assert(
        fc.property(fc.integer(50, 100), fc.asciiString(1, 49), (length, prefix) => {
          // ! prefix must be shorter than total length
          return pad({ length, text: "#", prefix }).length === length;
        }),
        { verbose: true }
      );
    });

    // +++ prefix unicode +++
    it("should return an expected length of string, when prefix is unicode", () => {
      fc.assert(
        fc.property(fc.integer(5, 10), fc.fullUnicodeString(1, 5), (length, prefix) => {
          // ! prefix must be shorter than total length
          fc.pre(!hasSurrogatePair(prefix)); // ! surrogate pairs interfere with string length
          return pad({ length, text: "#", prefix }).length === length;
        }),
        { verbose: true }
      );
    });

    // +++ check returned value +++
    it("should return an expected repeated pattern", () => {
      fc.assert(
        fc.property(fc.integer(2, 300), (length) => {
          fc.pre(length % 2 === 0); // to keep the entire result square (easier to test)
          const result = pad({ length, text: "# " });
          const matches = result.match(/# /g); // all matches, should = half length
          if (matches && matches.length > 0) {
            return matches.length * 2 === length; // * 2: number of matches @ length 2, should equal half length
          }
          return false;
        }),
        { verbose: true }
      );
    });

    // +++ fuzz valid types +++
    it("should return an expected length of string when 'text' has a variable length", () => {
      fc.assert(
        fc.property(fc.integer(1, 300), fc.string(0, 200), (length, text) => {
          fc.pre(text !== ""); // intentionally throws
          return pad({ length, text }).length === length;
        }),
        { verbose: true }
      );
    });

    // +++ unicode, fuzz +++
    it("should work for unicode too", () => {
      fc.assert(
        // ! keep the unicode string length low, otherwise too many surrogate pairs are generated
        fc.property(fc.integer(1, 10), fc.fullUnicodeString(0, 5), (length, text) => {
          fc.pre(!hasSurrogatePair(text)); // ! surrogate pairs interfere with string length
          fc.pre(text !== ""); // intentionally throws
          return pad({ length, text }).length === length;
        }),
        { verbose: true }
      );
    });

    // +++ max boundary +++
    [maxLength, maxLength - 1].forEach((length) => {
      describe("inner max length boundary", () => {
        it("should return a valid string", () => {
          expect(pad({ length })).toHaveLength(length);
        });
      });
    });

    // >>> ERROR >>>
    describe("error cases", () => {
      // +++ specific text +++
      [""].forEach((text) => {
        describe(`given the text input: '${text}'`, () => {
          it("should throw an error", () => {
            // FIXME: do assert
            fc.property(fc.integer(1, 300), (length) => {
              try {
                pad({ length, text });
              } catch (e) {
                return e instanceof SirHelpalotError;
              }
              return false;
            }),
              { verbose: true };
          });
        });
      });

      // +++ prefix too large +++
      describe(`when the length is shorter than the prefix`, () => {
        it("should throw an error", () => {
          fc.assert(
            fc.property(fc.integer(1, 9), fc.asciiString(10, 20), (length, prefix) => {
              try {
                pad({ length, text: "#", prefix });
              } catch (e) {
                return e instanceof SirHelpalotError;
              }
              return false;
            }),
            { verbose: true }
          );
        });
      });

      // +++ unicode, fuzz +++
      it("should reject surrogate pairs for text", () => {
        fc.assert(
          // ! keep the unicode string length high, to increse surrogate pair generation
          fc.property(fc.integer(1, 10), fc.fullUnicodeString(1, 50), (length, text) => {
            fc.pre(hasSurrogatePair(text));
            try {
              pad({ length, text });
            } catch (e) {
              return e instanceof SirHelpalotError;
            }
            return false;
          }),
          { verbose: true }
        );
      });

      it("should reject surrogate pairs for prefix", () => {
        fc.assert(
          // ! keep the unicode string length high, to increse surrogate pair generation
          fc.property(fc.integer(1, 10), fc.fullUnicodeString(1, 50), (length, prefix) => {
            fc.pre(hasSurrogatePair(prefix));
            try {
              pad({ length, text: "#", prefix });
            } catch (e) {
              return e instanceof SirHelpalotError;
            }
            return false;
          }),
          { verbose: true }
        );
      });

      // +++ specific lengths +++
      [maxLength + 1, maxLength + 2, maxLength + 235].forEach((length) => {
        // ! limit these to just a few, in case they fail, 50 tests at max size could be slow. don't fuzz.
        describe(`given the invalid (max) length input: '${length}'`, () => {
          it("should throw an error", () => {
            expect(() => pad({ length, text: "#" })).toThrow(SirHelpalotError);
          });
        });
      });

      // +++ invalid length types +++
      describe(`given invalid (min) length values: < ${minLength}`, () => {
        it("should throw an error", () => {
          fc.assert(
            fc.property(fc.integer(minLength - 1), (length) => {
              try {
                pad({ length, text: "#" });
              } catch (e) {
                return e instanceof SirHelpalotError;
              }
              return false;
            }),
            { verbose: true }
          );
        });
      });

      // +++ invalid text types +++
      describe(`text as non-string input`, () => {
        it("should throw an error", () => {
          fc.assert(
            fc.property(fc.integer(1, 300), fc.anything(), (length, text) => {
              fc.pre(typeof text !== "string");
              fc.pre(text !== undefined); // undefined sets default value, and tests fail
              try {
                pad({ length, text });
              } catch (e) {
                return e instanceof SirHelpalotError;
              }
              return false;
            }),
            { verbose: true }
          );
        });
      });

      // +++ invalid length types +++
      describe(`length as non-integer input`, () => {
        it("should throw an error", () => {
          fc.assert(
            fc.property(fc.anything(), fc.string(0, 200), (length, text) => {
              fc.pre(typeof length !== "number");
              fc.pre(length !== undefined); // undefined uses default value, and tests fail
              try {
                pad({ length, text });
              } catch (e) {
                return e instanceof SirHelpalotError;
              }
              return false;
            }),
            { verbose: true }
          );
        });
      });

      // +++ floats +++
      describe(`length as a float`, () => {
        it("should throw an error", () => {
          fc.assert(
            fc.property(fc.float(minLength, maxLength), (length) => {
              fc.pre(length !== parseInt(`${length}`, 10));
              try {
                pad({ length, text: "#" });
              } catch (e) {
                return e instanceof SirHelpalotError;
              }
              return false;
            }),
            { verbose: true }
          );
        });
      });
    });
  });
});
