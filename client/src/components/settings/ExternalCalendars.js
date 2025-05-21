import { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import GoogleButton from 'react-google-button';

const GoogleAuth = ({ user, updateUser }) => {
	useEffect(async () => {
		const urlParams = new URLSearchParams(window.location.search);

		if(urlParams.get('auth-success') == 'true') {
			const data = await fetch('/updateUser', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ user_id: user._id })
			}).then(resp => resp.json())
			updateUser(data);
		}

	}, []);

	const handleLogout = async () => {
		const resp = await fetch('/google/logout', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ user_id: user._id })
		}).then(resp => resp.json());
		updateUser(resp);
	};

	return (
		<div>
		{
			user.google.isLogged ?
			(<button className="btn btn-danger" onClick={handleLogout}>
				Google - Logout
			</button>)
			:
			(<GoogleButton
				onClick={() => window.location = `/auth/google?email=${user.email}`}
			/>)
		}
		</div>
	);
};

const GoogleCalendarUsed = ({ user }) => {
	const [calslist, setCalslist] = useState([]);

	useEffect(() => {
		const load = async () => {
			const data = await fetch('/google/getcalendars', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ googleTokens: user.google.tokens })
			}).then(resp => resp.json());
			setCalslist(data);
		}
		load();
	}, []);

	return (
		<div>
			<Form.Label className="my-2">
				Gli eventi saranno salvati in
			</Form.Label>
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
				calslist.map(cal => (
					<div key={cal.id}>
						<Form.Check
							type="radio"
							name="cals"
							label={cal.summary}
						/>
					</div>
				))
			}
			</div>
		</div>
	);
};

const ExternalCalsSection = ({ user, updateUser }) => {
	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="d-flex align-items-center mb-4">
					<h5>Calendari esterni</h5>
				</div>

				<GoogleAuth user={user} updateUser={updateUser} />
				<GoogleCalendarUsed user={user} />
			</Card.Body>
		</Card>
	);
};

export default ExternalCalsSection;
