const { google } = require('googleapis');
const usersdb = require('../db/usersClass.js');

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
	'https://www.googleapis.com/auth/calendar',
	'https://www.googleapis.com/auth/userinfo.profile',
	'https://www.googleapis.com/auth/userinfo.email'
];

module.exports = {
	setEndpoints: (router) => {
		router.get('/auth/google', auth);
		router.get('/auth/google/callback', auth_callback);
		router.post('/api/google/events', POST_events);
		router.post('/api/google/logout', POST_logout);
		router.post('/api/google/getcalendars', POST_getCalendars);
		router.post('/api/google/setcal', POST_setcal);
		router.post('/api/google/setemailconsent', POST_emailconsent);
	}
};

async function auth(req, res) {
	const { email } = req.query;

	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		prompt: 'consent',
		scope: scopes,
		state: email
	});

	res.redirect(url);
}

async function auth_callback(req, res) {
	const { code, state } = req.query;
	const { tokens } = await oauth2Client.getToken(code);

	oauth2Client.setCredentials(tokens);
	const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2'});
	const profile = await oauth2.userinfo.get();

	const googleInfo = { $set: {
		google: {
			isLogged: true,
			tokens,
			propic: profile.data.picture,
			gmail: {
				notifs: false,
				address: profile.data.email
			}
		}
	} };

	const user = await usersdb.googleLogin(state, googleInfo);

	res.redirect('/settings');
}

async function POST_logout(req, res) {
	await usersdb.googleLogout(req.body.user_id);
	const user = await usersdb.findBy({ id: req.body.user_id });
	res.status(201).json(user);
}

async function POST_events(req, res) {
	oauth2Client.setCredentials(req.body.googleTokens);

	const calendar = google.calendar({
		version: 'v3',
		auth: oauth2Client
	});

	const calslist = await calendar.calendarList.list()
		.then(resp => resp.data.items);

	const resp = await calendar.events.list({
		calendarId: calslist[calslist.length-1].id,
		timeMin: new Date().toISOString(),
		maxResults: 5,
		orderBy: 'startTime',
		singleEvents: true
	});

	res.json(resp.data.items);
}

async function POST_getCalendars(req, res) {
	oauth2Client.setCredentials(req.body.googleTokens);

	const calendar = google.calendar({
		version: 'v3',
		auth: oauth2Client
	});

	try {
		const calslist = await calendar.calendarList.list()
			.then(resp => resp.data.items);

		res.status(200).json(calslist);
	}
	catch(error) {
		console.log('errore nel prendere i calendari');
		console.log(error);
		res.status(400).json({ message: error });
	}
}

async function POST_setcal(req, res) {
	try {
		const user = await usersdb.setGoogleCal(req.body.userid, req.body.calid);
		res.status(200).json(user);
	}
	catch(error) {
		console.log('errore nel settare il calendario');
		res.status(400).json({ message: error });
	}
}

async function POST_emailconsent(req, res) {
	const filter = { _id: req.body.user_id };
	const update = { $set: {
		'google.gmail.notifs': req.body.consent
	} };

	await usersdb.update(filter, update);
	const newuser = await usersdb.findBy({ id: req.body.user_id });
	res.status(201).json(newuser);
}
