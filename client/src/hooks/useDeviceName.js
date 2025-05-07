import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import generateDeviceName from '../utils/deviceNamer.js';

const useDeviceName = () => {
	const [deviceName, setDeviceName] = useState('Il mio dispositivo');

	useEffect(() => {
		const load = async () => {
			try {
				const name = generateDeviceName();
				const deviceId = generateDeviceId();
				const existing = JSON.parse(localStorage.getItem('devices') || '[]');
				const existringDevice = existing.find(dev => dev.id === deviceId);

				if(existringDevice) {
					setDeviceName(existringDevice.name);
					return;
				}

				const sameBaseCount = existing.filter(
					dev => dev.name.startsWith(name.split('#')[0])
				).length;

				const finalName = sameBaseCount > 0
					? `${name} #${sameBaseCount+1}` : name;

				localStorage.setItem(
					'devices',
					JSON.stringify([...existing, {
						id: deviceId,
						name: finalName,
						date: new Date()
					}])
				);

				setDeviceName(finalName);
			}
			catch(err) {
				console.error("Error generating device name:", err);
			}
		};

		load();
	});

	return deviceName;
};

const generateDeviceId = () => {
	const parser = new UAParser();
	const { os, browser, device } = parser.getResult();

	return btoa(
		`${device.model}-${os.name}-${browser.name}`
		+ `${window.screen.width}-${window.screen.height}`
		+ `${navigator.hardwareConcurrency}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`
	).substring(0, 32);
};

export default useDeviceName;
