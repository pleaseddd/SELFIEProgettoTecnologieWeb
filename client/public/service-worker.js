self.addEventListener('install', event => {
	console.log('service worker installato');
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("push", event => {
	const data = event.data.json();

	self.registration.showNotification(data.title, {
		body: data.body,
		title: data.title,
		actions: [
			{ action: "5 snooze", title: "5min snooze" },
			{ action: "10 snooze", title: "10min snooze" },
			{ action: "15 snooze", title: "15min snooze" }
		],
		data
	});
});

self.addEventListener("notificationclick", async (event) => {
    event.notification.close();

	const [time, action] = event.action.split(' ');
	if(action == "snooze") {
		await fetch('/api/notifs/snooze', {
			method: "POST",
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ snooze: time, ...event.notification.data })
		});
		self.registration.showNotification("snooze", {
			body: "Riceverai una notifica tra " + time + " minuti!",
			title: "Snooze applicato con successo!"
		});
	}
	else
		clients.openWindow("/");
});

self.addEventListener("activate", () => {
	// const tabs = await self.clients.matchAll({ type: 'window' });
	// tabs.forEach(tab => tab.navigate(tab.url));
	console.log('service worker attivato');
});
