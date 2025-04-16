const express = require("express");
const path = require("path");
const webpush = require("web-push");
const cors = require("cors");
require('dotenv').config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");

const users = require('./db/usersClass.js');
const notes = require('./db/notesClass.js');
const calendar = require('./db/calendarClass.js');

connectDatabase().catch(err => console.log(err));
async function connectDatabase() {
	// await mongoose.connect(process.env.TEST_MONGO_URL);
	await mongoose.connect(process.env.MONGO_URL);
	console.log("database connesso");
}

webpush.setVapidDetails(
	"https://site232479.tw.cs.unibo.it",
	process.env.VPKEY_PUBLIC,
	process.env.VPKEY_PRIVATE
);

const app = express();

app.use(express.json());
app.use(cors());

//Prendo l'orario
app.get('/api/server-time', (req, res) => {
	const now = new Date().toISOString();
	res.json({ now });
});

let subscriptions = [];
app.post("/api/subscribe", (req, res) => {
	subscriptions.push(req.body);
	console.log("Nuova iscrizione salvata!");
	res.status(201).json();
});

app.post("/api/schedule-notification", (req, res) => {
	const { title, body, scheduledTime } = req.body;

	const delay = new Date(scheduledTime).getTime() - Date.now();
	if(delay <= 0)
		res.status(400).json({ error: "L'orario deve essere nel futuro" });
	
	setTimeout(() => {
		const payload = JSON.stringify({ title, body });
		subscriptions.forEach(sub => {
			webpush.sendNotification(sub, payload)
				.catch(err => console.error("Errore nell'invio"));
		});
	}, delay);

	res.status(201).json({ message: `Notifica programamta per ${scheduledTime}` });
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


app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(8000, () => {
	console.log("Server started on http://site23279.tw.cs.unibo.it");
});
