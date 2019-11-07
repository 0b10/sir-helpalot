interface HelperArgs<T, K, I = boolean> {
    overrides?: Partial<T>;
    exclude?: K[];
    immutable?: I;
}
interface FixtureOptions {
    immutable: boolean;
}
/**
 * A flexible closure to provide fixture data in a way that reduces test code. Pass in an
 *  object to the closure, which will represent any arguments you will use in tests. This object
 *  represents the default values that you require, and the returned function allows you to override
 *  those values, or completely remove keys. The resulting object can also be made immutable, to
 *  provide some extra safety during tests.
 *
 * NOTE: defaults and overrides are deep cloned, so there is no need to freeze, or clone them. The
 *  function was written with safety (data integrity) in mind.
 *
 * @author 0b10
 *
 * @param {object} defaults - The object that you wish to serve as default values. This can be any
 *  shape.
 * @param {FixtureOptions} options - { immutable: true } - The object produced by the inner function
 *  (aka helper) is immutable by default. This can be overridden via the helper.
 *
 * @returns {Function} A helper function: (overrides, options) => ({...defaults, ...overrides})
 *
 * options = { overrides?, exclude?, immutable? }
 *
 * overrides: { ... }:
 *
 *  This will override any value in defaults by merging them, including undefined - which means the
 *  key will exist with an explicit undefined value. If you want to exclude a key, use the exclude
 *  option.
 *
 * exclude: [ ]:
 *
 *  Keys of the result to delete - this is useful if setting a key to undefined is not an option.
 *
 * immutable: false:
 *
 *  Should the result be immutable? This overrides the immutable option within the outer (closure)
 *  function - this value takes precedence. This freezes the result.
 *
 * @example
 * const myHelper = fixture({ a: "a"});
 * const { a } = myHelper();
 *
 * @example
 * const myHelper = fixture({ a: "", b: "" }, { immutable: false });
 * const { a } = myHelper({ exclude: ["a"] });
 *
 * @example
 * const myHelper = fixture({ a: "", b: "" });
 * const { a, b } = myHelper({ overrides: { a: "example", b: undefined } });
 *
 * @example
 * const myHelper = fixture({ a: "" });
 * const { a, b } = myHelper({ immutable: true });
 */
export declare const fixture: <T extends object>(defaults: T, { immutable }?: FixtureOptions) => {
    <K extends undefined, I extends false>(args?: HelperArgs<T, K, I> | undefined): T;
    <K_1 extends undefined, I_1 extends true>(args?: HelperArgs<T, K_1, I_1> | undefined): Readonly<T>;
    <K_2 extends keyof T, I_2 extends false>(args?: HelperArgs<T, K_2, I_2> | undefined): Pick<T, Exclude<keyof T, K_2>>;
    <K_3 extends keyof T, I_3 extends true>(args?: HelperArgs<T, K_3, I_3> | undefined): Readonly<Pick<T, Exclude<keyof T, K_3>>>;
};
export {};
