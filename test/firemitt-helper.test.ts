import type { TFireguardConfig, TMessage } from "../src/index.ts";
import { vi } from "vitest";
import {
  AuthFailedError,
  Base64helper,
  ErrorType,
  EventType,
  FiremittHelper,
  InvalidAppNameError,
  InvalidIframeError,
  InvalidURLError,
  PopupBlockedError,
} from "../src/index.ts";
import { VALID_FIREBASE } from "./fixtures.ts";



const ORIGIN = "https://fireguard-instance.com";
const CLOSED = "The authentication window was closed.";
const REPLACED = "A new authentication session was started.";

const BASE_OPTIONS = {
  url: ORIGIN,
  config: {
    name: "TestApp",
    firebase: VALID_FIREBASE,
  },
};

type TListener = (e: MessageEvent) => void;

type TFakeWindow = {
  closed: boolean;
  postMessage: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
};

type TFakeIframe = {
  src: string;
  style: { width: string; height: string };
  contentWindow: TFakeWindow | null;
  parentNode: { removeChild: ReturnType<typeof vi.fn> } | null;
};

/**
 * Creates a fake window that can post messages and be closed.
 *
 * @returns The fake window.
 */
function createWindow(): TFakeWindow {
  const win: TFakeWindow = {
    closed: false,
    postMessage: vi.fn(),
    close: vi.fn(() => {
      win.closed = true;
    }),
  };

  return win;
}

/**
 * Creates a fake iframe element.
 *
 * @param contentWindow The window of the iframe.
 * @returns The fake iframe.
 */
function createIframe(contentWindow: TFakeWindow | null = createWindow()): TFakeIframe {
  return {
    src: "",
    style: { width: "", height: "" },
    contentWindow,
    parentNode: { removeChild: vi.fn() },
  };
}

/**
 * Builds a message event as posted by Fireguard.
 *
 * @param source The window that posted the message.
 * @param type The event type.
 * @param payload The payload of the message.
 * @param origin The origin of the window that posted the message.
 * @returns The message event.
 */
function from(source: unknown, type: EventType, payload: object = {}, origin: string = ORIGIN): MessageEvent {
  return { isTrusted: true, source, origin, data: Base64helper.encode({ type, payload }) } as unknown as MessageEvent;
}

/**
 * Decodes the message posted at the given call index of a fake window.
 *
 * @param win The fake window.
 * @param index The call index.
 * @returns The decoded message and its target origin.
 */
function posted(win: TFakeWindow, index = 0): { message: TMessage<TFireguardConfig>; origin: string } {
  const [data, origin] = win.postMessage.mock.calls[index];

  return { message: Base64helper.decode<TFireguardConfig>(data), origin };
}

