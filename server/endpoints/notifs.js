const notifsdb = require('../db/notifClass.js');

module.exports = {
	setEndpoints: (router) => {
		router.post('/api/notifs/list', POST_list);
		router.post('/api/notifs/snooze', POST_snooze);
	}
};

async function POST_list(req, res) {
	res.status(201).json(await notifsdb.findByEvent(req.body._id));
}

async function POST_snooze(req, res) {
	console.log("snooze");
}
