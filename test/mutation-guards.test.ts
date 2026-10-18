import type { TListener } from "./helpers.ts";
import { vi } from "vitest";
import {
  AuthFailedError,
  Base64helper,
  BaseError,
  ConfigHelper,
  ErrorType,
  EventHelper,
  EventType,
  FiremittHelper,
  InvalidAppError,
  InvalidAppNameError,
  InvalidDimError,
  InvalidFirebaseConfigError,
  InvalidIframeError,
  InvalidProviderError,
  InvalidURLError,
  PopupBlockedError,
} from "../src/index.ts";
import { VALID_FIREBASE } from "./fixtures.ts";
import { createHost } from "./helpers.ts";



describe("tests error messages", () => {
  it.each([
    [new InvalidURLError(), "Invalid URL, please specify a valid http(s) URL for a Fireguard instance"],
    [new InvalidAppError(), "Invalid Firebase app, failed to initialize Firebase with the given configuration"],
    [new InvalidAppNameError(), "Invalid app name, please specify a name for your app"],
    [new InvalidProviderError("x"), "Invalid provider, \"x\" is not a valid provider name"],
    [new InvalidFirebaseConfigError(), "Invalid Firebase configuration"],
    [new InvalidDimError(), "Invalid dimensions, width and height must be finite numbers greater than zero"],
    [new InvalidIframeError(), "iframe mode requires either an iframe element or a container element"],
    [new PopupBlockedError(), "The Fireguard popup was blocked by the browser, call auth() directly from a user gesture such as a click handler"],
  ])("%s has the expected message", (error, message) => {
    expect(error.message).toBe(message);
  });

  it("does not serialize an unset code", () => {
    expect(Object.keys(new BaseError(ErrorType.InvalidApp, "message").toObject())).toEqual(["type", "name", "message"]);
  });

  it("keeps the AuthFailed type when the remote type is not a number", () => {
    expect(new AuthFailedError({ type: "2" }).type).toBe(ErrorType.AuthFailed);
  });

  it("ignores remote messages that are empty or not strings", () => {
    expect(new AuthFailedError({ message: "" }).message).toBe("Authentication failed");
    expect(new AuthFailedError({ message: ["not", "a", "string"] }).message).toBe("Authentication failed");
  });

  it("accepts a null payload", () => {
    expect(new AuthFailedError(null).message).toBe("Authentication failed");
  });
});

describe("tests Base64helper details", () => {
  it("keeps the DEL character (0x7F) unescaped, like plain btoa(JSON)", () => {
    const message = { type: 1, payload: { value: "\u007F" } };

    expect(Base64helper.encode(message)).toBe(btoa(JSON.stringify(message)));
  });

  it("escapes the first non-ASCII character (0x80)", () => {
    expect(atob(Base64helper.encode({ type: 1, payload: { value: "\u0080" } }))).toContain("\\u0080");
  });

  it("throws descriptive errors", () => {
    expect(() => Base64helper.decode(42 as unknown as string)).toThrow("Expected a Base64 encoded string.");
    expect(() => Base64helper.decode(btoa("null"))).toThrow("The decoded value is not a valid message.");
    expect(() => Base64helper.decode(btoa("\"text\""))).toThrow("The decoded value is not a valid message.");
  });
});

describe("tests ConfigHelper defaults", () => {
  beforeEach(() => {
    globalThis.window = { screen: { width: 1024 } } as unknown as Window & typeof globalThis;
  });

  it("uses the default logo and theme", () => {
    const { fireguard } = ConfigHelper.init({ url: "https://fireguard-instance.com", config: { name: "App", firebase: VALID_FIREBASE } });

    expect(fireguard.logo).toBe("");
    expect(fireguard.theme).toEqual({ text: "#1a3544", primary: "#ffe536", secondary: "#1a3544", background: "#ffffff" });
  });

  it("keeps the given logo", () => {
    const { fireguard } = ConfigHelper.init({ url: "https://fireguard-instance.com", config: { name: "App", logo: "https://logo", firebase: VALID_FIREBASE } });

    expect(fireguard.logo).toBe("https://logo");
  });
});

describe("tests ConfigHelper name validation", () => {
  it("requires a name even when the rest of the configuration is valid", () => {
    globalThis.window = { screen: { width: 1024 } } as unknown as Window & typeof globalThis;

    expect(() => ConfigHelper.init({ url: "https://fireguard-instance.com", config: { firebase: VALID_FIREBASE } })).toThrow(InvalidAppNameError);
  });
});

