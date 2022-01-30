import { describe } from "mocha";
import { expect } from "chai";

describe("Hello function", () => {
  it("should return hello world", () => {
    expect("Foo").to.equal("Foo");
  });
});
