const { ConfigHelper, InvalidURLError } = require("../dist/firemitt.umd");



describe("tests ConfigHelper branch coverage", () => {
  beforeAll(() => {
    globalThis.window = Object.create({});

    Object.defineProperty(window, "screen", {
      value: { width: 1024, height: 768 },
    });
  });

  it("should use default dim when width and height are not provided", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      config: { name: "App", firebase: { apiKey: "key" } },
    });

    expect(config.dim).toEqual({ width: 450, height: 260 });
  });

  it("should use default pos when x and y are not provided", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      config: { name: "App", firebase: { apiKey: "key" } },
    });

    expect(typeof config.pos.x).toBe("number");
    expect(config.pos.y).toBe(50);
  });

  it("should throw InvalidURLError when url is null or undefined", () => {
    expect(() => ConfigHelper.init({ url: null })).toThrow(InvalidURLError);
    expect(() => ConfigHelper.init({ url: undefined })).toThrow(InvalidURLError);
  });

  it("should throw InvalidURLError for a URL with a non-http/s protocol", () => {
    expect(() =>
      ConfigHelper.init({ url: "ftp://fireguard-instance.com" }),
    ).toThrow(InvalidURLError);
  });

  it("should accept http:// URLs", () => {
    const config = ConfigHelper.init({
      url: "http://fireguard-instance.com",
      config: { name: "App", firebase: { apiKey: "key" } },
    });

    expect(config.url).toBe("http://fireguard-instance.com/");
  });

  it("should use provided theme values over defaults", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      config: {
        name: "App",
        firebase: { apiKey: "key" },
        theme: { text: "red", primary: "blue", secondary: "green" },
      },
    });

    expect(config.fireguard.theme).toEqual({ text: "red", primary: "blue", secondary: "green" });
  });

  it("should use default firebase values when firebase is not provided", () => {
    const config = ConfigHelper.init({
      url: "https://fireguard-instance.com",
      config: { name: "App" },
    });

    expect(config.fireguard.firebase).toEqual({
      apiKey: "",
      appId: "",
      projectId: "",
      authDomain: "",
      measurementId: "",
      storageBucket: "",
      messagingSenderId: "",
    });
  });
});
