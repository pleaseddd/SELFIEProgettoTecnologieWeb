//pacchetti node esterni
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const webpush = require("web-push");
const cors = require("cors");

const test = true;
require('dotenv').config({ path: __dirname + "/.env" + (test?'_test':'') });

//file interni
const users = require('./db/usersClass.js');
const notes = require('./db/notesClass.js');
const calendar = require('./db/calendarClass.js');
const swsubs = require('./db/swsubsClass.js');
const notifs = require('./db/notifClass.js');
const timeManager = require('./utils/timeManager.js');
const googleCalendar = require('./utils/googleCalendar.js');

async function connectDatabase() {
	await mongoose.connect(process.env.MONGO_URL);
	console.log("database connesso");
}

const app = express();

app.use(express.json());
app.use(cors({
	origin: '*',
	credentials: true,
	allowHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
	res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
	res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});


//Prendo l'orario

app.get('/api/server-time', (req, res) => {
	const now = new Date().toISOString();
	res.json({ now });
});

app.get('/auth/google', googleCalendar.auth);
app.get('/auth/google/callback', googleCalendar.auth_callback);
app.post('/google/events', googleCalendar.events);
app.post('/google/logout', googleCalendar.logout);
app.post('/google/getcalendars', googleCalendar.getCalendars);

// service worker subscriptions - CRUD
app.post('/listsubs', swsubs.POST_list);
app.post('/getswsub', swsubs.POST_getswsub);
app.post('/subscribe', swsubs.POST_subscribe);
app.post('/unsubscribe', swsubs.POST_unsubscribe);
app.post('/updateswsubname', swsubs.POST_updateswsubname);

// users - CRUD
app.post('/newuser', users.POST_new);
app.post('/userlogin', users.POST_login);
app.post('/updatesettings', users.POST_settings);
app.post('/updateUser', users.POST_updateUser);

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
	console.log(`Server started on ${process.env.WEB_URL}:${process.env.PORT}`);

	await connectDatabase().catch(err => console.log(err));
	timeManager.setCronFunc();
});
