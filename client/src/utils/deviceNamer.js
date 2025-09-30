import { UAParser } from 'ua-parser-js';

/*
 * funzioni usate per la creazione di un nome predefinito di un dispositivo
 * vengono estratte le informazioni sul sistema operativo e sul browser
 * che si sta utilizzando, e poi vengono combinate
 * in caso di più dispositivi con le stesse informazioni viene posto
 * un numero incrementale
 */

export const generateFinalDeviceName = () => {
	const name = generateDeviceName();
	const deviceId = generateDeviceId();
	const existing = JSON.parse(localStorage.getItem('devices') || '[]');
	const existingDevice = existing.find(dev => dev.id === deviceId);

	if(existingDevice)
		return existingDevice.name;

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

	return finalName;
};

const generateDeviceName = () => {
	const parser = new UAParser();
	const { os, browser, device } = parser.getResult();
	//const resolution = `${screen.width}x${screen.height}`;

	const cleanBrowser = browser.name
		.replace('Mobile', '')
		.replace(/[0-9]/g, '')
		.trim();

	const appleModel = /iPhone|iPad|iPod/.test(device.model)
		? device.model.replace('Pro', '').replace(/\d+/g, '') : '';

	return [
		appleModel,
		os.name,
		//window.mobileCheck() ? 'Mobile' : 'Device',
		`${cleanBrowser}`
	]
	.filter(Boolean)
	.join(' ');
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
