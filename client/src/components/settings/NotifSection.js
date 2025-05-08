import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import SwSubSwitch from "./switch-swsub.js";
import { useDevice, useAlldevices } from "../../hooks/swsubsHooks.js";

const NotifSection = ({ user }) => {

	const device = useDevice();
	const devices = useAlldevices(user, device);

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
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="d-flex align-items-center mb-4">
					<h5>
						Gestione notifiche
					</h5>
				</div>

				<SwSubSwitch label="Consenso per le notifiche" user={user} deviceName={device}/>

				<Form.Group className="mb-3 py-2">
					<Form.Label className="mb-2">
						Nome del dispositivo
					</Form.Label>
					<div className="d-flex mb-2">
						<Form.Control
							type="text"
							value={device}
							placeholder="Inserisci il nome"
						/>
						<Button
							variant="success"
							className="ms-2"
						>
							Cambia
						</Button>
					</div>
				</Form.Group>


				{/*<Button
					variant="primary"
					onClick={handleTestNotification}
				>
					Manda notifica prova
				</Button>*/}

				<h6>
					Dispositivi iscritti alle notifiche
				</h6>

				<div
					style={{
						maxHeight: "120px",
						overflowY: "auto",
						border: "1px solid #ccc",
						borderRadius: "5px",
						padding: "0.5rem",
					}}
				>
					{
						devices.length > 0 ?
						(
							devices.map((device, i) => (
								<div
									key={i}
									className="d-flex justify-content-between mb-1"
								>
									<span>{device}</span>
								</div>
							))
						)
						: ( <p>Nessun altro dispositivo iscritto</p> )
					}
				</div>
			</Card.Body>
		</Card>
	);
};

export default NotifSection;
