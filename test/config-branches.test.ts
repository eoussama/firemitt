import { ConfigHelper, InvalidFirebaseConfigError, InvalidURLError } from "../src/index.ts";
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

    expect(config.fireguard.theme).toEqual({ text: "red", primary: "blue", secondary: "green" });
  });

  it("should throw InvalidFirebaseConfigError when firebase is not provided", () => {
    expect(() =>
      ConfigHelper.init({
        url: "https://fireguard-instance.com",
        config: { name: "App" },
      }),
    ).toThrow(InvalidFirebaseConfigError);
  });
});
