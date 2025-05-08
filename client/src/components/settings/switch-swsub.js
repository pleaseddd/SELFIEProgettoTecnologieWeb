import React, { Component } from "react";
import Switch from "react-switch";

class SwSubSwitch extends Component {
	constructor(props) {
		super(props);

		let checked = false;

		if('serviceWorker' in navigator) {
			navigator.serviceWorker.ready.then(registration => {
				registration.pushManager.getSubscription().then(sub => {
					checked = sub ? true : false;
				});
			});
		}

		this.state = { checked: [checked] };

		this.handleChange = this.handleChange.bind(this);
	}

	async handleChange(checked) {
		this.setState({ checked });
		if(checked)
			await this.handleSubscribe();
		else
			await this.handleUnubscribe();
	}

	async handleSubscribe() {
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
					fetch('/subscribe', {
						method: 'POST',
						body: JSON.stringify({
							user_id: this.props.user._id,
							name: this.props.deviceName,
							sub: sub,
						}),
						headers: { 'content-type': 'application/json' }
					})
					.then(x => x.json())
					.then(data => console.log(data.message || data.error));
				});
			});
		}
	}

	async handleUnubscribe() {
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
			console.log("Errore nell'iscrizione:", error);
		}
	}

	render() {
		return (
			<label className="d-flex align-items-center justify-content-between">
				<span className="fs-6 text-nowrap">{this.props.label}</span>
				<Switch onChange={this.handleChange} checked={this.state.checked}/>
			</label>
		);
	}
}

export default SwSubSwitch;
