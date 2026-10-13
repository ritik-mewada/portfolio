// Sends an Umami event from the server, for things the browser never reports
// (the spam filter runs after the visitor's page is done).

export async function trackServerEvent(request: Request, name: string, data?: Record<string, string>) {
  const website = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!website) return;
  try {
    await fetch("https://cloud.umami.is/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Umami rejects requests without a browser-like User-Agent, and drops ones that look like bots.
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      },
      body: JSON.stringify({
        type: "event",
        payload: { website, hostname: new URL(request.url).hostname, url: "/api/contact", language: "en-US", name, data },
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Analytics must never break the contact form.
  }
}