describe("tests EventHelper listener bookkeeping", () => {
  let host: ReturnType<typeof createHost>;

  beforeEach(() => {
    host = createHost();
    globalThis.window = host.window as unknown as Window & typeof globalThis;
    EventHelper.init({ postMessage: vi.fn() } as unknown as Window);
  });

  afterEach(() => {
    EventHelper.dispose();
  });

  it("listens to and removes \"message\" events only", () => {
    EventHelper.on(EventType.Loaded, vi.fn());
    host.dispatch({ isTrusted: true, data: Base64helper.encode({ type: EventType.Loaded, payload: {} }) });

    expect(host.window.addEventListener).toHaveBeenCalledWith("message", expect.any(Function));
    expect(host.window.removeEventListener).toHaveBeenCalledWith("message", expect.any(Function));
  });

  it("forgets a fired listener, so that dispose does not remove it twice", () => {
    EventHelper.on(EventType.Loaded, vi.fn());
    host.dispatch({ isTrusted: true, data: Base64helper.encode({ type: EventType.Loaded, payload: {} }) });
    EventHelper.dispose();

    expect(host.window.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it("removes \"message\" listeners on dispose, once", () => {
    EventHelper.on(EventType.Loaded, vi.fn());
    EventHelper.dispose();
    EventHelper.dispose();

    expect(host.window.removeEventListener).toHaveBeenCalledTimes(1);
    expect(host.window.removeEventListener).toHaveBeenCalledWith("message", expect.any(Function));
  });

  it("calls a one-time listener once, even if it is invoked again before being detached", () => {
    const callback = vi.fn();
    let captured: TListener | undefined;

    host.window.addEventListener.mockImplementationOnce((_: string, listener: TListener) => {
      captured = listener;
    });

    EventHelper.on(EventType.Loaded, callback);

    const event = { isTrusted: true, data: Base64helper.encode({ type: EventType.Loaded, payload: {} }) } as MessageEvent;

    captured!(event);
    captured!(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("tests FiremittHelper session bookkeeping", () => {
  const OPTIONS = { url: "https://fireguard-instance.com", config: { name: "App", firebase: VALID_FIREBASE } };
  let host: ReturnType<typeof createHost>;
  let popup: { closed: boolean; postMessage: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn> };

  const from = (type: EventType, payload: object = {}) => ({ isTrusted: true, source: popup, origin: "https://fireguard-instance.com", data: Base64helper.encode({ type, payload }) });

  beforeEach(() => {
    host = createHost();
    popup = { closed: false, postMessage: vi.fn(), close: vi.fn() };
    host.window.open = vi.fn(() => popup);
    globalThis.window = host.window as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    const helper = FiremittHelper as unknown as { cancelActive: (() => void) | null };

    helper.cancelActive?.();
    helper.cancelActive = null;
    vi.useRealTimers();
  });

  it("listens to and removes \"message\" events only", async () => {
    const authPromise = FiremittHelper.auth(OPTIONS);

    host.dispatch(from(EventType.AuthSucceded, { token: "token" }));
    await authPromise;

    expect(host.window.addEventListener).toHaveBeenCalledWith("message", expect.any(Function));
    expect(host.window.removeEventListener).toHaveBeenCalledWith("message", expect.any(Function));
  });

  it("cleans a session up once, even when a new session starts in the same tick", async () => {
    const authPromise = FiremittHelper.auth(OPTIONS);

    host.dispatch(from(EventType.AuthSucceded, { token: "token" }));
    FiremittHelper.auth(OPTIONS).catch(() => {});

    await authPromise;

    expect(host.window.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["succeeded", { token: "token" }, EventType.AuthSucceded],
    ["failed", { error: "error" }, EventType.AuthFailed],
  ])("does not close the popup of a session that already %s when a new one starts", async (_, payload, type) => {
    const authPromise = FiremittHelper.auth(OPTIONS);

    host.dispatch(from(type, payload));
    await authPromise.catch(() => {});

    FiremittHelper.auth(OPTIONS).catch(() => {});

    expect(popup.close).not.toHaveBeenCalled();
  });

  it("clears the grace timer when a result arrives during the grace period", async () => {
    vi.useFakeTimers();

    const authPromise = FiremittHelper.auth(OPTIONS);

    popup.closed = true;
    vi.advanceTimersByTime(500);
    host.dispatch(from(EventType.AuthSucceded, { token: "token" }));

    await expect(authPromise).resolves.toBe("token");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("never rejects while the popup is open", async () => {
    vi.useFakeTimers();

    const authPromise = FiremittHelper.auth(OPTIONS);
    const onReject = vi.fn();

    authPromise.catch(onReject);
    vi.advanceTimersByTime(5000);
    await Promise.resolve();
    await Promise.resolve();

    expect(onReject).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(1);
  });

  it("starts a single grace period while the popup stays closed", async () => {
    vi.useFakeTimers();

    const authPromise = FiremittHelper.auth(OPTIONS);
    const onReject = vi.fn();

    authPromise.catch(onReject);
    popup.closed = true;
    vi.advanceTimersByTime(500);

    expect(vi.getTimerCount()).toBe(2);

    vi.advanceTimersByTime(300);
    await Promise.resolve();

    expect(onReject).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("creates an iframe element in iframe mode", async () => {
    const iframe = { src: "", style: { width: "", height: "" }, contentWindow: popup, parentNode: { removeChild: vi.fn() } };
    const createElement = vi.fn(() => iframe);

    globalThis.document = { createElement } as unknown as Document;

    FiremittHelper.auth({ ...OPTIONS, mode: "iframe", iframe: { container: { appendChild: vi.fn() } as unknown as HTMLElement } }).catch(() => {});

    expect(createElement).toHaveBeenCalledWith("iframe");
  });
});
