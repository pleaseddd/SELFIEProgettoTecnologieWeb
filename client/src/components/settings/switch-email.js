import React, { Component } from "react";
import Switch from 'react-switch';

class EmailNotifSwitch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			checked: props.user.google.gmail.notifs || false,
			showError: false
		};

		this.handleChange = this.handleChange.bind(this);
	}

	async handleChange(checked) {
		if(!this.props.user.google.isLogged) {
			this.setState(({ showError: true}));
			return;
		}

		this.setState({ checked });

		const data = await fetch('/api/google/setemailconsent', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				user_id: this.props.user._id,
				consent: checked
			})
		}).then(resp => resp.json());
		this.props.updateUser(data);
	}

	render() {
		return (
			<div>
				{
					this.state.showError && (
						<span
							className="fs-6"
							style={{
								color: 'red'
							}}
						>
							Prima fai login a google
						</span>
					)
				}
				<label className="d-flex align-items-center justify-content-between">
					<span className="fs-6">{this.props.label}</span>
					<Switch onChange={this.handleChange} checked={this.state.checked}/>
				</label>
			</div>
		);
	}
}

export default EmailNotifSwitch;
