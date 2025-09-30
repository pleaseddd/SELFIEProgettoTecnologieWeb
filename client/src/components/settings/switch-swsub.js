import React, { Component } from "react";
import Switch from 'react-switch';

//Lo switch usato nelle impostazioni per dare il consenso delle notifiche push
class SwSubSwitch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			checked: false,
			initialized: false
		};

		if('serviceWorker' in navigator) {
			navigator.serviceWorker.ready.then(registration => {
				registration.pushManager.getSubscription().then(sub => {
					this.setState({
						checked: !!sub,
						initialized: true
					});
				});
			});
		}

		this.handleChange = this.handleChange.bind(this);
	}

	async handleChange(checked) {
		this.setState({ checked });

		if(!('serviceWorker' in navigator)) {
			console.log("Nessun service worker presente");
			return;
		}

		if(checked)
			await this.handleSubscribe();
		else
			await this.handleUnubscribe();
	}
	
	//Per dare il consenso
	async handleSubscribe() {
		//Controllo se le notifiche push sono supportate dal browser
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
					//Memorizzo l'iscrizione nel db
					fetch('/api/swsub/subscribe', {
						method: 'POST',
						body: JSON.stringify({
							user_id: this.props.user._id,
							name: this.props.deviceName,
							sub,
						}),
						headers: { 'content-type': 'application/json' }
					})
					.then(x => x.json())
					.then(data => console.log(data.message || data.error));
				});
			});
		}
	}
	
  //Per negare il consenso
	async handleUnubscribe() {
		navigator.serviceWorker.ready.then(registration => {
			registration.pushManager.getSubscription().then(sub => {
				//Controllo che l'iscrizione sia esistente
				if(!sub) {
					console.log("Nessuna iscrizione trovata");
					return;
				}
				
				//Elimino i dalti dal db
				fetch('/api/swsub/unsubscribe', {		
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

	render() {
		if(!this.state.initialized)
			return <div>Loading...</div>;

		return (
			<label className="d-flex align-items-center justify-content-between">
				<span className="fs-6 text-nowrap">{this.props.label}</span>
				<Switch onChange={this.handleChange} checked={this.state.checked}/>
			</label>
		);
	}
}

export default SwSubSwitch;
