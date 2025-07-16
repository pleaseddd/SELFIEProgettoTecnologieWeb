import { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import SaveButton from './SaveButton';

const GoogleAuth = ({ user, updateUser }) => {
	useEffect(async () => {
		const urlParams = new URLSearchParams(window.location.search);

		if(urlParams.get('auth-success') == 'true') {
			console.log(user.google);
			// const data = await fetch('/api/user/update', {
			// 	method: 'POST',
			// 	headers: { 'content-type': 'application/json' },
			// 	body: JSON.stringify({ user_id: user._id })
			// }).then(resp => resp.json());
			// updateUser(data);
		}
	}, []);

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
		<div>
			<Form.Label className="my-2">
				Gli eventi saranno salvati in
			</Form.Label>
			<Form.Select
				aria-label="default select"
				onChange={e => setSelCal(e.target.value)}
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
						<option value={cal.id}>
							{cal.summary}
						</option>
					</div>
				))
			}
			</Form.Select>
			<Button
				variant="success"
				className="py-2 ms-2"
				onClick={handleChangeCal}
			>
				Imposta
			</Button>
		</div>
	);
};

const ExternalCalsSection = ({ user, updateUser }) => {
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
				<div className="d-flex align-items-center mb-4">
					<h5>Calendari esterni</h5>
				</div>

				{
					user?.google?.isLogged ?
					(<div>
						<button className="btn btn-danger" onClick={handleLogout}>
							Google - Logout
						</button>
						<GoogleCalendarUsed user={user} updateUser={updateUser} />
					</div>)
					:
					(<GoogleAuth user={user} updateUser={updateUser} />)
				}
			</Card.Body>
		</Card>
	);
};

export default ExternalCalsSection;
