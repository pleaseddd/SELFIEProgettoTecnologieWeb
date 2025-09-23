const { google } = require('googleapis');

const usersdb = require('../db/usersClass.js');

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
	'https://www.googleapis.com/auth/calendar',
	'https://mail.google.com/'
];

module.exports = {
	newEvent: async (event) => {
		const author = await usersdb.findBy({ id: event.userid });

		oauth2Client.setCredentials(author.google.tokens);

		const calendar = google.calendar({
			version: 'v3',
			auth: oauth2Client
		});

		return await calendar.events.insert({
			calendarId: event.googleCalId,
			sendNotifications: true,
			requestBody: {
				summary: event.title,
				start: {
					dateTime: event.begin,
					timeZone: "Europe/Rome"
				},
				end: {
					dateTime: event.end,
					timeZone: "Europe/Rome"
				},
				recurrence: event.rruleStr?.split('\n').slice(1)
			}
		});
	},

	deleteEvent: async (event) => {
		const author = await usersdb.findBy({ id: event.author });

		oauth2Client.setCredentials(author.google.tokens);

		const calendar = google.calendar({
			version: 'v3',
			auth: oauth2Client
		});

		return await calendar.events.delete(event.google);
	}
};
