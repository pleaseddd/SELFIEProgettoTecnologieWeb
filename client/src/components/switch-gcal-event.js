import React, { Component } from "react";
import Switch from 'react-switch';

class GcalEventSwitch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			checked: this.props.saveOnGoogle,
			showError: ''
		};

		this.handleChange = this.handleChange.bind(this);
	}

	async handleChange(checked) {
		if(!this.props.user.google.hasOwnProperty("calendarId")) {
			this.setState({ showError: "nocal" });
			return;
		}

		this.props.setSaveOnGoogle(!this.props.saveOnGoogle);
		this.setState({ checked });
	}

	render() {
		return (
			<div>
				{
					this.state.showError == "nocal" && (
						<span className="fs-6 text-danger">
							Scegli il calendario google in cui salvare gli eventi nelle impostazioni
						</span>
					)
				}
				{
					this.state.showError == "editing" && (
						<span className="fs-6 text-warning">
							Deselezionando questo pulsante l'evento su google Calendar verrà cancellato
						</span>
					)
				}
				<label className="d-flex align-items-center justify-content-between">
					<Switch
						id="googlecal"
						className="me-2"
						onChange={this.handleChange}
						checked={this.props.saveOnGoogle}
						onColor="#3788d8"
						offColor="#ccc"
						uncheckedIcon={false}
						checkedIcon={false}
					/>
					<span className="fs-6">{this.props.label}</span>
				</label>
			</div>
		);
	}
}

export default GcalEventSwitch;
