import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SystemNotification = ({ user }) => {
	const [device, setDevice] = useState(null);

	useEffect(() => {
		const getDevice = async() => {
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

	const handleSubscribe = async () => {
		if(!('serviceWorker' in navigator)) {
			console.log("Nessun service worker presente");
			return;
		}

		if(!('Notification' in window)) {
			console.log("Questo browser non supporta le notifiche");
			return;
		}

		const permission = await Notification.requestPermission();

		if(permission === "granted") {
			navigator.serviceWorker.ready.then(registration => {

				registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: process.env.REACT_APP_VPKEY_PUBLIC
				}).then(sub => {
					const subname = document.getElementById("subname").value;
					fetch('/subscribe', {
						method: 'POST',
						body: JSON.stringify({
							user_id: user._id,
							name: subname,
							sub: sub,
						}),
						headers: { 'content-type': 'application/json' }
					})
					.then(x => x.json())
					.then(data => console.log(data.message || data.error));
				});
			});
		}
	};

	const handleUnsubscribe = async () => {
		if(!('serviceWorker' in navigator)) {
			console.log("Nessun service worker manager");
			return;
		}

		try {
			navigator.serviceWorker.ready.then(registration => {
				registration.pushManager.getSubscription().then(sub => {
					if(!sub) {
						console.log("Nessuna iscrizione trovata");
						return;
					}

					fetch('/unsubscribe', {
						method: 'POST',
						body: JSON.stringify({ endpoint: sub.endpoint }),
						headers: { 'content-type': 'application/json' }
					})
					.then(resp => resp.json())
					.then(data => console.log(data.message));

					sub.unsubscribe();
				});
			});
		}
		catch(error) {
			console.log("Errore nell'iscriziione:", error);
		}
	};

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

	const handleScheduleNotification = async () => {
		const data = {
			title: document.getElementById("title").value,
			body: document.getElementById("text").value,
			time: new Date(document.getElementById("time").value)
		};

		const resp = await fetch('/schedule-notification', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				user_id: user._id,
				data: data
			})
		}).then(resp => resp.json());
		console.log(resp.message);
	};

    return (
        <div className="container-fluid border border-2 border-dark rounded p-4 mx-3 mx-sm-5 my-4">
	        <h1 id="device">sei su: {device}</h1>
	        <input type="text" id="subname" />
	        <button type="button" className="btn btn-light" onClick={handleSubscribe}>Subscribe</button>
	        <button type="button" className="btn btn-dark" onClick={handleUnsubscribe}>Unsubscribe</button>
	        <button type="button" className="btn btn-primary" onClick={handleTestNotification}>Manda notifica prova</button>

            <h2 className="text-center mb-4">Programma una notifica</h2>

            <form className="notif-form">
                <div className="form-group mb-4 p-3">
                    <label htmlFor="title" className="form-label">Titolo</label>
                    <input type="text" className="form-control" id="title" name="title"/>
                </div>

                <div className="form-group mb-4 p-3">
                    <label htmlFor="text" className="form-label">Testo</label>
                    <textarea className="form-control" name="text" id="text" rows="3"></textarea>
                </div>

                <div className="form-group mb-4 p-3">
                    <label htmlFor="time" className="form-label">Tempo</label>
                    <input type="datetime-local" className="form-control" name="time" id="time"/>
                </div>

                <div className="d-grid gap-2 col-12 col-md-6 col-lg-4 mx-auto mt-4">
                    <input type="submit" className="btn btn-primary" value="Programma" onClick={handleScheduleNotification}/>
                </div>
            </form>
        </div>
    );
};

export default SystemNotification;
