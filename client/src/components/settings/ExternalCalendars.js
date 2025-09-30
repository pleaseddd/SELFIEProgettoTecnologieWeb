import { useState, useEffect } from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { toast } from 'react-toastify';

import '../../style/settings/Settings.css';

//Il pulsante che porta alla schermata di login di google  
const GoogleAuth = ({ user }) => {
	return (
		<div>
			<GoogleButton
				onClick={() => window.location = `/auth/google?email=${user.email}`}
			/>
		</div>
	);
};

//Una volta fatto il login, vengono mostrati foto profilo e indirizzo email
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
			<p className="mb-0">{user.google?.gmail?.address}</p>
		</div>
	);
};

//Selezione del calendario google in cui salvare gli eventi
const GoogleCalendarUsed = ({ user, updateUser }) => {
	const [calslist, setCalslist] = useState([]);
	const [selCal, setSelCal] = useState("");

	useEffect(() => {
		//Estraggo i calendari esistenti dell'account google
		const load = async () => {
			let data = await fetch('/api/google/getcalendars', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ googleTokens: user.google.tokens })
			}).then(resp => resp.json());
			
			/*
			 * Se risulta un messaggio di errore viene fatto il logout
			 * succede quando, per esempio, i token di accesso sono scaduti
			 */
			if(data.hasOwnProperty('message')) {
				const logout = await fetch('/api/google/logout', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ user_id: user._id })
				}).then(resp => resp.json());
				updateUser(logout);
				return;
			}
		
			//Seleziono solo i calendari su cui posso scrivere	
			data = data.filter(cal => cal.accessRole == "owner");

			/*
			 * Nel caso in cui l'utente non abbia ancora scelto
       * il calendario, ne viene mostrato uno vuoto fittizio
			 */
			if(!user.google.hasOwnProperty("calendarId"))
				data.unshift({id: "nocal", summary: ""});

			setCalslist(data);
		}
		load();
	}, []);
	
	//Per salvare la scelta nel db
	const handleChangeCal = async () =>  {
		const update = await fetch("/api/google/setcal", {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				userid: user._id,
				calid: selCal
			})
		}).then(resp => resp.json());

		//Feedback visivo
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

//Componente che raggruppa tutti i sottocomponenti definiti sopra
const ExternalCalsSection = ({ user, updateUser }) => {
	
	const [googleLogin, setGoogleLogin] = useState(user.google.isLogged);
	
	useEffect(() => {
		setGoogleLogin(user.google.isLogged);
	}, [user.google.isLogged]);
	
	//In caso di logout elimino i dati dal db
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

				<div>
					<h6>Google calendar</h6>

					{
						googleLogin ? (
						<div>
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
				</div>
			</Card.Body>
		</Card>
	);
};

export default ExternalCalsSection;
