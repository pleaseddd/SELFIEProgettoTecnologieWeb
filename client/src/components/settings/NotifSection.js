import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import SwSubSwitch from "./switch-swsub.js";
import { useDevice } from "../../hooks/swsubsHooks.js";

const NotifSection = ({ user }) => {

	const { device, setDevice } = useDevice();

	const [newName, setNewName] = useState(device?.name);
	useEffect(() => {
		if(device?.name)
			setNewName(device.name);
	}, [device?.name]);

	const handleChangeName = async () => {
		if(!newName.trim())
			return;

		console.log();

		const update = await fetch("/updateswsubname", {
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
		<Card className="mb-4 shadow-sm">
			<Card.Body>

				{/* Titolo della card */}
				<div className="d-flex align-items-center mb-4">
					<h5>Gestione notifiche</h5>
				</div>

				<SwSubSwitch label="Consenso per le notifiche" user={user} deviceName={device?.name} />

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
			</Card.Body>
		</Card>
	);
};

export default NotifSection;
