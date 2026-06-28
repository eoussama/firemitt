import { Base64helper } from "../src/index.ts";



describe("base64helper", () => {
  describe("encode", () => {
    it("should correctly encode a TMessage object to a Base64 string", () => {
      const message = { type: 0, payload: {} };
      const encoded = Base64helper.encode(message);

      expect(encoded).toEqual(expect.any(String));
    });
  });

  describe("decode", () => {
    it("should correctly decode a Base64 string to a TMessage object", () => {
      const base64String = "eyAidHlwZSI6IDAsICJwYXlsb2FkIjoge30gfQ==";
      const decoded = Base64helper.decode(base64String);

      expect(decoded).toEqual(expect.any(Object));
      expect(decoded.type).toEqual(0);
    });
  });

  describe("encode and decode", () => {
    it("should return the original TMessage object after encoding and decoding", () => {
      const originalMessage = { type: 1, payload: { url: "https://fireguard-instance.com" } };
      const encoded = Base64helper.encode(originalMessage);
      const decoded = Base64helper.decode(encoded);

      expect(decoded).toEqual(originalMessage);
    });
  });
});
