import { vi } from "vitest";



/**
 * A message listener.
 */
export type TListener = (e: MessageEvent) => void;

/**
 * Creates a fake host window that keeps track of its message listeners.
 *
 * @returns The fake window, its listeners and a dispatch function.
 */
export function createHost() {
  const listeners = new Set<TListener>();

  const window = {
    open: vi.fn(),
    screen: { width: 1024 },
    addEventListener: vi.fn((_: string, listener: TListener): void => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_: string, listener: TListener): void => {
      listeners.delete(listener);
    }),
  };

  const dispatch = (e: Partial<MessageEvent> | Record<string, unknown>): void => {
    [...listeners].forEach(listener => listener(e as MessageEvent));
  };

  return { window, listeners, dispatch };
}
