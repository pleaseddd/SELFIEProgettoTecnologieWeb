const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");

const { userGET, userPOST_new, userPOST_login } = require('./db/usersClass.js');
const { notePOST_list, notePOST_new, noteDELETE } = require('./db/notesClass.js');

const MONGO_URL = "mongodb://site232479:ahlaYae8@mongo_site232479?writeConcern=majority";
main().catch(err => console.log(err));

async function main() {
	await mongoose.connect(MONGO_URL);
	console.log("database connesso");
}

app.get("/api", (req, res) => {
  res.json({ utente: ["utente1", "utente2", "utente3"] });
});

app.use(express.json());

// users - CRUD
app.get('/users', userGET);
app.post('/newuser', userPOST_new);
app.post('/userlogin', userPOST_login);

// note - CRUD
app.post('/notes', notePOST_list);
app.post('/newnote', notePOST_new);
app.post('/deletenote', noteDELETE);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(8000, () => {
	console.log("Server started on http://site23279.tw.cs.unibo.it");
});
