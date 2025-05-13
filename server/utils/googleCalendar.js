const { google } = require('googleapis');
require('dotenv').config({ path: __dirname + '/../.env' });

const users = require('../db/usersClass.js');

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

// oauth2Client.on('tokens', tokens => {
// 	if(tokens.refresh_tokens) {
//
// 	}
// });

const scopes = ['https://www.googleapis.com/auth/calendar'];

module.exports = {
	auth: async (req, res) => {
		const { email } = req.query;

		const url = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			prompt: 'consent',
			scope: scopes,
			state: email
		});

		res.redirect(url);
	},

	auth_callback: async (req, res) => {
		const { code, state } = req.query;
		const { tokens } = await oauth2Client.getToken(code);

		const user = await users.updateGoogleTokens(state, tokens);

		res.redirect('/settings?auth-success=true');
	},

	logout: async (req, res) => {
		const user = await users.googleLogout(req.body.user_id);
		res.status(201).json(user);
	},

	events: async (req, res) => {
		oauth2Client.setCredentials(req.body.googleTokens);

		const calendar = google.calendar({
			version: 'v3',
			auth: oauth2Client
		});

		const calslist = await calendar.calendarList.list()
			.then(resp => resp.data.items);

		const resp = await calendar.events.list({
			calendarId: '12e1bcc906241278fe37f5a035e685ea59b79798f1d8350bd1a7809593fcad13@group.calendar.google.com',
			timeMin: new Date().toISOString(),
			maxResults: 5,
			orderBy: 'startTime',
			singleEvents: true
		});

		res.json(resp.data.items);
	}
};
