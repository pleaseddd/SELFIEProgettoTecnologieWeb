self.addEventListener('install', event => {
	console.log('service worker installato');
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("push", event => {
	const data = event.data.json();

	self.registration.showNotification(data.title, {
		body: data.body,
		title: data.title
	});
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    clients.openWindow("/")
});

self.addEventListener("activate", () => {
	// const tabs = await self.clients.matchAll({ type: 'window' });
	// tabs.forEach(tab => tab.navigate(tab.url));
	console.log('service worker attivato');
});

// self.addEventListener('fetch', event => {
// 	event.respondWith(fetch(event.request));
// });
