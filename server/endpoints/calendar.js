//Moduli interni per la manipolazione dei database
const calendardb = require('../db/calendarClass.js');
const notifsdb = require('../db/notifClass.js');

//Moduli interni per funzioni utili
const googleCalendar = require('../utils/googleCalendar.js');
const { generateNotifs } = require('../utils/calendar.js');

/*
 * Ad ogni endpoint e' associata una funzione
 * che viene definita a parte,
 * in questo modo il codice e' piu' leggibile
 * ed e' piu' facile avere una visione globale
 * di tutti gli endpoint di un determinato db
 */
module.exports = {
	setEndpoints: (router) => {
		router.post('/api/events/list', POST_list);
		router.post('/api/events/new', POST_new);
		router.post('/api/events/update', POST_update);
		router.post('/api/events/delete', POST_delete);
		router.post('/api/events/upcoming', POST_upcoming);
	}
};

/*
 * La struttura di tutte le funzioni sotto e' la stessa,
 * quella standard di express per le richieste api.
 * @param req: Object, la richiesta effettuata
 * @param res: Object, il risultato
 */

//Lista degli eventi di un utente
async function POST_list(req, res) {
	try {
		const events = await calendardb.findBy({ author: req.body.userid });
		res.status(200).json(events);
	}
	catch (err) {
		res.status(500).json({ message: err.message });
	}
}

/*
 * Memorizzazione di un nuovo evento nel db
 * oltre alla creazione dell'evento nel db
 * qui vengono eventualmente creati l'evento google
 * e le notifiche associate a tale evento
 */
async function POST_new(req, res) {
	try {
        //Evento google
		if(req.body.google.isSaved) {
			const gCalEvent = await googleCalendar.newEvent(req.body);
			req.body.google.eventId = gCalEvent.data.id;
		}

		newEvent = await calendardb.newEvent(req.body);
        
        //Notifiche da mandare
		await generateNotifs(newEvent, req.body.notifs);

		res.status(201).json(newEvent); //Successo
	}
	catch (err) {
		console.log("Errore salvataggio evento:", err);
		res.status(400).json({ error: err.message });
	}
}

/*
 * Modifica di un evento esistente
 * anche qui sono gestiti l'evento google e le notifiche
 */
async function POST_update(req, res) {
	try {
		const { _id, author } = req.body;
		const filter = { _id, author };

		const oldEvent = await calendardb.findBy({ id: _id });
        
		if(req.body.google.isSaved) {
		    //L'utente puo' cambiare il voler salvare l'evento su google
			if(!oldEvent.google.isSaved) {
				const gCalEvent = await googleCalendar.newEvent(req.body);
				req.body.google.eventId = gCalEvent.data.id;
			}
			//Oppure, se l'evento google esisteva, viene solo aggiornato
			else {
				req.body.google.eventId = oldEvent.google.eventId;
				await googleCalendar.updateEvent(req.body);
			}
		}

	    const updated = await calendardb.update(filter, req.body);
        
        /*
         * Per evitare duplicazioni delle notifiche
         * ad ogni aggiornamento dell'evento tutte le notifiche
         * associate vengono eliminate, e vengono rigenerate
         * seguendo i nuovi dati
         */
		await notifsdb.deleteByEvent(updated._id);
		await generateNotifs(updated, req.body.notifs);

		if (!updated)
			return res.status(403).json({ error: "Accesso negato" });

		res.json(updated); //Successo
	}
	catch (err) {
		res.status(400).json({ error: err.message });
	}
}

/*
 * Elimina un evento dal db
 * anche qui vengono gestiti l'evento google e le notifiche
 */
async function POST_delete(req, res) {
	try {
	  const { _id, author } = req.body;
	  const deleted = await calendardb.deleteBy({ _id, author });
	  if (!deleted)
		  return res.status(403).json({ error: "Accesso negato" });
        
      //Se l'evento google esiste, viene eliminato anche quello
	  if(deleted.google?.eventId)
		  await googleCalendar.deleteEvent(deleted);
      
      //Tutte le notifiche dell'evento vengono eliminate
	  await notifsdb.deleteByEvent(deleted._id);

	  res.json({ message: "Evento eliminato con successo"}); //Successo
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
}

//Lista degli eventi futuri imminenti
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
