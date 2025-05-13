import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
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

const ExternalCalsSection = ({ user, updateUser }) => {
	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="d-flex align-items-center mb-4">
					<h5>Calendari esterni</h5>
				</div>

				<GoogleAuth user={user} updateUser={updateUser} />
			</Card.Body>
		</Card>
	);
};

export default ExternalCalsSection;
