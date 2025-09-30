const notifsdb = require('../db/notifClass.js');
const { Time, datePlusTime } = require('../utils/timeManager.js');

module.exports = {
	setEndpoints: (router) => {
		router.post('/api/notifs/list', POST_list);
		router.post('/api/notifs/snooze', POST_snooze);
	}
};

//Elenco delle notifiche associate a un evento del db 
async function POST_list(req, res) {
	res.status(201).json(await notifsdb.findByEvent(req.body._id));
}

//Applica lo snooze di una notifica
async function POST_snooze(req, res) {
	const { time, ...notif } = req.body;
	const oldSendDate = new Date(time);
	const snoozeTime = new Time({ minutes: parseInt(req.body.snooze) });
	const newSendDate = datePlusTime(oldSendDate, snoozeTime);

	await notifsdb.applySnooze({ ...req.body, time: newSendDate });
}
