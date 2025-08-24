import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";

import SwSubSwitch from "./switch-swsub.js";
import EmailNotifSwitch from "./switch-email.js";

import { useDevice } from "../../hooks/swsubsHooks.js";

import '../../style/settings/Settings.css';

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
		<fieldset className="fieldset-custom mb-2">
			<legend className="legend-custom">
				Notifiche browser
			</legend>

			<div className="mb-2">
				<SwSubSwitch label="Notifiche push" user={user} deviceName={device?.name} />
			</div>

			<div className="d-flex flex-column flex-md-row mb-2">
				<Form.Label className="me-md-2 mt-2 mb-0 text-nowrap">
					Nome dispositivo:
				</Form.Label>

				<div className="d-flex flex-grow-1">
					<Form.Control
						type="text"
						className="underline-input"
						value={newName}
						placeholder="Inserisci il nome"
						onChange={e => setNewName(e.target.value)}
					/>
					<Button
						variant="success"
						className="ms-2 mt-2 mt-md-0"
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
				<div className="section-title">
					<h5>Gestione notifiche</h5>
				</div>

				<BrowserNotif user={user} />

				<fieldset className="fieldset-custom">
					<legend className="legend-custom">
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
