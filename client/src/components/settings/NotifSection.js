import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";

import SwSubSwitch from "./switch-swsub.js";
import EmailNotifSwitch from "./switch-email.js";

import { useDevice } from "../../hooks/swsubsHooks.js";

const BrowserNotif = ({ user }) => {

	const { device, setDevice } = useDevice();

	const [newName, setNewName] = useState(device?.name);
	useEffect(() => {
		if(device?.name)
			setNewName(device.name);
	}, [device?.name]);

	const handleChangeName = async () => {
		if(!newName?.trim())
			return;

		const update = await fetch("/api/swsub/updatename", {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				endpoint: device.endpoint,
				name: newName
			})
		}).then(resp => resp.json());
		console.log(update.message);

		setDevice(prev => ({...prev, name: newName}));
	};

	return (
		<div>
			<SwSubSwitch label="Consenso per le notifiche push" user={user} deviceName={device?.name} />

			<Form.Group className="mb-3 py-2">
				<Form.Label className="mb-2">
					Nome del dispositivo
				</Form.Label>
				<div className="d-flex mb-2">
					<Form.Control
						type="text"
						value={newName}
						placeholder="Inserisci il nome"
						onChange={e => setNewName(e.target.value)}
					/>
					<Button
						variant="success"
						className="ms-2"
						onClick={handleChangeName}
					>
						Cambia
					</Button>
				</div>
			</Form.Group>
		</div>
	);
};

const EmailNotif = ({ user, updateUser }) => {
	return (
		<div>
			<Form.Group>
				<EmailNotifSwitch
					label="Desidero ricevere notifiche tramite la mia email google"
					user={user}
					updateUser={updateUser}
				/>
			</Form.Group>
		</div>
	);
};

const NotifSection = ({ user, updateUser }) => {
	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				{/* Titolo della card */}
				<div className="d-flex align-items-center mb-4">
					<h5>Gestione notifiche</h5>
				</div>

				<BrowserNotif user={user} />
				<EmailNotif user={user} updateUser={updateUser} />
			</Card.Body>
		</Card>
	);
};

export default NotifSection;
