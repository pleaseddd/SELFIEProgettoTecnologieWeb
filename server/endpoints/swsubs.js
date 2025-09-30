const swsubsdb = require('../db/swsubsClass.js');

module.exports = {
	setEndpoints: (router) => {
		router.post('/api/swsub/listsubs', POST_list);
		router.post('/api/swsub/get', POST_getswsub);
		router.post('/api/swsub/subscribe', POST_subscribe);
		router.post('/api/swsub/unsubscribe', POST_unsubscribe);
		router.post('/api/swsub/updatename', POST_updateswsubname);
	}
};

//Elenco di tutte le iscrizioni di un utente al service worker
async function POST_list(req, res) {
	const subs = await swsubsdb.findBy({ user: req.body.user_id });
	res.status(201).json(subs);
}

//Trova una specifica iscrizione
async function POST_getswsub(req, res) {
	const sub = await swsubsdb.findBy({ endpoint: req.body.endpoint });
	res.status(201).json(sub);
}

//Memorizza l'iscrizione nel db
function POST_subscribe(req, res) {
	try {
		const sub = Object.assign(req.body.sub, {
			name: req.body.name,
			user: req.body.user_id
		});

		const newsub = swsubsdb.newSwSub(sub);
		res.status(201).json({ message: "Iscrizione salvata" });
	}
	catch(error) {
		res.status(500).json({ error: error });
		console.error("Errore nell'iscrizione:", error);
	}
}

//Elimina i dati dell'iscrizione nel db
async function POST_unsubscribe(req, res) {
	try {
		await swsubsdb.deleteBy({ endpoint: req.body.endpoint });
		res.status(201).json({ message: "Iscrizione cancellata" });
	}
	catch(error) {
		console.error("Errore nell'eliminare l'iscrizione:", error);
	}
}

//Modifica il nome del dispositivo di un'iscrizione
async function POST_updateswsubname(req, res) {
	try {
		await swsubsdb.updateName(req.body.endpoint, req.body.name);
		res.status(201).json({ message: "Iscrizione aggiornata" });
	}
	catch(err) {
		console.error("Errore nell'aggiornare l'iscrizione:", err);
	}
}
