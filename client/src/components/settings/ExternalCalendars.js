import { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';

import '../../style/settings/Settings.css';

const GoogleAuth = ({ user }) => {
	return (
		<div>
			<GoogleButton
				onClick={() => window.location = `/auth/google?email=${user.email}`}
			/>
		</div>
	);
};

const GoogleCalendarUsed = ({ user, updateUser }) => {
	const [calslist, setCalslist] = useState([]);
	const [selCal, setSelCal] = useState("");

	useEffect(() => {
		const load = async () => {
			const data = await fetch('/api/google/getcalendars', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ googleTokens: user.google.tokens })
			}).then(resp => resp.json());
			if(data.hasOwnProperty('message')) {
				const logout = await fetch('/api/google/logout', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ user_id: user._id })
				}).then(resp => resp.json());
				updateUser(logout);
			}
			else
				setCalslist(data);
		}
		load();
	}, []);

	const handleChangeCal = async () =>  {
		const update = await fetch("/api/google/setcal", {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				userid: user._id,
				calid: selCal
			})
		}).then(resp => resp.json());
		updateUser(update);
	};

	return (
		<div className="d-flex flex-column flex-md-row mb-2">
			<Form.Label className="me-md-2 mt-md-2 mb-0 text-nowrap">
				Salvo gli eventi in
			</Form.Label>

			<div className="d-flex flex-grow-1">
				<Form.Select
					aria-label="default select"
					className="underline-input"
					onChange={e => setSelCal(e.target.value)}
				>
				{
					calslist.map(cal => (
						<div key={cal.id}>
							{
							cal.id == user.google.calendarId ?
							(<option value={cal.id} selected="selected">
								{cal.summary}
							</option>)
							:
							(<option value={cal.id}>
								{cal.summary}
							</option>)
							}
						</div>
					))
				}
				</Form.Select>
				<Button
					variant="success"
					className="ms-2 mt-2 mt-md-0"
					onClick={handleChangeCal}
				>
					Imposta
				</Button>
			</div>
		</div>
	);
};

const ExternalCalsSection = ({ user, updateUser }) => {
	const [googleLogin, setGoogleLogin] = useState(user.google.isLogged);

	useEffect(() => {
		setGoogleLogin(user.google.isLogged);
	}, [user.google.isLogged]);

	const handleLogout = async () => {
		const resp = await fetch('/api/google/logout', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ user_id: user._id })
		}).then(resp => resp.json());
		updateUser(resp);
	};

	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="section-title">
					<h5>Calendari esterni</h5>
				</div>

				<fieldset className="fieldset-custom">
					<legend className="legend-custom">
						Google calendar
					</legend>
				{
					googleLogin ?
					(<div>
						<GoogleCalendarUsed user={user} updateUser={updateUser} />

						<Button
							variant="outline-danger"
							className="mt-3"
							onClick={handleLogout}
						>
							Google - Logout
						</Button>
					</div>)
					:
					(<GoogleAuth user={user} />)
				}
				</fieldset>
			</Card.Body>
		</Card>
	);
};

export default ExternalCalsSection;
