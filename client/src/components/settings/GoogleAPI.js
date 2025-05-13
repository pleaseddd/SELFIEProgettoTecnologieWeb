import { useEffect } from 'react';

const GoogleLoginButton = ({ user, updateUser }) => {
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

	return (
		<button onClick={() => window.location = `/auth/google?email=${user.email}`}>
			Connetti con Google
		</button>
	);
};

export default GoogleLoginButton;
