import { vi } from "vitest";
import { Base64helper, EventType, FiremittHelper } from "../src/index.ts";
import { VALID_FIREBASE } from "./fixtures.ts";



const BASE_OPTIONS = {
  url: "https://fireguard-instance.com",
  config: {
    name: "TestApp",
    firebase: VALID_FIREBASE,
  },
};

describe("tests FiremittHelper", () => {
  let messageListeners: Array<(e: MessageEvent) => void>;
  let mockWin: { postMessage: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    messageListeners = [];
    mockWin = { postMessage: vi.fn() };

    globalThis.window = {
      open: vi.fn(() => mockWin),
      screen: { width: 1024 },
      addEventListener: vi.fn((_, handler: (e: MessageEvent) => void) => {
        messageListeners.push(handler);
      }),
      removeEventListener: vi.fn(),
    } as unknown as Window & typeof globalThis;
  });

  describe("auth", () => {
    it("should resolve with token on successful authentication", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "auth-token-123" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("auth-token-123");
    });

    it("should reject with error on failed authentication", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "auth_error" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg } as MessageEvent));

      await expect(authPromise).rejects.toBe("auth_error");
    });

    it("should open a popup window with the correct URL", () => {
      FiremittHelper.auth(BASE_OPTIONS);

      expect((globalThis.window as unknown as { open: ReturnType<typeof vi.fn> }).open).toHaveBeenCalledWith(
        "https://fireguard-instance.com/",
        "_blank",
        expect.any(String),
      );
    });

    it("should not set up event listeners when the popup fails to open", () => {
      (globalThis.window as unknown as { open: ReturnType<typeof vi.fn> }).open = vi.fn(() => null);

      FiremittHelper.auth(BASE_OPTIONS);

      expect(globalThis.window.addEventListener).not.toHaveBeenCalled();
    });

    it("should ignore AuthSucceded after already settled via AuthFailed", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "first_error" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "late-token" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).rejects.toBe("first_error");
    });

    it("should ignore AuthFailed after already settled via AuthSucceded", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "auth-token-123" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "late_error" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("auth-token-123");
    });

    it("should resolve with token on successful authentication after retry", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "auth_error" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg } as MessageEvent));

      await expect(authPromise).rejects.toBe("auth_error");
    });
  });
});
