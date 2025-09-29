const calendardb = require('../db/calendarClass.js');
const googleCalendar = require('../utils/googleCalendar.js');
const notifsdb = require('../db/notifClass.js');
const { generateNotifs } = require('../utils/calendar.js');

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

		if(req.body.google.isSaved) {
			const gCalEvent = await googleCalendar.newEvent(req.body);
			req.body.google.eventId = gCalEvent.data.id;
		}

		newEvent = await calendardb.newEvent(req.body);

		await generateNotifs(newEvent, req.body.notifs);

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
		const { _id, author } = req.body;
		const filter = { _id, author };

		const oldEvent = await calendardb.findBy({ id: _id });

		if(req.body.google.isSaved) {
			if(!oldEvent.google.isSaved) {
				const gCalEvent = await googleCalendar.newEvent(req.body);
				req.body.google.eventId = gCalEvent.data.id;
			}
			else {
				req.body.google.eventId = oldEvent.google.eventId;
				await googleCalendar.updateEvent(req.body);
			}
		}

	    const updated = await calendardb.update(filter, req.body);

		await notifsdb.deleteByEvent(updated._id);
		await generateNotifs(updated, req.body.notifs);

		if (!updated)
			return res.status(403).json({ error: "Accesso negato" });

		res.json(updated);
	}
	catch (err) {
		res.status(400).json({ error: err.message });
	}
}

// Elimina evento
async function POST_delete(req, res) {
	try {
	  const { _id, author } = req.body;
	  const deleted = await calendardb.deleteBy({ _id, author });
	  if (!deleted)
		  return res.status(403).json({ error: "Accesso negato" });

	  if(deleted.google?.eventId)
		  await googleCalendar.deleteEvent(deleted);

	  await notifsdb.deleteByEvent(deleted._id);

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
