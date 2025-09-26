self.addEventListener('install', event => {
	console.log('service worker installato');
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("push", event => {
	const data = event.data.json();

	self.registration.showNotification(data.title, {
		body: data.body,
		title: data.title,
		actions: [{ action: "snooze", title: "fai snooze" }]
	});
});

self.addEventListener("notificationclick", async (event) => {
    event.notification.close();
	if(event.action == "snooze")
		await fetch('/api/notifs/snooze', {
			method: "POST",
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ })
		});
	else
		clients.openWindow("/");
});

self.addEventListener("activate", () => {
	// const tabs = await self.clients.matchAll({ type: 'window' });
	// tabs.forEach(tab => tab.navigate(tab.url));
	console.log('service worker attivato');
});
