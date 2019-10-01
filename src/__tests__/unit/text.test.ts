import fc from "fast-check";

import { pad } from "../../";
import { SirHelpsalotError } from "./../../error";

const maxLength = 25000000;
const minLength = 1;

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

    // +++ check returned value +++
    it("should return an expected repeated pattern", () => {
      fc.assert(
        fc.property(fc.integer(2, 300), (length) => {
          fc.pre(length % 2 === 0); // to keep the entire result square (easier to test)
          const result = pad({ length, text: "# " });
          const matches = result.match(/# /g); // all matches, should = length
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
        fc.property(fc.integer(1, 300), fc.fullUnicodeString(0, 200), (length, text) => {
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
            fc.property(fc.integer(1, 300), (length) => {
              try {
                pad({ length, text });
              } catch (e) {
                return e instanceof SirHelpsalotError;
              }
              return false;
            }),
              { verbose: true };
          });
        });
      });

      // +++ specific lengths +++
      [maxLength + 1, maxLength + 2, maxLength + 235].forEach((length) => {
        // ! limit these to just a few, in case they fail, 50 tests at max size could be slow. don't fuzz.
        describe(`given the invalid (max) length input: '${length}'`, () => {
          it("should throw an error", () => {
            expect(() => pad({ length, text: "#" })).toThrow(SirHelpsalotError);
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
                return e instanceof SirHelpsalotError;
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
                return e instanceof SirHelpsalotError;
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
                return e instanceof SirHelpsalotError;
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
                return e instanceof SirHelpsalotError;
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
