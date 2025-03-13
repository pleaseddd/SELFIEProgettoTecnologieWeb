const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const users = require('./db/usersClass.js');


const MONGO_URL = "mongodb://site232479:ahlaYae8@mongo_site232479?writeConcern=majority";
const TEST_MONGO_URL = "mongodb+srv://twuser:twpassword@twtestdb.6nobk.mongodb.net/";

async function connectDatabase() {
	// await mongoose.connect(MONGO_URL);
	await mongoose.connect(TEST_MONGO_URL);
	console.log("database connesso");
}
connectDatabase().catch(err => console.log(err));


const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ utente: ["utente1", "utente2", "utente3"] });
});


// users - richieste
app.get('/users', users.userGET);
app.post('/newuser', users.userPOST_new);
app.post('/userlogin', users.userPOST_login);


app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(8000, () => {
	console.log("Server started on http://localhost:8000");
});
