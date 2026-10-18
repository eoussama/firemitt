import { vi } from "vitest";
import { Base64helper, EventHelper, EventType } from "../src/index.ts";



type TListener = (e: MessageEvent) => void;

describe("tests EventHelper", () => {
  let listeners: Set<TListener>;
  let mockTarget: { postMessage: ReturnType<typeof vi.fn> };
  let host: {
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  const dispatch = (e: Partial<MessageEvent>): void => {
    [...listeners].forEach(listener => listener(e as MessageEvent));
  };

  const createHost = () => ({
    addEventListener: vi.fn((_: string, listener: TListener) => listeners.add(listener)),
    removeEventListener: vi.fn((_: string, listener: TListener) => listeners.delete(listener)),
  });

  beforeEach(() => {
    listeners = new Set();
    mockTarget = { postMessage: vi.fn() };
    host = createHost();

    globalThis.window = host as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    EventHelper.dispose();
  });

  describe("init", () => {
    it("should return true when a valid target is provided", () => {
      expect(EventHelper.init(mockTarget as unknown as Window)).toBe(true);
    });

    it("should return false and keep the current session when no target is provided", () => {
      EventHelper.init(mockTarget as unknown as Window);
      EventHelper.on(EventType.Config, vi.fn());

      expect(EventHelper.init(null)).toBe(false);
      expect(EventHelper.init(undefined)).toBe(false);
      expect(listeners.size).toBe(1);

      EventHelper.send(EventType.Loaded);

      expect(mockTarget.postMessage).toHaveBeenCalledTimes(1);
    });

    it("should remove the listeners of the previous session from the window they were attached to", () => {
      EventHelper.init(mockTarget as unknown as Window);
      EventHelper.on(EventType.Config, vi.fn());

      const previousHost = host;

      host = createHost();
      globalThis.window = host as unknown as Window & typeof globalThis;

      EventHelper.init(mockTarget as unknown as Window);

      expect(previousHost.removeEventListener).toHaveBeenCalledTimes(1);
      expect(listeners.size).toBe(0);
    });
  });

  describe("send", () => {
    it("should post an encoded message to the target window, to any origin by default", () => {
      EventHelper.init(mockTarget as unknown as Window);
      EventHelper.send(EventType.Config, { key: "value" });

      const [data, origin] = mockTarget.postMessage.mock.calls[0];

      expect(Base64helper.decode(data)).toEqual({ type: EventType.Config, payload: { key: "value" } });
      expect(origin).toBe("*");
    });

    it("should post to the given target origin", () => {
      EventHelper.init(mockTarget as unknown as Window);
      EventHelper.send(EventType.AuthSucceded, { token: "token" }, "https://host.example");

      expect(mockTarget.postMessage).toHaveBeenCalledWith(expect.any(String), "https://host.example");
    });

    it("should return EventHelper for chaining", () => {
      EventHelper.init(mockTarget as unknown as Window);

      expect(EventHelper.send(EventType.Config, {})).toBe(EventHelper);
    });
  });

  describe("on", () => {
    it("should invoke the callback once with the payload and the event, then remove the listener", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();
      const event = { isTrusted: true, data: Base64helper.encode({ type: EventType.Loaded, payload: { data: 42 } }) };

      EventHelper.on(EventType.Loaded, callback);
      dispatch(event);
      dispatch(event);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ data: 42 }, event);
      expect(host.removeEventListener).toHaveBeenCalled();
    });

    it("should remove the listener even when the callback throws", () => {
      EventHelper.init(mockTarget as unknown as Window);
      EventHelper.on(EventType.Loaded, () => {
        throw new Error("boom");
      });

      expect(() => dispatch({ isTrusted: true, data: Base64helper.encode({ type: EventType.Loaded, payload: {} }) })).toThrow("boom");
      expect(listeners.size).toBe(0);
    });

    it("should not invoke the callback for non-matching event types", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();

      EventHelper.on(EventType.Loaded, callback);
      dispatch({ isTrusted: true, data: Base64helper.encode({ type: EventType.Config, payload: {} }) });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should silently ignore messages that are not valid encoded messages", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();

      EventHelper.on(EventType.Loaded, callback);

      expect(() => {
        dispatch({ isTrusted: true, data: "not-valid-base64!!!" });
        dispatch({ isTrusted: true, data: { type: EventType.Loaded } });
        dispatch({ isTrusted: true, data: btoa("null") });
      }).not.toThrow();

      expect(callback).not.toHaveBeenCalled();
    });

    it("should not invoke the callback for untrusted messages", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();

      EventHelper.on(EventType.Loaded, callback);
      dispatch({ isTrusted: false, data: Base64helper.encode({ type: EventType.Loaded, payload: {} }) });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should only accept messages from the given source", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();
      const data = Base64helper.encode({ type: EventType.Config, payload: {} });

      EventHelper.on(EventType.Config, callback, { source: mockTarget as unknown as Window });
      dispatch({ isTrusted: true, data, source: {} as Window });

      expect(callback).not.toHaveBeenCalled();

      dispatch({ isTrusted: true, data, source: mockTarget as unknown as Window });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not filter when the source option is undefined, and only match source-less messages when it is null", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const unfiltered = vi.fn();
      const nullSource = vi.fn();
      const data = Base64helper.encode({ type: EventType.Config, payload: {} });

      EventHelper.on(EventType.Config, unfiltered, { source: undefined });
      EventHelper.on(EventType.Config, nullSource, { source: null });
      dispatch({ isTrusted: true, data, source: mockTarget as unknown as Window });

      expect(unfiltered).toHaveBeenCalledTimes(1);
      expect(nullSource).not.toHaveBeenCalled();

      dispatch({ isTrusted: true, data, source: null });

      expect(nullSource).toHaveBeenCalledTimes(1);
    });

    it("should return EventHelper for chaining", () => {
      expect(EventHelper.on(EventType.Loaded, vi.fn())).toBe(EventHelper);
    });
  });

  describe("dispose", () => {
    it("should remove every active listener", () => {
      EventHelper.init(mockTarget as unknown as Window);
      EventHelper.on(EventType.Loaded, vi.fn()).on(EventType.Config, vi.fn());

      EventHelper.dispose();

      expect(listeners.size).toBe(0);
    });
  });

  describe("before init", () => {
    it("should not throw when sending, and listen on the current window", async () => {
      vi.resetModules();

      const fresh = await import("../src/index.ts");
      const callback = vi.fn();

      expect(() => fresh.EventHelper.send(fresh.EventType.Loaded)).not.toThrow();

      fresh.EventHelper.on(fresh.EventType.Loaded, callback);
      dispatch({ isTrusted: true, data: fresh.Base64helper.encode({ type: fresh.EventType.Loaded, payload: {} }) });

      expect(host.addEventListener).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
