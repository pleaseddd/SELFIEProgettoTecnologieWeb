const calendardb = require('../db/calendarClass.js');
const notifs = require('../db/notifClass.js');
const googleCalendar = require('../utils/googleCalendar.js');
const { Time, dateSubTime } = require("../utils/timeManager.js");

module.exports = {
	setEndpoints: (router) => {
		router.post('/api/events/list', POST_list);
		router.post('/api/events/new', POST_new);
		router.post('/api/events/update', POST_update);
		router.post('/api/events/delete', POST_delete);
		router.post('/api/events/upcoming', POST_upcoming);
	}
};

// Elenco eventi per autore
async function POST_list(req, res) {
	try {
		const events = await calendardb.findBy({ author: req.body.userid });
		res.status(200).json(events);
	}
	catch (err) {
		res.status(500).json({ message: err.message });
	}
}

// Nuovo evento
async function POST_new(req, res) {
	try {
		const author = req.body.userid;
		const refDate = new Date(req.body.begin);
		const { title, urgency } = req.body;

		const urgencyNotifs = {
			'urgente': [
				new Time({ days: 1 }),
				new Time({ hours: 12 }),
				new Time({ hours: 1 }),
				new Time({ minutes: 15 }),
			],

			'non troppo urgente': [
				new Time({ days: 1 }),
				new Time({ hours: 12 }),
				new Time({ hours: 1 })
			],

			'non urgente': [
				new Time({ days: 1 }),
				new Time({ hours: 1 })
			]
		};

		urgencyNotifs[urgency].forEach(async time => {
			const sendDate = dateSubTime(refDate, time);
			await notifs.new_notif({
				user: author,
				title,
				body: time.toString(),
				time: sendDate,
			});
		});

		let newEvent;
		if(req.body.googleCalId) {
			const googleCalEvent = await googleCalendar.newEvent(req.body);
			newEvent = await calendardb.newEvent({
				...req.body,
				author,
				google: {
					calendarId: req.body.googleCalId,
					eventId: googleCalEvent.data.id
				}
			});
		}
		else {
			newEvent = await calendardb.newEvent({ ...req.body, author });
		}

		res.status(201).json(newEvent);
	}
	catch (err) {
		console.log("Errore salvataggio evento:", err);
		res.status(400).json({ error: err.message });
	}
}

// Aggiorna evento
async function POST_update(req, res) {
	try {
	  const { _id, userid } = req.body;
	  const filter = { _id, author: userid };

		const oldEvent = await calendardb.findBy({ id: _id });

		let update;
		if(!oldEvent.google?.eventId && req.body.googleCalId) {
			const googleCalEvent = await googleCalendar.newEvent(req.body);
			update = {
				...req.body,
				google: {
					calendarId: req.body.googleCalId,
					eventId: googleCalEvent.data.id
				}
			}
		}
		else if(oldEvent.google?.eventId) {
			update = {
				...req.body,
				google: oldEvent.google
			};
			await googleCalendar.updateEvent(update);
		}
		else {
		  update = req.body;
		}

	  const updated = await calendardb.update(filter, update);
	  if (!updated)
		  return res.status(403).json({ error: "Accesso negato" });


	  res.json(updated);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
}

// Elimina evento
async function POST_delete(req, res) {
	try {
	  const { _id, author } = req.body;
	  const deleted = await calendardb.deleteBy({ _id, author });
	  if (!deleted) return res.status(403).json({ error: "Accesso negato" });

	  if(deleted.google?.eventId)
		  await googleCalendar.deleteEvent(deleted);

	  res.json({ message: "Evento eliminato" });
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
}

// Elenco eventi futuri
async function POST_upcoming(req, res) {
	try {
	  const { userid } = req.body;
	  const now = new Date();

	  const events = await calendardb.findBy({
	    author: userid,
	    begin: { $gte: now },
	  }, `upcoming ${3}`);

	  res.status(200).json(events);
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
}
