//Moduli esterni
const { google } = require('googleapis');

//Modulo interno per la manipolazione del db
const usersdb = require('../db/usersClass.js');

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

module.exports = {
	/*
	 * crea un nuovo evento su Google Calendar
	 * @param event: Object, l'evento del db da copiare
	 * returns: Object, l'oggetto restituito da google alla creazione
	 */
	newEvent: async (event) => {
		const author = await usersdb.findBy({ id: event.author });

		oauth2Client.setCredentials(author.google.tokens);

		const calendar = google.calendar({
			version: 'v3',
			auth: oauth2Client
		});

		return await calendar.events.insert({
			calendarId: event.google.calendarId,
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
	
	/*
	 * aggiorna un evento di Google Calendar esistente anche sul db
	 * @param event: Object, l'evento del db di referimento
	 * returns: Object, l'oggetto restituito da google
	 */
	updateEvent: async (event) => {
		const author = await usersdb.findBy({ id: event.author });

		oauth2Client.setCredentials(author.google.tokens);

		const calendar = google.calendar({
			version: 'v3',
			auth: oauth2Client
		});

		return await calendar.events.update({
			...event.google,
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
	
	/*
	 * elimina un evento di Google Calendar esistente anche sul db
	 * @param event: Object, l'evento del db di referimento
	 * returns: Object, l'oggetto restitutito da google
	 */
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
