import { UAParser } from 'ua-parser-js';

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

export default generateDeviceName;
