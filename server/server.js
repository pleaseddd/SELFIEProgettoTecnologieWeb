//pacchetti node esterni
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const webpush = require("web-push");
const cors = require("cors");
const { getCurrentTimestamp, loadFake } = require("./db/timeMachineClass");
const timeMachine = require("./db/timeMachineClass");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//middleware: estrae il token dal cookie, verifica, e imposta req.userId
const ensureAuth = (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ message: "Non autenticato" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id;   // ora req.userId è disponibile
		next();
	} catch (err) {
		return res.status(401).json({ message: "Token non valido" });
	}
};

const test = true;
require('dotenv').config({ path: __dirname + "/.env" + (test ? '_test' : '') });

/*
 * funzioni da file esterni
 * - setCronFunc serve per il controllo
 * delle notifiche da mandare, usa node-cron per
 * eseguire una funzione ogni tot minuti
 * - loadFake carica nel sito il tempo falso
 * della time time machine
 */
const { setCronFunc } = require('./utils/timeManager.js');
const { loadFake } = require("./db/timeMachineClass.js");


const app = express();

// definisco tutti i middleware che mi servono
app.use(express.json());
app.use(cookieParser());
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
	const nowTimestamp = getCurrentTimestamp();       // numero di millisecondi
	const now = new Date(nowTimestamp).toISOString();
	res.json({ now });
});

app.post("/api/server-time/set", timeMachine.POST_set);
app.post("/api/server-time/reset", timeMachine.POST_reset);

app.get('/auth/google', googleCalendar.auth);
app.get('/auth/google/callback', googleCalendar.auth_callback);
app.post('/google/events', googleCalendar.events);
//app.post('/google/logout', googleCalendar.logout);
//app.post('/google/getcalendars', googleCalendar.getCalendars);

// service worker subscriptions - CRUD
app.post('/listsubs', swsubs.POST_list);
app.post('/getswsub', swsubs.POST_getswsub);
app.post('/subscribe', swsubs.POST_subscribe);
app.post('/unsubscribe', swsubs.POST_unsubscribe);
app.post('/updateswsubname', swsubs.POST_updateswsubname);

// users - CRUD
app.use(cookieParser());
app.post('/newuser', users.POST_new);
app.post('/userlogin', users.POST_authLogin);
app.get('/userauth', users.GET_authMe);
app.post('/userlogout', users.POST_authLogout);
app.post('/updatesettings', users.POST_settings);
app.post('/updateUser', users.POST_updateUser);

console.log('user');

app.post("/api/user/setPaletteKey", ensureAuth, async (req, res) => {
	try {
		const updatedUser = await users.setPaletteKey(req.userId, req.body.paletteKey);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json({ error: "Errore nell'aggiornamento della palette" });
	}
});

// note - CRUD
app.post('/notes', notes.POST_list);
app.post('/newnote', notes.POST_new);
app.post('/lastnotes', notes.POST_last);
app.post('/deletenote', notes.POST_delete);
app.post('/updatenote', notes.PUT_update);

console.log('note');

//calendar - CRUD
app.post('/events', calendar.POST_list);
app.post('/newevent', calendar.POST_new);
app.post('/updateevent', calendar.POST_update);
app.post('/deleteevent', calendar.POST_delete);
app.post('/upcoming', calendar.POST_upcoming);

console.log('tutto ok!');

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(process.env.PORT, async () => {
	console.log(`Server started on ${process.env.WEB_URL}:${process.env.PORT}`);

	await mongoose.connect(process.env.MONGO_URL)
		.then(console.log('database connesso'))
		.catch(err => console.error(err));
	await loadFake()
		.then(console.log("TimeMachine cache inizializzata"))
		.catch(err => console.error(err));

	setCronFunc();
});
