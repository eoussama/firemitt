const { FiremittHelper, EventType, Base64helper } = require("../dist/firemitt.umd");



const BASE_OPTIONS = {
  url: "https://fireguard-instance.com",
  config: {
    name: "TestApp",
    firebase: { apiKey: "test-key" },
  },
};

describe("tests FiremittHelper", () => {
  let messageListeners;
  let mockWin;

  beforeEach(() => {
    messageListeners = [];
    mockWin = { postMessage: jest.fn() };

    globalThis.window = {
      open: jest.fn(() => mockWin),
      screen: { width: 1024 },
      addEventListener: jest.fn((event, handler) => {
        messageListeners.push(handler);
      }),
      removeEventListener: jest.fn(),
    };
  });

  describe("auth", () => {
    it("should resolve with token on successful authentication", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg }));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "auth-token-123" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg }));

      await expect(authPromise).resolves.toBe("auth-token-123");
    });

    it("should reject with error on failed authentication", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg }));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "auth_error" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg }));

      await expect(authPromise).rejects.toBe("auth_error");
    });

    it("should open a popup window with the correct URL", () => {
      FiremittHelper.auth(BASE_OPTIONS);

      expect(globalThis.window.open).toHaveBeenCalledWith(
        "https://fireguard-instance.com/",
        "_blank",
        expect.any(String),
      );
    });
  });
});
