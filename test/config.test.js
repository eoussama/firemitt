const firemitt = require("../dist/firemitt.umd");



describe("configHelper", () => {
  beforeAll(() => {
    globalThis.window = Object.create({});

    Object.defineProperty(window, "screen", {
      value: {
        width: 1024,
        height: 768,
      },
    });
  });

  describe("init", () => {
    it("should initialize a valid TFiremittConfig object", () => {
      const options = {
        url: "https://fireguard-instance.com",
        dim: { width: 500, height: 300 },
        pos: { x: 100, y: 200 },
        config: {
          name: "MyApp",
          firebase: { apiKey: "123" },
        },
      };

      const config = firemitt.ConfigHelper.init(options);

      expect(config.url).toBe("https://fireguard-instance.com/");
      expect(config.dim).toEqual({ width: 500, height: 300 });
      expect(config.pos).toEqual({ x: 100, y: 200 });
      expect(config.fireguard.name).toBe("MyApp");
    });

    it("should throw InvalidURLError for invalid URL", () => {
      const options = { url: "invalid-url" };

      expect(() => firemitt.ConfigHelper.init(options)).toThrow(firemitt.InvalidURLError);
    });

    it("should throw InvalidAppNameError for absent name", () => {
      const options = { url: "https://fireguard-instance.com" };

      expect(() => firemitt.ConfigHelper.init(options)).toThrow(firemitt.InvalidAppNameError);
    });

    it("should throw InvalidFirebaseConfigError for Firebase config", () => {
      const options = {
        url: "https://fireguard-instance.com",
        config: {
          name: "MyApp",
          firebase: {},
        },
      };

      expect(() => firemitt.ConfigHelper.init(options)).toThrow(firemitt.InvalidFirebaseConfigError);
    });
  });

  describe("getFlags", () => {
    it("should return a correctly formatted string of window feature flags", () => {
      const config = {
        dim: { width: 400, height: 600 },
        pos: { x: 150, y: 250 },
        fireguard: {},
      };

      const flags = firemitt.ConfigHelper.getFlags(config);

      expect(flags).toBe("width=400,height=600,left=150,top=250");
    });
  });
});
