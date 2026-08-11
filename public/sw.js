self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data?.text() }; }
  event.waitUntil(self.registration.showNotification(data.title || "Riverside Terrace", {
    body: data.body || "You have a new booking update.",
    icon: "/favicon.jpg",
    badge: "/favicon.jpg",
    tag: data.tag || "rtr-booking",
    data: { url: data.url || "/admin-panel/booking" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/admin-panel/booking", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => client.url.startsWith(self.location.origin));
    if (existing) return existing.navigate(targetUrl).then(() => existing.focus());
    return self.clients.openWindow(targetUrl);
  }));
});
