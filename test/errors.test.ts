import {
  BaseError,
  ErrorType,
  InvalidAppError,
  InvalidAppNameError,
  InvalidDimError,
  InvalidFirebaseConfigError,
  InvalidProviderError,
  InvalidURLError,
} from "../src/index.ts";



describe("tests BaseError", () => {
  it("should fall back to 'Base' name when type has no matching enum key", () => {
    const error = new BaseError(999 as ErrorType, "unknown error");

    expect(error.name).toBe("BaseError");
    expect(error.toString()).toBe("[BaseError] unknown error.");
    expect(error.toObject()).toEqual({ type: 999, name: "BaseError", message: "unknown error" });
  });
});

describe("tests InvalidURLError", () => {
  const error = new InvalidURLError();

  it("should be instance of Error", () => {
    expect(error).toBeInstanceOf(Error);
  });

  it("should have the correct name", () => {
    expect(error.name).toBe("InvalidURLError");
  });

  it("should have the correct type", () => {
    expect(error.type).toBe(ErrorType.InvalidURL);
  });

  it("toString should return formatted message", () => {
    expect(error.toString()).toBe(`[${error.name}] ${error.message}.`);
  });

  it("toObject should return serialized error", () => {
    expect(error.toObject()).toEqual({
      type: ErrorType.InvalidURL,
      name: error.name,
      message: error.message,
    });
  });
});

describe("tests InvalidAppError", () => {
  const error = new InvalidAppError();

  it("should have the correct name", () => {
    expect(error.name).toBe("InvalidAppError");
  });

  it("should have the correct type", () => {
    expect(error.type).toBe(ErrorType.InvalidApp);
  });

  it("toString should return formatted message", () => {
    expect(error.toString()).toBe(`[${error.name}] ${error.message}.`);
  });

  it("toObject should return serialized error", () => {
    expect(error.toObject()).toEqual({
      type: ErrorType.InvalidApp,
      name: error.name,
      message: error.message,
    });
  });
});

describe("tests InvalidAppNameError", () => {
  const error = new InvalidAppNameError();

  it("should have the correct name", () => {
    expect(error.name).toBe("InvalidAppNameError");
  });

  it("should have the correct type", () => {
    expect(error.type).toBe(ErrorType.InvalidAppName);
  });

  it("toString should return formatted message", () => {
    expect(error.toString()).toBe(`[${error.name}] ${error.message}.`);
  });

  it("toObject should return serialized error", () => {
    expect(error.toObject()).toEqual({
      type: ErrorType.InvalidAppName,
      name: error.name,
      message: error.message,
    });
  });
});

describe("tests InvalidProviderError", () => {
  const error = new InvalidProviderError("google");

  it("should have the correct name", () => {
    expect(error.name).toBe("InvalidProviderError");
  });

  it("should have the correct type", () => {
    expect(error.type).toBe(ErrorType.InvalidProvider);
  });

  it("should include provider name in message", () => {
    expect(error.message).toContain("google");
  });

  it("toString should return formatted message", () => {
    expect(error.toString()).toBe(`[${error.name}] ${error.message}.`);
  });

  it("toObject should return serialized error", () => {
    expect(error.toObject()).toEqual({
      type: ErrorType.InvalidProvider,
      name: error.name,
      message: error.message,
    });
  });
});

describe("tests InvalidDimError", () => {
  const error = new InvalidDimError();

  it("should have the correct name", () => {
    expect(error.name).toBe("InvalidDimError");
  });

  it("should have the correct type", () => {
    expect(error.type).toBe(ErrorType.InvalidDim);
  });

  it("toString should return formatted message", () => {
    expect(error.toString()).toBe(`[${error.name}] ${error.message}.`);
  });

  it("toObject should return serialized error", () => {
    expect(error.toObject()).toEqual({
      type: ErrorType.InvalidDim,
      name: error.name,
      message: error.message,
    });
  });
});

describe("tests InvalidFirebaseConfigError", () => {
  const error = new InvalidFirebaseConfigError();

  it("should have the correct name", () => {
    expect(error.name).toBe("InvalidFirebaseConfigError");
  });

  it("should have the correct type", () => {
    expect(error.type).toBe(ErrorType.InvalidFirebaseConfig);
  });

  it("toString should return formatted message", () => {
    expect(error.toString()).toBe(`[${error.name}] ${error.message}.`);
  });

  it("toObject should return serialized error", () => {
    expect(error.toObject()).toEqual({
      type: ErrorType.InvalidFirebaseConfig,
      name: error.name,
      message: error.message,
    });
  });
});