describe("tests FiremittHelper", () => {
  let listeners: Set<TListener>;
  let popup: TFakeWindow;
  let host: {
    open: ReturnType<typeof vi.fn>;
    screen: { width: number };
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  const dispatch = (e: MessageEvent): void => {
    [...listeners].forEach(listener => listener(e));
  };

  beforeEach(() => {
    listeners = new Set();
    popup = createWindow();

    host = {
      open: vi.fn(() => popup),
      screen: { width: 1024 },
      addEventListener: vi.fn((_: string, listener: TListener) => listeners.add(listener)),
      removeEventListener: vi.fn((_: string, listener: TListener) => listeners.delete(listener)),
    };

    globalThis.window = host as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    const helper = FiremittHelper as unknown as { cancelActive: (() => void) | null };

    helper.cancelActive?.();
    helper.cancelActive = null;
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("auth (popup mode)", () => {
    it("should open a popup window with the normalized URL and window features", () => {
      FiremittHelper.auth(BASE_OPTIONS).catch(() => {});

      expect(host.open).toHaveBeenCalledWith(`${ORIGIN}/`, "_blank", expect.stringMatching(/^width=450,height=260,left=-?\d+,top=50$/));
    });

    it("should throw synchronously on invalid options", () => {
      expect(() => FiremittHelper.auth({ url: "invalid" })).toThrow(InvalidURLError);
      expect(host.open).not.toHaveBeenCalled();
    });

    it("should answer Loaded with the config and resolve with the token", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch(from(popup, EventType.Loaded));

      const { message, origin } = posted(popup);

      expect(origin).toBe(ORIGIN);
      expect(message.type).toBe(EventType.Config);
      expect(message.payload.name).toBe("TestApp");
      expect(message.payload.firebase).toEqual(VALID_FIREBASE);

      dispatch(from(popup, EventType.AuthSucceded, { token: "auth-token-123" }));

      await expect(authPromise).resolves.toBe("auth-token-123");
      expect(listeners.size).toBe(0);
    });

    it("should answer every Loaded event, e.g. after Fireguard reloads", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch(from(popup, EventType.Loaded));
      dispatch(from(popup, EventType.Loaded));

      expect(popup.postMessage).toHaveBeenCalledTimes(2);
      expect(host.addEventListener).toHaveBeenCalledTimes(1);
      expect(listeners.size).toBe(1);

      dispatch(from(popup, EventType.AuthSucceded, { token: "token" }));

      await expect(authPromise).resolves.toBe("token");
    });

    it("should post the config to any origin when Fireguard has an opaque origin", () => {
      FiremittHelper.auth(BASE_OPTIONS).catch(() => {});

      dispatch(from(popup, EventType.Loaded, {}, "null"));
      dispatch(from(popup, EventType.Loaded, {}, ""));

      expect(posted(popup, 0).origin).toBe("*");
      expect(posted(popup, 1).origin).toBe("*");
    });

    it("should encode non Latin-1 config values", () => {
      FiremittHelper.auth({ ...BASE_OPTIONS, config: { ...BASE_OPTIONS.config, name: "Café – تطبيق 😀" } }).catch(() => {});

      dispatch(from(popup, EventType.Loaded));

      expect(posted(popup).message.payload.name).toBe("Café – تطبيق 😀");
    });

    it("should ignore messages from other windows, untrusted events and invalid data", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);
      const intruder = createWindow();

      dispatch(from(intruder, EventType.Loaded));
      dispatch(from(intruder, EventType.AuthSucceded, { token: "forged" }));
      dispatch({ ...from(popup, EventType.AuthSucceded, { token: "untrusted" }), isTrusted: false } as MessageEvent);
      dispatch({ isTrusted: true, source: popup, origin: ORIGIN, data: "not-valid-base64!!!" } as unknown as MessageEvent);
      dispatch({ isTrusted: true, source: popup, origin: ORIGIN, data: { type: EventType.AuthSucceded } } as unknown as MessageEvent);

      expect(intruder.postMessage).not.toHaveBeenCalled();
      expect(popup.postMessage).not.toHaveBeenCalled();

      dispatch(from(popup, EventType.AuthSucceded, { token: "real" }));

      await expect(authPromise).resolves.toBe("real");
    });

    it("should reject with an AuthFailedError carrying the remote error", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);
      const error = { type: ErrorType.InvalidApp, name: "InvalidAppError", message: "Invalid app", code: "auth/invalid-api-key" };

      dispatch(from(popup, EventType.AuthFailed, { error }));

      const rejection = await authPromise.catch((e: unknown) => e) as AuthFailedError;

      expect(rejection).toBeInstanceOf(AuthFailedError);
      expect(rejection).toBeInstanceOf(Error);
      expect(rejection.type).toBe(ErrorType.InvalidApp);
      expect(rejection.name).toBe("InvalidAppError");
      expect(rejection.message).toBe("Invalid app");
      expect(rejection.code).toBe("auth/invalid-api-key");
      expect(rejection.cause).toEqual(error);
    });

    it("should reject with an AuthFailedError when the remote error is a string", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch(from(popup, EventType.AuthFailed, { error: "auth_error" }));

      await expect(authPromise).rejects.toMatchObject({ type: ErrorType.AuthFailed, name: "AuthFailedError", message: "auth_error" });
    });

    it("should reject with a generic AuthFailedError when the failure has no payload", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch({ isTrusted: true, source: popup, origin: ORIGIN, data: Base64helper.encode({ type: EventType.AuthFailed } as TMessage) } as unknown as MessageEvent);

      await expect(authPromise).rejects.toMatchObject({ type: ErrorType.AuthFailed, message: "Authentication failed" });
    });

    it("should reject when the success event carries no token", async () => {
      const first = FiremittHelper.auth(BASE_OPTIONS);

      dispatch(from(popup, EventType.AuthSucceded, { token: "" }));

      await expect(first).rejects.toBeInstanceOf(AuthFailedError);

      const second = FiremittHelper.auth(BASE_OPTIONS);

      dispatch({ isTrusted: true, source: popup, origin: ORIGIN, data: Base64helper.encode({ type: EventType.AuthSucceded } as TMessage) } as unknown as MessageEvent);

      await expect(second).rejects.toThrow("Fireguard reported a successful authentication without a token");
    });

    it("should reject when the Closed event is received", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch(from(popup, EventType.Closed));

      await expect(authPromise).rejects.toThrow(CLOSED);
    });

    it.each([
      ["success", () => from(popup, EventType.AuthSucceded, { token: "token" })],
      ["failure", () => from(popup, EventType.AuthFailed, { error: "error" })],
      ["closed", () => from(popup, EventType.Closed)],
    ])("should remove its listener and timers once settled (%s)", async (_, event) => {
      vi.useFakeTimers();

      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      expect(vi.getTimerCount()).toBe(1);

      dispatch(event());
      await authPromise.catch(() => {});

      expect(listeners.size).toBe(0);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("should accept a result message encoded by Firemitt 0.1.8 / Fireguard 0.1.3 (wire format)", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch({ isTrusted: true, source: popup, origin: ORIGIN, data: btoa(JSON.stringify({ type: 2, payload: { token: "wire-token" } })) } as unknown as MessageEvent);

      await expect(authPromise).resolves.toBe("wire-token");
    });

    it("should not settle on Retry", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch(from(popup, EventType.Loaded));
      dispatch(from(popup, EventType.Retry));
      dispatch(from(popup, EventType.Loaded));
      dispatch(from(popup, EventType.AuthSucceded, { token: "retry-token" }));

      await expect(authPromise).resolves.toBe("retry-token");
    });

    it("should settle only once, even when a new session starts right after", async () => {
      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      dispatch(from(popup, EventType.AuthSucceded, { token: "first" }));
      dispatch(from(popup, EventType.AuthFailed, { error: "late" }));
      FiremittHelper.auth(BASE_OPTIONS).catch(() => {});

      await expect(authPromise).resolves.toBe("first");
    });

    it("should reject with PopupBlockedError when the popup cannot be opened, leaving the active session untouched", async () => {
      const active = FiremittHelper.auth(BASE_OPTIONS);

      host.open.mockReturnValueOnce(null);

      await expect(FiremittHelper.auth(BASE_OPTIONS)).rejects.toBeInstanceOf(PopupBlockedError);
      expect(popup.close).not.toHaveBeenCalled();

      dispatch(from(popup, EventType.AuthSucceded, { token: "still-active" }));

      await expect(active).resolves.toBe("still-active");
    });

    it("should reject after a grace period once the popup is closed", async () => {
      vi.useFakeTimers();

      const authPromise = FiremittHelper.auth(BASE_OPTIONS);
      const onReject = vi.fn();

      authPromise.catch(onReject);

      vi.advanceTimersByTime(500);
      popup.closed = true;
      vi.advanceTimersByTime(500);
      await Promise.resolve();

      expect(onReject).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      await expect(authPromise).rejects.toThrow(CLOSED);
      expect(listeners.size).toBe(0);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("should let a token posted right before the popup closed win over the closed poller", async () => {
      vi.useFakeTimers();

      const authPromise = FiremittHelper.auth(BASE_OPTIONS);

      popup.closed = true;
      vi.advanceTimersByTime(500);
      dispatch(from(popup, EventType.AuthSucceded, { token: "last-second" }));
      vi.advanceTimersByTime(300);

      await expect(authPromise).resolves.toBe("last-second");
    });

    it("should cancel and close the previous popup when a new session starts", async () => {
      const firstPopup = popup;
      const first = FiremittHelper.auth(BASE_OPTIONS);

      popup = createWindow();
      host.open.mockReturnValueOnce(popup);

      const second = FiremittHelper.auth(BASE_OPTIONS);

      await expect(first).rejects.toThrow(REPLACED);
      expect(firstPopup.close).toHaveBeenCalled();
      expect(listeners.size).toBe(1);

      dispatch(from(firstPopup, EventType.AuthSucceded, { token: "stale" }));
      dispatch(from(popup, EventType.AuthSucceded, { token: "fresh" }));

      await expect(second).resolves.toBe("fresh");
    });

    it("should not close a previous popup that is already closed", async () => {
      const firstPopup = popup;
      const first = FiremittHelper.auth(BASE_OPTIONS);

      firstPopup.closed = true;
      host.open.mockReturnValueOnce(createWindow());

      FiremittHelper.auth(BASE_OPTIONS).catch(() => {});

      await expect(first).rejects.toThrow(REPLACED);
      expect(firstPopup.close).not.toHaveBeenCalled();
    });
  });

  describe("auth (iframe mode)", () => {
    let created: TFakeIframe;
    let container: { appendChild: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      created = createIframe();
      container = { appendChild: vi.fn() };

      globalThis.document = {
        createElement: vi.fn(() => created),
      } as unknown as Document;
    });

    it("should throw InvalidIframeError when neither element nor container is given", () => {
      expect(() => FiremittHelper.auth({ ...BASE_OPTIONS, mode: "iframe" })).toThrow(InvalidIframeError);
    });

    it("should listen before loading Fireguard into a provided element, without resizing or removing it", async () => {
      const iframe = createIframe();

      host.addEventListener.mockImplementationOnce((_: string, listener: TListener) => {
        expect(iframe.src).toBe("");
        listeners.add(listener);
      });

      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        dim: { width: 800, height: 600 },
        iframe: { element: iframe as unknown as HTMLIFrameElement },
      });

      expect(iframe.src).toBe(`${ORIGIN}/`);
      expect(iframe.style).toEqual({ width: "", height: "" });

      dispatch(from(iframe.contentWindow, EventType.Loaded));

      expect(posted(iframe.contentWindow!).message.type).toBe(EventType.Config);

      dispatch(from(iframe.contentWindow, EventType.AuthSucceded, { token: "iframe-token" }));

      await expect(authPromise).resolves.toBe("iframe-token");
      expect(iframe.parentNode!.removeChild).not.toHaveBeenCalled();
    });

    it("should create, size and append an iframe in the container, and remove it on success", async () => {
      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        dim: { width: 800, height: 600 },
        iframe: { container: container as unknown as HTMLElement },
      });

      expect(container.appendChild).toHaveBeenCalledWith(created);
      expect(created.src).toBe(`${ORIGIN}/`);
      expect(created.style).toEqual({ width: "800px", height: "600px" });

      dispatch(from(created.contentWindow, EventType.Loaded));
      dispatch(from(created.contentWindow, EventType.AuthSucceded, { token: "container-token" }));

      await expect(authPromise).resolves.toBe("container-token");
      expect(created.parentNode!.removeChild).toHaveBeenCalledWith(created);
    });

    it("should remove the created iframe on failure, and tolerate an iframe already detached", async () => {
      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      dispatch(from(created.contentWindow, EventType.AuthFailed, { error: "container-fail" }));

      await expect(authPromise).rejects.toThrow("container-fail");
      expect(created.parentNode!.removeChild).toHaveBeenCalledWith(created);

      created = createIframe();
      created.parentNode = null;

      const detached = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      dispatch(from(created.contentWindow, EventType.Closed));

      await expect(detached).rejects.toThrow(CLOSED);
    });

    it("should ignore messages while the iframe has no window", async () => {
      const iframe = createIframe(null);

      const authPromise = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: iframe as unknown as HTMLIFrameElement },
      });

      dispatch(from(null, EventType.AuthSucceded, { token: "orphan" }));

      iframe.contentWindow = createWindow();
      dispatch(from(iframe.contentWindow, EventType.AuthSucceded, { token: "attached" }));

      await expect(authPromise).resolves.toBe("attached");
    });

    it("should cancel the previous iframe session, removing only owned iframes", async () => {
      const element = createIframe();

      const first = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { element: element as unknown as HTMLIFrameElement },
      });

      const second = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      await expect(first).rejects.toThrow(REPLACED);
      expect(element.parentNode!.removeChild).not.toHaveBeenCalled();

      FiremittHelper.auth(BASE_OPTIONS).catch(() => {});

      await expect(second).rejects.toThrow(REPLACED);
      expect(created.parentNode!.removeChild).toHaveBeenCalledWith(created);
    });

    it("should cancel and close an active popup session", async () => {
      const first = FiremittHelper.auth(BASE_OPTIONS);

      FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      }).catch(() => {});

      await expect(first).rejects.toThrow(REPLACED);
      expect(popup.close).toHaveBeenCalled();
    });

    it("should not cancel the active session when the new options are invalid", async () => {
      const first = FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        iframe: { container: container as unknown as HTMLElement },
      });

      expect(() => FiremittHelper.auth({
        ...BASE_OPTIONS,
        mode: "iframe",
        config: { ...BASE_OPTIONS.config, name: "" },
        iframe: { container: container as unknown as HTMLElement },
      })).toThrow(InvalidAppNameError);

      dispatch(from(created.contentWindow, EventType.AuthSucceded, { token: "kept" }));

      await expect(first).resolves.toBe("kept");
    });
  });
});
