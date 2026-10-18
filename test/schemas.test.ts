import { FireguardOptionsSchema, FiremittOptionsSchema } from "../src/index.ts";
import { VALID_FIREBASE } from "./fixtures.ts";



describe("tests FiremittOptionsSchema", () => {
  const iframe = {} as HTMLIFrameElement;
  const container = {} as HTMLElement;

  it("accepts complete options", () => {
    const result = FiremittOptionsSchema.safeParse({
      url: "https://fireguard-instance.com",
      pos: { x: 10, y: 20 },
      dim: { width: 300, height: 200 },
      mode: "iframe",
      iframe: { element: iframe },
      config: { name: "App", firebase: VALID_FIREBASE, provider: "github", theme: { primary: "#ffffff" } },
    });

    expect(result.success).toBe(true);
    expect(result.data?.pos).toEqual({ x: 10, y: 20 });
    expect(result.data?.dim).toEqual({ width: 300, height: 200 });
  });

  it.each(["http://fireguard-instance.com", "https://fireguard-instance.com/path"])("accepts the http(s) URL %s", (url) => {
    expect(FiremittOptionsSchema.shape.url.safeParse(url).success).toBe(true);
  });

  it.each(["ftp://fireguard-instance.com", "not a url", "", undefined])("rejects the URL %j with an \"Invalid URL\" message", (url) => {
    const result = FiremittOptionsSchema.shape.url.safeParse(url);

    expect(result.success).toBe(false);

    if (typeof url === "string") {
      expect(result.error?.issues[0]?.message).toBe("Invalid URL");
    }
  });

  it.each(["popup", "iframe"])("accepts the %s mode", (mode) => {
    expect(FiremittOptionsSchema.shape.mode.safeParse(mode).success).toBe(true);
  });

  it("rejects unknown modes", () => {
    expect(FiremittOptionsSchema.shape.mode.safeParse("window").success).toBe(false);
  });

  it("validates positions and dimensions as numbers", () => {
    expect(FiremittOptionsSchema.shape.pos.safeParse({ x: "10" }).success).toBe(false);
    expect(FiremittOptionsSchema.shape.dim.safeParse({ height: "10" }).success).toBe(false);
    expect(FiremittOptionsSchema.shape.pos.safeParse({ y: 1 }).success).toBe(true);
  });

  it("accepts either an iframe element or a container, but not both", () => {
    expect(FiremittOptionsSchema.shape.iframe.safeParse({ element: iframe }).success).toBe(true);
    expect(FiremittOptionsSchema.shape.iframe.safeParse({ container }).success).toBe(true);
    expect(FiremittOptionsSchema.shape.iframe.safeParse({ element: iframe, container }).success).toBe(false);
  });
});

describe("tests FireguardOptionsSchema", () => {
  it("accepts a configuration with an optional provider and a partial theme", () => {
    expect(FireguardOptionsSchema.safeParse({ name: "App", firebase: VALID_FIREBASE, provider: "github", theme: { text: "#000000" } }).success).toBe(true);
  });

  it("rejects an empty provider", () => {
    expect(FireguardOptionsSchema.safeParse({ name: "App", firebase: VALID_FIREBASE, provider: "" }).success).toBe(false);
  });

  it("validates theme colors as strings", () => {
    expect(FireguardOptionsSchema.safeParse({ name: "App", firebase: VALID_FIREBASE, theme: { primary: 42 } }).success).toBe(false);
  });
});
