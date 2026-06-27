import { vi } from "vitest";
import { Base64helper, EventHelper, EventType } from "../src/index.ts";



describe("tests EventHelper", () => {
  let messageListeners: Array<(e: MessageEvent) => void>;
  let mockTarget: { postMessage: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    messageListeners = [];
    mockTarget = { postMessage: vi.fn() };

    globalThis.window = {
      addEventListener: vi.fn((_, handler: (e: MessageEvent) => void) => {
        messageListeners.push(handler);
      }),
      removeEventListener: vi.fn(),
    } as unknown as Window & typeof globalThis;
  });

  describe("init", () => {
    it("should return true when a valid target is provided", () => {
      expect(EventHelper.init(mockTarget as unknown as Window)).toBe(true);
    });
  });

  describe("send", () => {
    it("should post an encoded message to the target window", () => {
      EventHelper.init(mockTarget as unknown as Window);
      EventHelper.send(EventType.Config, { key: "value" });

      expect(mockTarget.postMessage).toHaveBeenCalledTimes(1);
      expect(typeof mockTarget.postMessage.mock.calls[0][0]).toBe("string");
    });

    it("should return EventHelper for chaining", () => {
      EventHelper.init(mockTarget as unknown as Window);

      expect(EventHelper.send(EventType.Config, {})).toBe(EventHelper);
    });
  });

  describe("on", () => {
    it("should invoke the callback when the matching event is received", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();

      EventHelper.on(EventType.Loaded, callback);

      const encoded = Base64helper.encode({ type: EventType.Loaded, payload: { data: 42 } });

      messageListeners[0]({ isTrusted: true, data: encoded } as MessageEvent);

      expect(callback).toHaveBeenCalledWith({ data: 42 });
      expect((globalThis.window as unknown as { removeEventListener: ReturnType<typeof vi.fn> }).removeEventListener).toHaveBeenCalled();
    });

    it("should not invoke the callback for non-matching event types", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();

      EventHelper.on(EventType.Loaded, callback);

      const encoded = Base64helper.encode({ type: EventType.Config, payload: {} });

      messageListeners[0]({ isTrusted: true, data: encoded } as MessageEvent);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should not invoke the callback for untrusted messages", () => {
      EventHelper.init(mockTarget as unknown as Window);

      const callback = vi.fn();

      EventHelper.on(EventType.Loaded, callback);

      const encoded = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners[0]({ isTrusted: false, data: encoded } as MessageEvent);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should return EventHelper for chaining", () => {
      expect(EventHelper.on(EventType.Loaded, vi.fn())).toBe(EventHelper);
    });
  });
});
