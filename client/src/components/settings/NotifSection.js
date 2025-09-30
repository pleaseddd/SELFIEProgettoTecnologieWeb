//Moduli esterni
import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { toast } from 'react-toastify';

//Moduli interni
import SwSubSwitch from "./switch-swsub.js";

import { useDevice } from "../../hooks/swsubsHooks.js";

import '../../style/settings/Settings.css';

const BrowserNotif = ({ user }) => {
	/*
   * Genero automaticamente un nome per il dispositivo
	 * che si potrà modificare
	 */
	const { device, setDevice } = useDevice();

	const [newName, setNewName] = useState(device?.name);
	useEffect(() => {
		if(device?.name)
			setNewName(device.name);
	}, [device?.name]);

	const handleChangeName = async () => {
		if(!newName?.trim())
			return;
		
		//Aggiorno il db con il nuovo nome
		const update = await fetch("/api/swsub/updatename", {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				endpoint: device.endpoint,
				name: newName
			})
		}).then(resp => resp.json());
		console.log(update.message);

		//Feedback visivo
		toast('Nome del dispositivo cambiato con successo!', { type: 'success' });

		setDevice(prev => ({...prev, name: newName}));
	};

	return (
		<div>
			<div className="mb-2">
				<SwSubSwitch label="Notifiche push" user={user} deviceName={device?.name} />
			</div>

			<div className="d-flex flex-column flex-md-row mb-2">
				<Form.Label className="me-md-2 mt-2 mb-1 mb-md-0 text-nowrap">
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
		</div>
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
			</Card.Body>
		</Card>
	);
};

export default NotifSection;
