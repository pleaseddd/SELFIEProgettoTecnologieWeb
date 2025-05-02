//pacchetti node esterni
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const webpush = require("web-push");
const cors = require("cors");
const cron = require("node-cron");
require('dotenv').config({ path: __dirname + "/../client/.env" });

//file interni
const users = require('./db/usersClass.js');
const notes = require('./db/notesClass.js');
const calendar = require('./db/calendarClass.js');
const swsubs = require('./db/swsubsClass.js');
const notifs = require('./db/notifClass.js');

async function connectDatabase() {
	 await mongoose.connect(process.env.TEST_MONGO_URL);
	// await mongoose.connect(process.env.MONGO_URL);
	console.log("database connesso");
}

const app = express();

app.use(express.json());
app.use(cors());

//Prendo l'orario
app.get('/api/server-time', (req, res) => {
	const now = new Date().toISOString();
	res.json({ now });
});

app.post('/listsubs', swsubs.POST_list);
app.post('/subscribe', swsubs.POST_subscribe);
app.post('/unsubscribe', swsubs.POST_unsubscribe);
app.post('/test-notification', async (req, res) => {
	try {
		const user = await users.findById(req.body.user_id);
		const subs = await swsubs.findByUser(req.body.user_id);

		const notif = {
			title: `Ciao ${user.name}!`,
			body: "notifica di prova"
		};

		subs.forEach(sub => webpush.sendNotification(sub, JSON.stringify(notif)));

		res.status(201).json({ message: "notifica mandata" });
	}
	catch(error) {
		console.log("Errore nella notifica di prova:", error);
	}
});

app.post('/schedule-notification', async (req, res) => {
	const { data, user_id } = req.body;

	await notifs.new_notif({
		user: user_id,
		title: data.title,
		body: data.body,
		time: data.time
	});

	res.status(201).json({ message: "notifica programmata" });
});

const toISOLocalTime = (date) => {
	let tzo = -date.getTimezoneOffset();
	let dif = tzp >= 0 ? '+' : '-';
	const pad = (num) => (num > 10 ? '0' : '') + num;

	return date.getFullYear() +
		'-' + pad(date.getMonth()+1) +
		'-' + pad(date.getDate()) +
		'T' + pad(date.getMinutes())
};

cron.schedule('* * * * *', async () => {
	const pendings = await notifs.findCurrentPendings();

	pendings.forEach(async (notif) => {
		const subs = await swsubs.findByUser(notif.user);
		subs.forEach(async (sub) => {
			await webpush.sendNotification(
				sub, JSON.stringify( {title: notif.title, body: notif.body })
			);
		});

		await notifs.notif_sent(notif._id);

		console.log("notifica mandata con successo");
	});
});

// users - CRUD
app.post('/newuser', users.POST_new);
app.post('/userlogin', users.POST_login);
app.post('/updatesettings', users.POST_settings);

// note - CRUD
app.post('/notes', notes.POST_list);
app.post('/newnote', notes.POST_new);
app.post('/lastnotes', notes.POST_last);
app.post('/deletenote', notes.POST_delete);
app.post('/updatenote', notes.PUT_update);

//calendar - CRUD
app.post('/events', calendar.POST_list);
app.post('/newevent', calendar.POST_new);
app.post('/updateevent', calendar.POST_update);
app.post('/deleteevent', calendar.POST_delete);
app.post('/upcoming', calendar.POST_upcoming);


app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(process.env.PORT, async () => {
	console.log(`Server started on ${process.env.WEB_URL}`);

	await connectDatabase().catch(err => console.log(err));
	notifs.setVapidKeys();
});
