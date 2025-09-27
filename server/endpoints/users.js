const jwt = require('jsonwebtoken');
const userdb = require('../db/usersClass.js');

module.exports = {
	setEndpoints: (router) => {
		router.post('/api/user/new', POST_new);
		router.post('/api/user/login', POST_authLogin);
		router.get('/api/user/auth', GET_authMe);
		router.post('/api/user/logout', POST_authLogout);
		router.post('/api/user/updatesettings', POST_settings);
		router.post('/api/user/setPaletteKey', ensureAuth, POST_setPaletteKey);
		router.post('/api/user/setLastPomodoro', ensureAuth, POST_setLastPomodoro);
		router.post('/api/user/info', ensureAuth, POST_userinfo);
	}
};

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

// crea un nuovo utente
async function POST_new(req, res) {
	try {
		const { name, email, password } = req.body;
		const user = await userdb.findBy({ email });

		if (user)
			res.status(401).json({ message: "Usa un'altra email!" });
		else {
			const newUser = await userdb.newUser({
				name,
				email,
				password,
				propic: "https://dummyimage.com/80x80/023430/fff.jpg&text=propic",
			});
			res.status(201).json(newUser);
	    }
	}
	catch (err) {
		res.status(400).json({ message: err.message });
	}
}

// GESTIONE SESSIONE LOGIN
async function POST_authLogin(req, res) {
	try {
		const { email, password } = req.body;
		const user = await userdb.findBy({ email });

		if (!user || !(await user.checkpw(password)))
			return res.status(401).json({ message: "Credenziali non valide" });

		const token = jwt.sign(
			{ id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: "7d", }
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "Strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({ message: "Login riuscito" });
	}
	catch (err) {
		res.status(500).json({ message: "Errore del server: " + err });
	}
}

async function GET_authMe(req, res) {
	try {
		const token = req.cookies.token;
		if (!token)
			return res.status(401).json({
				message: "Non autenticato"
			});

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await userdb.findBy({ id: decoded.id });

		if (!user)
			return res.status(404).json({ message: "Utente non trovato" });

		res.status(200).json(user);
	}
	catch (err) {
		res.status(401).json({ message: "Token non valido" });
	}
}

async function POST_authLogout(req, res) {
	res.clearCookie("token");
	res.status(200).json({ message: "Logout effettuato" });
}
// FINE GESTIONE SESSIONE LOGIN

// aggiorna le impostazioni
async function POST_settings(req, res) {
	try {
	    const filter = { _id: req.body.user.id };
	    const update = {
			$set: {
				name: req.body.user.name,
				email: req.body.user.email,
				settings: req.body.user.settings,
			},
	    };
	    const user = await userdb.update(filter, update);

	    res.status(201).json({
			message: "impostazioni cambiate"
		});
	}
	catch (error) {
	    res.status(500).json({ error: "errore nel cambiare le impostazioni:" + error });
	}
}

async function POST_setPaletteKey(req, res) {
	try {
		const updatedUser = await userdb.setPaletteKey(req.userId, req.body.paletteKey);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json({ error: "Errore nell'aggiornamento della palette" });
	}
}

async function POST_setLastPomodoro(req, res) {
  try {
    const updatedUser = await userdb.setLastPomodoro(req.body.user.userid, req.body.user.lastPomodoroSession);
    res.status(200).json(updatedUser.lastPomodoroSession);
  } catch (err) {
	console.log(error)
    res.status(500).json({ error: "Errore nell'aggiornamento della sessione" });
  }
}

async function POST_userinfo(req, res) {
	// console.log(req)
  try {
    const user = await userdb.findBy(req.body);

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero informazioni: " + err });
  }
}
