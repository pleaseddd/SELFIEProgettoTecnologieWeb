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
		<fieldset className="p-2 mb-1 border border-2 border-gray-400 rounded">
			<legend className="float-none w-auto px-1 text-body-secondary fs-6">
				Notifiche browser
			</legend>

			<div className="pb-1 mb-2 border-bottom border-gray-400">
				<SwSubSwitch label="Consenso per le notifiche push" user={user} deviceName={device?.name} />
			</div>

			<div>
				<Form.Label className="mb-1">
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
			</div>
		</fieldset>
	);
};

const NotifSection = ({ user, updateUser }) => {
	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				{/* Titolo della card */}
				<div className="d-flex align-items-center mb-4 border-bottom border-gray-500">
					<h5>Gestione notifiche</h5>
				</div>

				<BrowserNotif user={user} />

				<fieldset className="p-2 border border-2 border-gray-400 rounded">
					<legend className="float-none w-auto px-1 text-body-secondary fs-6">
						Notifiche via email
					</legend>
					<EmailNotifSwitch
						label="Notifiche tramite gmail"
						user={user}
						updateUser={updateUser}
					/>
				</fieldset>
			</Card.Body>
		</Card>
	);
};

export default NotifSection;
