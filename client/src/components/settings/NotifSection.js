import React, { useState, useEffect } from "react";
import SwSubSwitch from "./switch-swsub.js";
import useDeviceName from "../../hooks/useDeviceName.js";

const NotifSection = ({ user }) => {
	const [device, setDevice] = useState("");
	const [alldevices, setAlldevices] = useState([]);
	const deviceName = useDeviceName();

	useEffect(() => {
		const getDevice = async () => {
			if(!('serviceWorker' in navigator)) {
				console.log("Nessun service worker manager");
				return;
			}

			try {
				navigator.serviceWorker.ready.then(registration => {
					registration.pushManager.getSubscription().then(sub => {
						if(!sub) {
							setDevice("Nessuna iscrizione");
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
			}
			catch(error) {
				console.log("Erroe:", error);
			}
		};
		getDevice();
	});

	useEffect(() => {
		async function getAlldevices() {
			const devices = await fetch("/listsubs", {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ user_id: user._id }),
			}).then(resp => resp.json());
			setAlldevices(devices);
		}
		getAlldevices();
	});

	const handleTestNotification = async () => {
		if(!('serviceWorker' in navigator)) {
			console.log("Nessun service worker manager");
			return;
		}

		const resp = await fetch('/test-notification', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ user_id: user._id })
		}).then(resp => resp.json())
		  .catch(err => console.error(err));
		console.log(resp.message);
	};

	return (
		<div style={{ border: "2px solid #000 p-3" }}>
			<SwSubSwitch deviceName={deviceName} user={user}/>
			<button type="button" className="btn btn-primary" onClick={handleTestNotification}>Manda notifica prova</button>

			<label>Dispositivi iscritti alle notifiche</label>
			<div
				style={{
					maxHeight: "120px",
					overflowY: "auto",
					border: "1px solid #ccc",
					borderRadius: "5px",
					padding: "0.5rem",
				}}
			>
			{alldevices.length > 0 ? (
				alldevices.map((device, i) => (
					<div key={i} className="d-flex justify-content-between mb-1">
						<span>{device.name}</span>
					</div>
				))
			) : (<p>Nessun altro dispositivo iscritto</p>)}
			</div>
		</div>
	);
};

export default NotifSection;
