const { OAuth2Client } = require('google-auth-library');
require('dotenv').config({ path: __dirname + "/../client/.env" });

module.exports = {
	auth: async (req, res) => {
		const oauth2Client = new OAuth2Client({
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			process.env.GOOGLE_REDIRECT_URI
		});

		const authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: ['https://www.googleapis.com/auth/calendar.events'],
		});

		res.status(201).json({ authUrl });
	},

	auth_callback: async (req, res) => {
		const url = new URL(req.url);
		const code = url.searchParams.get('code');

		const oauth2Client = new OAuth2Client({
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			process.env.GOOGLE_REDIRECT_URI
		});

		const { tokens } = await oauth2Client.getToken(code);
		console.log(tokens);
		console.log("Autenticazione avvenuta con successo");
	}
};
