const { EventHelper, EventType, Base64helper } = require("../dist/firemitt.umd");



describe("tests EventHelper", () => {
  let messageListeners;
  let mockTarget;

  beforeEach(() => {
    messageListeners = [];
    mockTarget = { postMessage: jest.fn() };

    globalThis.window = {
      addEventListener: jest.fn((event, handler) => {
        messageListeners.push(handler);
      }),
      removeEventListener: jest.fn(),
    };
  });

  describe("init", () => {
    it("should return true when a valid target is provided", () => {
      expect(EventHelper.init(mockTarget)).toBe(true);
    });
  });

  describe("send", () => {
    it("should post an encoded message to the target window", () => {
      EventHelper.init(mockTarget);
      EventHelper.send(EventType.Config, { key: "value" });

      expect(mockTarget.postMessage).toHaveBeenCalledTimes(1);
      expect(typeof mockTarget.postMessage.mock.calls[0][0]).toBe("string");
    });

    it("should return EventHelper for chaining", () => {
      EventHelper.init(mockTarget);

      expect(EventHelper.send(EventType.Config, {})).toBe(EventHelper);
    });
  });

  describe("on", () => {
    it("should invoke the callback when the matching event is received", () => {
      EventHelper.init(mockTarget);

      const callback = jest.fn();

      EventHelper.on(EventType.Loaded, callback);

      const encoded = Base64helper.encode({ type: EventType.Loaded, payload: { data: 42 } });

      messageListeners[0]({ isTrusted: true, data: encoded });

      expect(callback).toHaveBeenCalledWith({ data: 42 });
      expect(globalThis.window.removeEventListener).toHaveBeenCalled();
    });

    it("should not invoke the callback for non-matching event types", () => {
      EventHelper.init(mockTarget);

      const callback = jest.fn();

      EventHelper.on(EventType.Loaded, callback);

      const encoded = Base64helper.encode({ type: EventType.Config, payload: {} });

      messageListeners[0]({ isTrusted: true, data: encoded });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should not invoke the callback for untrusted messages", () => {
      EventHelper.init(mockTarget);

      const callback = jest.fn();

      EventHelper.on(EventType.Loaded, callback);

      const encoded = Base64helper.encode({ type: EventType.Loaded, payload: {} });

      messageListeners[0]({ isTrusted: false, data: encoded });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should return EventHelper for chaining", () => {
      expect(EventHelper.on(EventType.Loaded, jest.fn())).toBe(EventHelper);
    });
  });
});
