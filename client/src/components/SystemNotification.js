import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SystemNotification = ({ user }) => {

	const urlBase64ToUint8Array = (base64String) => {
		const padding = '='.repeat((4 - base64String.length%4) % 4);
		const base64 = (base64String + padding)
			.replace(/\-/g, '+')
			.replace(/_/g, '/');

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for(let i=0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}

		return outputArray;
	};

	const handleSubscribe = async () => {
		if(!('serviceWorker' in navigator)) {
			console.log("Nessun service worker presente");
			return;
		}

		const registration = await navigator.serviceWorker.ready;

		if(!('Notification' in window)) {
			console.log("Questo browser non supporta le notifiche");
			return;
		}

		const permission = await Notification.requestPermission();

		if(permission === "granted") {
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: process.env.REACT_APP_VPKEY_PUBLIC
			});

			const subname = document.getElementById("subname").value;

			const resp = await fetch('/subscribe', {
				method: 'POST',
				body: JSON.stringify({
					user_id: user._id,
					name: subname,
					sub: subscription,
				}),
				headers: { 'content-type': 'application/json' }
			}).then(resp => resp.json());

			console.log(resp.message || resp.error);
		}
	};

	const handleUnsubscribe = async () => {
		if(!('serviceWorker' in navigator)) return;

		const registration = await navigator.serviceWorker.ready;

		let endpoint;
		await registration.pushManager.getSubscription().then(sub => {
			if(!sub) {
				alert("Non sei ancora iscritto!");
				return;
			}

			endpoint = sub.endpoint;
			sub.unsubscribe();
		});

		const resp = await fetch('/unsubscribe', {
			method: 'POST',
			body: JSON.stringify({ endpoint }),
			headers: { 'content-type': 'application/json' }
		}).then(resp => resp.json());

		console.log(resp.message);
	};

	const handleTestNotification = async () => {
		if(!("serviceWorker" in navigator)) return;

		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();

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
			time: document.getElementById("time").value
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

	if('serviceWorker' in navigator) {
		try {
			navigator.serviceWorker.register('./service-worker.js', { scope: '/' });
			console.log("service worker registrato!");
		}
		catch(error) {
			console.error(error);
		}
	}

    return (
        <div className="container-fluid border border-2 border-dark rounded p-4 mx-3 mx-sm-5 my-4">
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
