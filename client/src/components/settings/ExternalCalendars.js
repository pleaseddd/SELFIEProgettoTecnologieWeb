import { useState, useEffect } from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { toast } from 'react-toastify';

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

const GoogleProfile = ({ user }) => {
	return (
		<div className="d-flex align-items-center mb-2 border border-1 rounded-pill px-2 py-1">
			<Image
				src={user.google.propic}
				className="me-1"
				roundedCircle
				width={22}
				height={22}
				referrerPolicy="no-referrer"
			/>
			<h6 className="mb-0">{user.google?.gmail?.address}</h6>
		</div>
	);
};

const GoogleCalendarUsed = ({ user, updateUser }) => {
	const [calslist, setCalslist] = useState([]);
	const [selCal, setSelCal] = useState("");

	useEffect(() => {
		const load = async () => {
			let data = await fetch('/api/google/getcalendars', {
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
			else {
				data = data.filter(cal => cal.accessRole == "owner");
				if(!user.google.hasOwnProperty("calendarId"))
					data.unshift({id: "nocal", summary: ""});
				setCalslist(data);
			}

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
		toast('Calendario google impostato con successo!', { type: 'success' });
		updateUser(update);
	};

	return (
		<div className="d-flex flex-column flex-md-row flex-grow-1 mb-2">
			<Form.Label className="mt-2 me-md-2 mb-1 mb-md-0 text-nowrap">
				Salvo gli eventi in
			</Form.Label>

			<div className="d-flex flex-grow-1">
				<Form.Select
					aria-label="default select"
					className="flex-grow-1"
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
						<div className="d-flex flex-column flex-md-row justify-content-start align-items-center column-gap-3 flex-wrap">
							<GoogleProfile user={user} />
							<GoogleCalendarUsed
								user={user}
								updateUser={updateUser}
							/>
						</div>

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
