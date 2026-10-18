import { ConfigHelper, InvalidDimError, InvalidFirebaseConfigError, InvalidURLError } from "../src/index.ts";
import { VALID_FIREBASE } from "./fixtures.ts";



describe("tests ConfigHelper branch coverage", () => {
  beforeAll(() => {
    globalThis.window = Object.create({}) as Window & typeof globalThis;

    Object.defineProperty(window, "screen", {
      value: { width: 1024, height: 768 },
    });
  });

  it("should use default dim when width and height are not provided", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      config: { name: "App", firebase: VALID_FIREBASE },
    });

    expect(config.dim).toEqual({ width: 450, height: 260 });
  });

  it("should use default pos when x and y are not provided", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      config: { name: "App", firebase: VALID_FIREBASE },
    });

    expect(typeof config.pos.x).toBe("number");
    expect(config.pos.y).toBe(50);
  });

  it("should throw InvalidURLError when url is null or undefined", () => {
    expect(() => ConfigHelper.init({ url: null as unknown as string })).toThrow(InvalidURLError);
    expect(() => ConfigHelper.init({ url: undefined as unknown as string })).toThrow(InvalidURLError);
  });

  it("should throw InvalidURLError for a URL with a non-http/s protocol", () => {
    expect(() => ConfigHelper.init({ url: "ftp://fireguard-instance.com" })).toThrow(InvalidURLError);
  });

  it("should accept http:// URLs", () => {
    const config = ConfigHelper.init({
      url: "http://fireguard-instance.com",
      config: { name: "App", firebase: VALID_FIREBASE },
    });

    expect(config.url).toBe("http://fireguard-instance.com/");
  });

  it("should use provided theme values over defaults", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      config: {
        name: "App",
        firebase: VALID_FIREBASE,
        theme: { text: "red", primary: "blue", secondary: "green" },
      },
    });

    expect(config.fireguard.theme).toEqual({ text: "red", primary: "blue", secondary: "green", background: "#ffffff" });
  });

  it("should throw InvalidFirebaseConfigError when firebase is not provided", () => {
    expect(() =>
      ConfigHelper.init({
        url: "https://fireguard-instance.com",
        config: { name: "App" },
      }),
    ).toThrow(InvalidFirebaseConfigError);
  });

  it("should throw InvalidDimError when width is NaN", () => {
    expect(() =>
      ConfigHelper.init({
        url: "https://fireguard-instance.com",
        dim: { width: Number.NaN },
        config: { name: "App", firebase: VALID_FIREBASE },
      }),
    ).toThrow(InvalidDimError);
  });

  it("should throw InvalidDimError when height is NaN", () => {
    expect(() =>
      ConfigHelper.init({
        url: "https://fireguard-instance.com",
        dim: { height: Number.NaN },
        config: { name: "App", firebase: VALID_FIREBASE },
      }),
    ).toThrow(InvalidDimError);
  });

  it("should use provided dim values when valid", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      dim: { width: 800, height: 600 },
      config: { name: "App", firebase: VALID_FIREBASE },
    });

    expect(config.dim).toEqual({ width: 800, height: 600 });
  });
});

describe("tests ConfigHelper normalization", () => {
  const init = (options: Record<string, unknown> = {}, config: Record<string, unknown> = {}) => ConfigHelper.init({
    url: "https://fireguard-instance.com",
    ...options,
    config: { name: "App", firebase: VALID_FIREBASE, ...config },
  });

  beforeEach(() => {
    globalThis.window = { screen: { width: 1024, height: 768 } } as unknown as Window & typeof globalThis;
  });

  it.each([0, -10, Number.POSITIVE_INFINITY])("should throw InvalidDimError when a dimension is %s", (value) => {
    expect(() => init({ dim: { width: value } })).toThrow(InvalidDimError);
    expect(() => init({ dim: { height: value } })).toThrow(InvalidDimError);
  });

  it("should center the popup on the screen when the host window position is unknown", () => {
    expect(init({ dim: { width: 451 } }).pos).toEqual({ x: 287, y: 50 });
  });

  it("should center the popup on the host window when its position is known", () => {
    globalThis.window = { screen: { width: 1024 }, screenX: 1920, outerWidth: 1200 } as unknown as Window & typeof globalThis;

    expect(init().pos).toEqual({ x: 1920 + 375, y: 50 });
  });

  it("should fall back to the screen when the host window has no width", () => {
    globalThis.window = { screen: { width: 1024 }, screenX: 0, outerWidth: 0 } as unknown as Window & typeof globalThis;

    expect(init().pos.x).toBe(287);
  });

  it("should fall back to the default position for non-finite coordinates", () => {
    expect(init({ pos: { x: Number.NaN, y: Number.POSITIVE_INFINITY } }).pos).toEqual({ x: 287, y: 50 });
  });

  it("should keep and round the given coordinates", () => {
    expect(init({ pos: { x: 10.6, y: 0 } }).pos).toEqual({ x: 11, y: 0 });
  });

  it.each([
    [undefined, "google"],
    ["", "google"],
    ["  ", "google"],
    [" GitHub ", "github"],
    ["MICROSOFT", "microsoft"],
    ["oidc.MyProvider", "oidc.MyProvider"],
    [" saml.Corp ", "saml.Corp"],
    ["custom", "custom"],
  ])("should normalize the provider %j to %j", (provider, expected) => {
    expect(init({}, { provider }).fireguard.provider).toBe(expected);
  });

  it("should accept a Firebase config without the optional fields, and pass it through unchanged", () => {
    const firebase = { apiKey: "key", appId: "app", projectId: "project", authDomain: "project.firebaseapp.com", databaseURL: "https://db" };

    expect(init({}, { firebase }).fireguard.firebase).toBe(firebase);
  });

  it("should throw InvalidFirebaseConfigError when a required Firebase field is empty", () => {
    expect(() => init({}, { firebase: { ...VALID_FIREBASE, apiKey: "" } })).toThrow(InvalidFirebaseConfigError);
  });
});
