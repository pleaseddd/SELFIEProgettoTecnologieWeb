const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const users = require('./db/usersClass.js');
const notes = require('./db/notesClass.js');

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


// users - richieste
app.get('/users', users.userGET);
app.post('/newuser', users.userPOST_new);
app.post('/userlogin', users.userPOST_login);

// notes - richieste
app.post('/notes', notes.notePOST_list);
app.post('/newnote', notes.notePOST_new);
app.delete('/deletenote', notes.notePOST_delete,);
app.post('/updatenote', notes.notePUT_update);


app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(8000, '0.0.0.0', () => {
	console.log("Server started on http://site23279.tw.cs.unibo.it");
});
