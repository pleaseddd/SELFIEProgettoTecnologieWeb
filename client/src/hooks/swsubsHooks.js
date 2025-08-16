import { useEffect, useState } from 'react';
import { generateFinalDeviceName } from '../utils/deviceNamer.js';

export const useDevice = () => {
	const [device, setDevice] = useState(null);

	useEffect(() => {
		const getDevice = async () => {
			if(!('serviceWorker' in navigator)) {
				console.log("Nessun service worker manager");
				return;
			}

			navigator.serviceWorker.ready.then(registration => {
				registration.pushManager.getSubscription().then(sub => {
					if(!sub) {
						setDevice({ name: generateFinalDeviceName() });
						return;
					}

					fetch('/api/swsub/get', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ endpoint: sub.endpoint })
					})
					.then(resp => resp.json())
					.then(data => setDevice(data));
				});
			});
		};
		getDevice();
	}, []);

	return { device, setDevice };
};
