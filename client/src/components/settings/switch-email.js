import React, { Component } from "react";
import Switch from 'react-switch';

class EmailNotifSwitch extends Component {
	constructor(props) {
		super(props);

		this.state = { checked: false };

		this.handleChange = this.handleChange.bind(this);
	}

	async handleChange(checked) {
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

		console.log(this.props.user);
	}

	render() {
		return (
			<label className="d-flex align-items-center justify-content-between">
				<span className="fs-6">{this.props.label}</span>
				<Switch onChange={this.handleChange} checked={this.state.checked}/>
			</label>
		);
	}
}

export default EmailNotifSwitch;
