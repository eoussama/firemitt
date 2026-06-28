import {
  ConfigHelper,
  InvalidAppNameError,
  InvalidFirebaseConfigError,
  InvalidURLError,
} from "../src/index.ts";
import { VALID_FIREBASE } from "./fixtures.ts";



describe("configHelper", () => {
  beforeAll(() => {
    globalThis.window = Object.create({}) as Window & typeof globalThis;

    Object.defineProperty(window, "screen", {
      value: { width: 1024, height: 768 },
    });
  });

  describe("init", () => {
    it("should initialize a valid TFiremittConfig object", () => {
      const config = ConfigHelper.init({
        url: "https://fireguard-instance.com",
        dim: { width: 500, height: 300 },
        pos: { x: 100, y: 200 },
        config: { name: "MyApp", firebase: VALID_FIREBASE },
      });

      expect(config.url).toBe("https://fireguard-instance.com/");
      expect(config.dim).toEqual({ width: 500, height: 300 });
      expect(config.pos).toEqual({ x: 100, y: 200 });
      expect(config.fireguard.name).toBe("MyApp");
    });

    it("should throw InvalidURLError for invalid URL", () => {
      expect(() => ConfigHelper.init({ url: "invalid-url" })).toThrow(InvalidURLError);
    });

    it("should throw InvalidAppNameError for absent name", () => {
      expect(() => ConfigHelper.init({ url: "https://fireguard-instance.com" })).toThrow(InvalidAppNameError);
    });

    it("should throw InvalidFirebaseConfigError for empty Firebase config", () => {
      expect(() =>
        ConfigHelper.init({
          url: "https://fireguard-instance.com",
          config: { name: "MyApp", firebase: {} as never },
        }),
      ).toThrow(InvalidFirebaseConfigError);
    });
  });

  describe("getFlags", () => {
    it("should return a correctly formatted string of window feature flags", () => {
      const flags = ConfigHelper.getFlags({
        url: "https://fireguard-instance.com/",
        dim: { width: 400, height: 600 },
        pos: { x: 150, y: 250 },
        fireguard: {
          name: "App",
          logo: "",
          theme: { text: "#1a3544", primary: "#ffe536", secondary: "#1a3544" },
          firebase: VALID_FIREBASE,
          provider: "google",
        },
      });

      expect(flags).toBe("width=400,height=600,left=150,top=250");
    });
  });
});
