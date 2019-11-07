import { fixture } from "../..";

describe("smoke", () => {
  it("should exist", () => {
    expect(fixture).toBeDefined();
  });
});

describe("closure", () => {
  it("should return a function", () => {
    const result = fixture({});
    expect(typeof result).toBe("function");
  });
});

describe("defaults", () => {
  it("should be returned as an identical object, when no overrides are passed in", () => {
    const expected = { a: "a", b: () => null, c: 3 };
    const result = fixture(expected)();
    expect(result).toStrictEqual(expected);
  });

  it("should be a cloned object, when returned", () => {
    const expected = { a: "a", b: () => null, c: 3 };
    const result = fixture(expected)();
    expect(result).toStrictEqual(expected);
    expect(result).not.toBe(expected);
  });
});

describe("overrides", () => {
  it("should return an expected overridden object", () => {
    const defaults = { a: "a", b: "b", c: false };
    const localFixtures = [{ a: "" }, { c: true }, { a: "test", b: "test2", c: false }];

    for (let overrides of localFixtures) {
      const result = fixture(defaults)({ overrides });
      expect(result).toStrictEqual({ ...defaults, ...overrides });
    }
  });

  it("should override with explicit undefined values when instructed", () => {
    const defaults = { a: "a", b: "b", c: false };
    const overrides = { a: undefined, b: undefined };

    const result = fixture(defaults)({ overrides });
    expect(result).toStrictEqual({ ...defaults, ...overrides });
  });

  it("should be a cloned object, when returned", () => {
    const defaults = { a: "a", b: () => null, c: 3 };
    const overrides = { a: "test" };

    const result = fixture(defaults)({ overrides });
    expect(result).not.toBe(defaults);
  });
});

describe("exclude", () => {
  it("should exclude all keys passed in", () => {
    interface LocalFixture<T> {
      exclude: Array<keyof T>;
      expected: Partial<T>;
    }
    const defaults = { a: "a", b: "b", c: false };
    const localFixtures: LocalFixture<typeof defaults>[] = [
      { exclude: ["a"], expected: { b: "b", c: false } },
      { exclude: ["a", "b"], expected: { c: false } },
      { exclude: ["a", "b", "c"], expected: {} },
    ];

    for (let { exclude, expected } of localFixtures) {
      const result = fixture(defaults)({ exclude });
      expect(result).toStrictEqual(expected);
    }
  });

  it("should exclude no keys when given an empty array", () => {
    const defaults = { a: "a", b: "b", c: false };
    const result = fixture(defaults)({ exclude: [] });

    expect(result).toStrictEqual(defaults);
  });

  it("should exclude no keys if it's undefined", () => {
    const defaults = { a: "a", b: "b", c: false };
    const result = fixture(defaults)();

    expect(result).toStrictEqual(defaults);
  });
});

describe("helper immutable", () => {
  it("should take precedence over the closure immutable option", () => {
    const closureTrue = fixture({ foo: "" }, { immutable: true })({ immutable: false });

    // create
    expect(() => {
      closureTrue["bar"] = "foo";
    }).not.toThrow(TypeError);

    // overwrite
    expect(() => {
      closureTrue.foo = "foo";
    }).not.toThrow(TypeError);

    // delete
    expect(() => {
      delete closureTrue.foo;
    }).not.toThrow(TypeError);

    const closureFalse = fixture({ foo: "" }, { immutable: false })({ immutable: true });

    // create
    expect(() => {
      //@ts-ignore
      closureFalse.bar = "foo";
    }).toThrow(TypeError);

    // overwrite
    expect(() => {
      //@ts-ignore
      closureFalse.foo = "foo";
    }).toThrow(TypeError);

    // delete
    expect(() => {
      //@ts-ignore
      delete closureFalse.foo;
    }).toThrow(TypeError);
  });

  it("should work as expected when it equals the closure immutable option", () => {
    const bothFalse = fixture({ foo: "" }, { immutable: false })({ immutable: false });

    // create
    expect(() => {
      bothFalse["bar"] = "foo";
    }).not.toThrow(TypeError);

    // overwrite
    expect(() => {
      bothFalse.foo = "foo";
    }).not.toThrow(TypeError);

    // delete
    expect(() => {
      delete bothFalse.foo;
    }).not.toThrow(TypeError);

    const bothTrue = fixture({ foo: "" }, { immutable: true })({ immutable: true });

    // create
    expect(() => {
      //@ts-ignore
      bothTrue.bar = "foo";
    }).toThrow(TypeError);

    // overwrite
    expect(() => {
      //@ts-ignore
      bothTrue.foo = "foo";
    }).toThrow(TypeError);

    // delete
    expect(() => {
      //@ts-ignore
      delete bothTrue.foo;
    }).toThrow(TypeError);
  });

  it("should be false by default", () => {
    const result = fixture({ foo: "" }, { immutable: false })(); // don't pass to helper

    // create
    expect(() => {
      result["bar"] = "foo";
    }).not.toThrow(TypeError);

    // overwrite
    expect(() => {
      result.foo = "foo";
    }).not.toThrow(TypeError);

    // delete
    expect(() => {
      delete result.foo;
    }).not.toThrow(TypeError);
  });
});

describe("closure immutable", () => {
  it("should be immutable by default", () => {
    const result = fixture({ foo: "" })();
    expect(() => {
      result.foo = "foo";
    }).toThrow(TypeError);
  });

  it("should return an immutable object when instructed", () => {
    const result = fixture({ foo: "" }, { immutable: true })();

    // create
    expect(() => {
      result["bar"] = "foo";
    }).toThrow(TypeError);

    // overwrite
    expect(() => {
      result.foo = "foo";
    }).toThrow(TypeError);

    // delete
    expect(() => {
      delete result.foo;
    }).toThrow(TypeError);
  });

  it("should return a mutable object when instructed", () => {
    const result = fixture({ foo: "" }, { immutable: false })();

    // create
    expect(() => {
      result["bar"] = "foo";
    }).not.toThrow(TypeError);

    // overwrite
    expect(() => {
      result.foo = "foo";
    }).not.toThrow(TypeError);

    // delete
    expect(() => {
      delete result.foo;
    }).not.toThrow(TypeError);
  });
});
