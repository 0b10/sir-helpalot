import { removeKeys } from "../../index";

describe("when given a list of keys to remove", () => {
  it("should remove all of them from the given object", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };
    const expected = { a: "a" };

    expect(removeKeys(input, ["b", "c"])).toStrictEqual(expected);
  });
});

describe("when given an empty list of keys to remove", () => {
  it("should remove none of them", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };

    expect(removeKeys(input, [])).toStrictEqual(input);
  });
});

describe("when given non-existant keys to remove", () => {
  it("should not throw", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };
    const key = "z" as keyof typeof input;

    expect(() => {
      removeKeys(input, [key]);
    }).not.toThrow();
  });
});

describe("object equality", () => {
  it("should return the same object when useClone=false, and no keys are removed", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };

    expect(removeKeys(input, [], false)).toBe(input);
  });

  it("should return the same object when useClone=false, and some keys are removed", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };

    expect(removeKeys(input, ["c"], false)).toBe(input);
  });

  it("should return a new object when useClone=true, and no keys are removed", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };

    expect(removeKeys(input, [], true)).not.toBe(input);
  });

  it("should return a new object when useClone=true, and some keys are removed", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };

    expect(removeKeys(input, ["c"], true)).not.toBe(input);
  });

  it("should use useClone=true by default", () => {
    const input = { a: "a", b: "b", c: { foo: "", bar: "" } };

    expect(removeKeys(input, [])).not.toBe(input);
  });
});
