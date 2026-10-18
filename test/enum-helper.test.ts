import { EnumHelper, ErrorType, EventType } from "../src/index.ts";



describe("tests wire values", () => {
  it("should never renumber EventType, its values are exchanged with deployed Fireguard instances", () => {
    expect({ ...EventType }).toEqual({
      0: "Loaded",
      1: "Config",
      2: "AuthSucceded",
      3: "AuthFailed",
      4: "Retry",
      5: "Closed",
      Loaded: 0,
      Config: 1,
      AuthSucceded: 2,
      AuthFailed: 3,
      Retry: 4,
      Closed: 5,
    });
  });

  it("should never renumber ErrorType, its values are exchanged with deployed Fireguard instances", () => {
    expect({ ...ErrorType }).toEqual({
      1: "InvalidURL",
      2: "InvalidApp",
      3: "InvalidAppName",
      4: "InvalidProvider",
      5: "InvalidFirebaseConfig",
      6: "InvalidDim",
      7: "InvalidIframe",
      8: "PopupBlocked",
      9: "AuthFailed",
      InvalidURL: 1,
      InvalidApp: 2,
      InvalidAppName: 3,
      InvalidProvider: 4,
      InvalidFirebaseConfig: 5,
      InvalidDim: 6,
      InvalidIframe: 7,
      PopupBlocked: 8,
      AuthFailed: 9,
    });
  });
});

describe("tests EnumHelper", () => {
  describe("getName", () => {
    it("should return the key name for a known enum value", () => {
      expect(EnumHelper.getName(ErrorType, ErrorType.InvalidURL)).toBe("InvalidURL");
      expect(EnumHelper.getName(ErrorType, ErrorType.InvalidApp)).toBe("InvalidApp");
      expect(EnumHelper.getName(EventType, EventType.Loaded)).toBe("Loaded");
      expect(EnumHelper.getName(EventType, EventType.Config)).toBe("Config");
    });

    it("should return undefined for an unknown enum value", () => {
      expect(EnumHelper.getName(ErrorType, 999 as ErrorType)).toBeUndefined();
    });
  });
});
