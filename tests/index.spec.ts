import "mocha";
import { assert } from "chai";

import { test } from "../index";

describe("Hello World Function", () => {
    it("should be a function", () => {
        assert.isFunction(test);
    });

    it("should return the hi message", () => {
        const expected = "hi";
        const actual = test();
        assert.equal(actual, expected);
    });
});
