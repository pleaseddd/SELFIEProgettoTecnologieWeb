//Moduli esterni
const { google } = require('googleapis');

//Moduli interni per la manipolazione dei database
const usersdb = require('../db/usersClass.js');

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

/*
 * Gli scope sono le api google specifiche
 * a cui vorremmo avere accesso
 * nel nostro caso ci serve l'accesso a google calendar,
 * all'indirizzo email e alla foto profilo
 */
const scopes = [
	'https://www.googleapis.com/auth/calendar',
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile'
];

module.exports = {
	setEndpoints: (router) => {
	    /*
	     * Endpoint obbligatori richiesti da google
	     * per poter fare il login all'account gmail
	     */
		router.get('/auth/google', auth);
		router.get('/auth/google/callback', auth_callback);

		router.post('/api/google/logout', POST_logout);
		router.post('/api/google/getcalendars', POST_getCalendars);
		router.post('/api/google/setcal', POST_setcal);
		router.post('/api/google/setemailconsent', POST_emailconsent);
	}
};

//Indirizza alla schermata di google per il login
async function auth(req, res) {
    /*
     * Come unico parametro della query viene passato
     * l'email dell'utente, e in quanto valore univoco del db
     * e' un'alternativa piu' sicura rispetto all'id vero e proprio
     */
	const { email } = req.query;

	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		prompt: 'consent',
		scope: scopes,
		state: email
	});

	res.redirect(url);
}

//Crea i token di accesso, li memorizza nel db e reindirizza al sito
async function auth_callback(req, res) {
	console.log("qui");
	const { code, state } = req.query;
	const { tokens } = await oauth2Client.getToken(code);

	oauth2Client.setCredentials(tokens);
	const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2'});
	const profile = await oauth2.userinfo.get();

    //Aggiornamento dell'utente nel db, con i nuovi dati dell'account google
	const googleInfo = { $set: {
		google: {
			isLogged: true,
			tokens,
			propic: profile.data.picture,
			gmail: {
				notifs: false,
				address: profile.data.email
			}
		}
	} };
	const user = await usersdb.googleLogin(state, googleInfo);
    
    /*
     * Il collegamento con google viene fatto solo 
     * attraverso le impostazioni, quindi si ritorna a quella pagina
     */
	res.redirect('/settings');
}

//Disattiva il collegamento con l'account google
async function POST_logout(req, res) {
	await usersdb.googleLogout(req.body.user_id);
	const user = await usersdb.findBy({ id: req.body.user_id });
	res.status(201).json(user); //Successo
}

//Lista dei calendari di un account google
async function POST_getCalendars(req, res) {
	oauth2Client.setCredentials(req.body.googleTokens);

	const calendar = google.calendar({
		version: 'v3',
		auth: oauth2Client
	});

	try {
		const calslist = await calendar.calendarList.list()
			.then(resp => resp.data.items);

		res.status(200).json(calslist); //Successo
	}
	catch(error) {
		console.log('errore nel prendere i calendari');
		console.log(error);
		res.status(400).json({ message: error });
	}
}

//Imposta il calendario google in cui salvare gli eventi
async function POST_setcal(req, res) {
	try {
		const user = await usersdb.setGoogleCal(req.body.userid, req.body.calid);
		res.status(200).json(user); //Successo
	}
	catch(error) {
		console.log('errore nel settare il calendario');
		res.status(400).json({ message: error });
	}
}

async function POST_emailconsent(req, res) {
	const filter = { _id: req.body.user_id };
	const update = { $set: {
		'google.gmail.notifs': req.body.consent
	} };

	await usersdb.update(filter, update);
	const newuser = await usersdb.findBy({ id: req.body.user_id });
	res.status(201).json(newuser);
}
