import {
  AuthFailedError,
  BaseError,
  ErrorType,
  InvalidAppError,
  InvalidAppNameError,
  InvalidDimError,
  InvalidFirebaseConfigError,
  InvalidProviderError,
  InvalidURLError,
  PopupBlockedError,
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

describe("tests PopupBlockedError", () => {
  const error = new PopupBlockedError();

  it("should have the correct name and type", () => {
    expect(error.name).toBe("PopupBlockedError");
    expect(error.type).toBe(ErrorType.PopupBlocked);
  });

  it("toObject should return serialized error", () => {
    expect(error.toObject()).toEqual({
      type: ErrorType.PopupBlocked,
      name: error.name,
      message: error.message,
    });
  });
});

describe("tests AuthFailedError", () => {
  it("should default to the AuthFailed type, name and a generic message", () => {
    const error = new AuthFailedError();

    expect(error).toBeInstanceOf(Error);
    expect(error.type).toBe(ErrorType.AuthFailed);
    expect(error.name).toBe("AuthFailedError");
    expect(error.message).toBe("Authentication failed");
    expect(error.code).toBeUndefined();
    expect(error.toObject()).toEqual({ type: ErrorType.AuthFailed, name: "AuthFailedError", message: "Authentication failed" });
  });

  it("should keep the remote type, name, message and code", () => {
    const remote = { type: ErrorType.InvalidProvider, name: "InvalidProviderError", message: "Invalid provider", code: "auth/x" };
    const error = new AuthFailedError(remote);

    expect(error.toObject()).toEqual(remote);
    expect(error.cause).toBe(remote);
  });

  it("should fall back to the AuthFailed type for unknown remote types", () => {
    const error = new AuthFailedError({ type: 0, name: "FirebaseError", message: "Firebase: Error (auth/popup-blocked).", code: "" });

    expect(error.type).toBe(ErrorType.AuthFailed);
    expect(error.name).toBe("FirebaseError");
    expect(error.code).toBeUndefined();
  });

  it("should accept a string or an unexpected payload", () => {
    expect(new AuthFailedError("failure").message).toBe("failure");
    expect(new AuthFailedError(42).message).toBe("Authentication failed");
    expect(new AuthFailedError({ name: "", message: "" }).name).toBe("AuthFailedError");
  });
});

describe("tests BaseError code", () => {
  it("should serialize the code when set", () => {
    const error = new BaseError(ErrorType.InvalidApp, "message");

    error.code = "auth/invalid-api-key";

    expect(error.toObject()).toEqual({ type: ErrorType.InvalidApp, name: "InvalidAppError", message: "message", code: "auth/invalid-api-key" });
  });
});
