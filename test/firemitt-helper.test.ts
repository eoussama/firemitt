import { vi } from "vitest";
import { Base64helper, EventType, FiremittHelper, InvalidIframeError } from "../src/index.ts";
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
  let mockWin: { postMessage: ReturnType<typeof vi.fn>; closed: boolean };

  beforeEach(() => {
    messageListeners = [];
    mockWin = { postMessage: vi.fn(), closed: false };

    globalThis.window = {
      open: vi.fn(() => mockWin),
      screen: { width: 1024 },
      addEventListener: vi.fn((_, handler: (e: MessageEvent) => void) => {
        messageListeners.push(handler);
      }),
      removeEventListener: vi.fn(),
      setInterval: vi.fn(() => 1),
      clearInterval: vi.fn(),
    } as unknown as Window & typeof globalThis;
  });

  describe("auth (popup mode)", () => {
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

    it("should reject when the authentication window is closed by the user", async () => {
      vi.useFakeTimers();

      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      mockWin.closed = true;
      vi.advanceTimersByTime(600);

      await expect(authPromise).rejects.toThrow("The authentication window was closed.");

      vi.useRealTimers();
    });

    it("should ignore the closed-window poller after the promise is already settled", async () => {
      vi.useFakeTimers();

      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "auth-token-123" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("auth-token-123");

      mockWin.closed = true;
      vi.advanceTimersByTime(600);

      vi.useRealTimers();
    });

    it("should not reject when the poller fires while the window is still open", async () => {
      vi.useFakeTimers();

      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      vi.advanceTimersByTime(600);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "still-open-token" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("still-open-token");

      vi.useRealTimers();
    });

    it("should reject immediately when Closed event is received from Fireguard", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const closedMsg = Base64helper.encode({ type: EventType.Closed, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: closedMsg } as MessageEvent));

      await expect(authPromise).rejects.toThrow("The authentication window was closed.");
    });

    it("should not settle on Retry and resolve after next Loaded flow", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const retryMsg = Base64helper.encode({ type: EventType.Retry, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: retryMsg } as MessageEvent));

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "retry-token" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("retry-token");
    });
  });

  describe("auth (iframe mode)", () => {
    let iframeWin: { postMessage: ReturnType<typeof vi.fn> };
    let mockIframe: {
      src: string;
      contentWindow: typeof iframeWin;
      parentNode: { removeChild: ReturnType<typeof vi.fn> } | null;
      addEventListener: ReturnType<typeof vi.fn>;
    };
    let loadHandler: (() => void) | undefined;

    beforeEach(() => {
      iframeWin = { postMessage: vi.fn() };
      loadHandler = undefined;

      mockIframe = {
        src: "",
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "load") {
            loadHandler = handler;
          }
        }),
      };

      (globalThis.window as unknown as {
        addEventListener: ReturnType<typeof vi.fn>;
      }).addEventListener = vi.fn((_, handler: (e: MessageEvent) => void) => {
        messageListeners.push(handler);
      });
    });

    afterEach(() => {
      const helper = FiremittHelper as unknown as { cancelActiveIframe: (() => void) | null };

      if (helper.cancelActiveIframe) {
        helper.cancelActiveIframe = null;
      }
    });

    it("should throw InvalidIframeError when neither element nor container is given", () => {
      expect(() =>
        FiremittHelper.auth({ ...BASE_OPTIONS, mode: "iframe" }),
      ).toThrow(InvalidIframeError);
    });

    it("should resolve with token using a provided iframe element", async () => {
      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: mockIframe as unknown as HTMLIFrameElement },
      });

      expect(mockIframe.src).toBe("https://fireguard-instance.com/");

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "iframe-token" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("iframe-token");
    });

    it("should reject on AuthFailed when using a provided iframe element", async () => {
      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: mockIframe as unknown as HTMLIFrameElement },
      });

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "iframe_error" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg } as MessageEvent));

      await expect(authPromise).rejects.toBe("iframe_error");
    });

    it("should reject on Closed event when using a provided iframe element", async () => {
      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: mockIframe as unknown as HTMLIFrameElement },
      });

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const closedMsg = Base64helper.encode({ type: EventType.Closed, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: closedMsg } as MessageEvent));

      await expect(authPromise).rejects.toThrow("The authentication window was closed.");
    });

    it("should not remove a caller-provided iframe element on settle", async () => {
      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: mockIframe as unknown as HTMLIFrameElement },
      });

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "no-remove-token" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("no-remove-token");

      expect((mockIframe.parentNode as { removeChild: ReturnType<typeof vi.fn> }).removeChild).not.toHaveBeenCalled();
    });

    it("should create an iframe inside the container and remove it on success", async () => {
      const createdIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "load") {
            loadHandler = handler;
          }
        }),
      };

      const container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => createdIframe),
      } as unknown as Document;

      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      expect(container.appendChild).toHaveBeenCalledWith(createdIframe);
      expect(createdIframe.src).toBe("https://fireguard-instance.com/");
      expect(createdIframe.style.width).toBe("450px");
      expect(createdIframe.style.height).toBe("260px");

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "container-token" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("container-token");

      expect(createdIframe.parentNode.removeChild).toHaveBeenCalledWith(createdIframe);
    });

    it("should apply custom dimensions to auto-created iframe", async () => {
      const createdIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "load") {
            loadHandler = handler;
          }
        }),
      };

      const container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => createdIframe),
      } as unknown as Document;

      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        dim: { width: 800, height: 600 },
        iframe: { container: container as unknown as HTMLElement },
      });

      expect(createdIframe.style.width).toBe("800px");
      expect(createdIframe.style.height).toBe("600px");

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "dim-token" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("dim-token");
    });

    it("should not set dimensions on a caller-provided iframe element", async () => {
      const ownedIframe = {
        ...mockIframe,
        style: { width: "", height: "" },
      };

      FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        dim: { width: 800, height: 600 },
        iframe: { element: ownedIframe as unknown as HTMLIFrameElement },
      }).catch(() => {});

      expect(ownedIframe.style.width).toBe("");
      expect(ownedIframe.style.height).toBe("");
    });

    it("should create an iframe inside the container and remove it on failure", async () => {
      const createdIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "load") {
            loadHandler = handler;
          }
        }),
      };

      const container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => createdIframe),
      } as unknown as Document;

      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "container-fail" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg } as MessageEvent));

      await expect(authPromise).rejects.toBe("container-fail");

      expect(createdIframe.parentNode.removeChild).toHaveBeenCalledWith(createdIframe);
    });

    it("should ignore a second settle attempt in iframe mode (double-settle guard)", async () => {
      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: mockIframe as unknown as HTMLIFrameElement },
      });

      loadHandler!();

      const loadedMsg = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners.forEach(h => h({ isTrusted: true, data: loadedMsg } as MessageEvent));

      const successMsg = Base64helper.encode({ type: EventType.AuthSucceded, payload: { token: "first-settle" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: successMsg } as MessageEvent));

      const failMsg = Base64helper.encode({ type: EventType.AuthFailed, payload: { error: "late-settle" } });

      messageListeners.forEach(h => h({ isTrusted: true, data: failMsg } as MessageEvent));

      await expect(authPromise).resolves.toBe("first-settle");
    });

    it("should cancel an active session when a new auth call is made", async () => {
      const firstIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "load") {
            loadHandler = handler;
          }
        }),
      };

      const container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => firstIframe),
      } as unknown as Document;

      const firstPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      const secondIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn(),
      };

      globalThis.document = {
        createElement: vi.fn(() => secondIframe),
      } as unknown as Document;

      const secondPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      await expect(firstPromise).rejects.toThrow("A new authentication session was started.");

      secondPromise.catch(() => {});

      expect(firstIframe.parentNode.removeChild).toHaveBeenCalledWith(firstIframe);
    });

    it("should not remove a caller-provided element when cancelling an active session", async () => {
      const firstIframe = {
        ...mockIframe,
        style: { width: "", height: "" },
        parentNode: { removeChild: vi.fn() },
      };

      const firstPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: firstIframe as unknown as HTMLIFrameElement },
      });

      const secondIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn(),
      };

      const container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => secondIframe),
      } as unknown as Document;

      const secondPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      await expect(firstPromise).rejects.toThrow("A new authentication session was started.");

      secondPromise.catch(() => {});

      expect(firstIframe.parentNode.removeChild).not.toHaveBeenCalled();
    });

    it("should not call the load handler after the session has been cancelled", async () => {
      let capturedLoadHandler: (() => void) | undefined;

      const cancelledIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "load") {
            capturedLoadHandler = handler;
          }
        }),
      };

      const container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => cancelledIframe),
      } as unknown as Document;

      const firstPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      const secondIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: iframeWin,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn(),
      };

      globalThis.document = {
        createElement: vi.fn(() => secondIframe),
      } as unknown as Document;

      const secondPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      await expect(firstPromise).rejects.toThrow("A new authentication session was started.");

      secondPromise.catch(() => {});

      capturedLoadHandler!();

      expect(iframeWin.postMessage).not.toHaveBeenCalled();
    });

    it("should reject and clean up when contentWindow is null after load", async () => {
      const nullWinIframe = {
        src: "",
        style: { width: "", height: "" },
        contentWindow: null,
        parentNode: { removeChild: vi.fn() },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === "load") {
            loadHandler = handler;
          }
        }),
      };

      const container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => nullWinIframe),
      } as unknown as Document;

      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      loadHandler!();

      await expect(authPromise).rejects.toThrow("Could not access the iframe window.");

      expect(nullWinIframe.parentNode.removeChild).toHaveBeenCalledWith(nullWinIframe);
    });
  });
});
