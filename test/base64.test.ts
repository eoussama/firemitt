import { Base64helper } from "../src/index.ts";



describe("base64helper", () => {
  describe("encode", () => {
    it("should correctly encode a TMessage object to a Base64 string", () => {
      const message = { type: 0, payload: {} };
      const encoded = Base64helper.encode(message);

      expect(encoded).toEqual(expect.any(String));
    });

    it("should produce the same output as plain btoa(JSON) for ASCII messages", () => {
      const message = { type: 1, payload: { url: "https://fireguard-instance.com", name: "App" } };

      expect(Base64helper.encode(message)).toBe(btoa(JSON.stringify(message)));
    });

    it("should encode characters outside of Latin-1 without throwing", () => {
      expect(() => Base64helper.encode({ type: 1, payload: { name: "تطبيق 😀 — 应用" } })).not.toThrow();
    });

    it("should be decodable by a plain atob + JSON.parse decoder (older Fireguard versions)", () => {
      const message = { type: 1, payload: { name: "Café – تطبيق 😀" } };

      expect(JSON.parse(atob(Base64helper.encode(message)))).toEqual(message);
    });
  });

  describe("decode", () => {
    it("should correctly decode a Base64 string to a TMessage object", () => {
      const base64String = "eyAidHlwZSI6IDAsICJwYXlsb2FkIjoge30gfQ==";
      const decoded = Base64helper.decode(base64String);

      expect(decoded).toEqual(expect.any(Object));
      expect(decoded.type).toEqual(0);
    });

    it("should decode Latin-1 messages encoded by older versions", () => {
      const message = { type: 1, payload: { name: "Café" } };

      expect(Base64helper.decode(btoa(JSON.stringify(message)))).toEqual(message);
    });

    it("should throw a TypeError for non-string input", () => {
      expect(() => Base64helper.decode({} as unknown as string)).toThrow(TypeError);
    });

    it("should throw a TypeError when the decoded value is not a message", () => {
      expect(() => Base64helper.decode(btoa("null"))).toThrow(TypeError);
      expect(() => Base64helper.decode(btoa("42"))).toThrow(TypeError);
      expect(() => Base64helper.decode(btoa("{\"type\":\"1\"}"))).toThrow(TypeError);
    });
  });

  describe("encode and decode", () => {
    it("should return the original TMessage object after encoding and decoding", () => {
      const originalMessage = { type: 1, payload: { url: "https://fireguard-instance.com", name: "Café – تطبيق 😀" } };
      const encoded = Base64helper.encode(originalMessage);
      const decoded = Base64helper.decode(encoded);

      expect(decoded).toEqual(originalMessage);
    });
  });
});
