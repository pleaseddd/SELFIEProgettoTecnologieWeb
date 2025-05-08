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
						setDevice(generateFinalDeviceName());
						return;
					}

					fetch('/getswsub', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ endpoint: sub.endpoint })
					})
					.then(resp => resp.json())
					.then(data => setDevice(data.name));
				});
			});
		};
		getDevice();
	}, []);

	return device;
};

export const useAlldevices = (user, deviceName) => {
	const [alldevices, setAlldevices] = useState([]);

	useEffect(() => {
		async function getAlldevices() {
			const devices = await fetch("/listsubs", {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ user_id: user._id }),
			})
			.then(resp => resp.json());

			const devicesNames = devices.map(dev => dev.name);
			const devIndex = devicesNames.indexOf(deviceName);
			if(devIndex > -1)
				devicesNames.splice(devIndex, 1);

			setAlldevices(devicesNames);
		}
		getAlldevices();
	}, [alldevices]);

	return alldevices;
};
