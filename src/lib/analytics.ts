// Custom events for Umami (https://umami.is). Events carry only what happened and
// where, never names, email addresses or message text.

type EventData = Record<string, string | number>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
  }
}

// Events fired before the tracker script has loaded wait here.
const queue: [string, EventData | undefined][] = [];

export function track(name: string, data?: EventData) {
  if (typeof window === "undefined") return;
  if (!window.umami) {
    if (queue.length < 50) queue.push([name, data]);
    return;
  }
  try {
    window.umami.track(name, data);
  } catch {
    // Analytics must never break the page.
  }
}

/** Sends anything queued before the tracker was ready. */
export function flushQueuedEvents() {
  for (const [name, data] of queue.splice(0)) track(name, data);
}
