const { EnumHelper, ErrorType, EventType } = require("../dist/firemitt.umd");



describe("tests EnumHelper", () => {
  describe("getName", () => {
    it("should return the key name for a known enum value", () => {
      expect(EnumHelper.getName(ErrorType, ErrorType.InvalidURL)).toBe("InvalidURL");
      expect(EnumHelper.getName(ErrorType, ErrorType.InvalidApp)).toBe("InvalidApp");
      expect(EnumHelper.getName(EventType, EventType.Loaded)).toBe("Loaded");
      expect(EnumHelper.getName(EventType, EventType.Config)).toBe("Config");
    });

    it("should return undefined for an unknown enum value", () => {
      expect(EnumHelper.getName(ErrorType, 999)).toBeUndefined();
    });
  });
});
