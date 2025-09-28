//pacchetti nodejs
const express = require("express"); //gestisce la nostra api
const mongoose = require("mongoose"); //per accedere al database
const path = require("path"); //per manipolare i percorsi dei file
const cors = require("cors"); //gestisce gli aspetti esterni
const cookieParser = require("cookie-parser"); //gestisce i cookie degli utenti

/*
 * variabili d'ambiente
 * in fase di test (=true) le variabili d'ambiente
 * sono prese da .env_test,
 * in produzione (test=false) sono prese da .env
 */
const test = true;
require('dotenv').config({ path: __dirname + "/.env" + (test?'_test':'') });

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

/*
 * definisco gli endpoint dell'api,
 * sono molti e quindi sono divisi
 * nei file esterni per le collezioni mongodb
 */
const dir = './endpoints/';
[
	'users',
	'notes',
	'calendar',
	'swsubs',
	'googleCalendar',
	'timeMachine',
	'notifs'
].forEach(db => require(`${dir}${db}`).setEndpoints(app));

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
