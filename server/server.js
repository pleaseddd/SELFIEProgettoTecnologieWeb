const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");

const users = require('./db/usersClass.js');
const notes = require('./db/notesClass.js');
const calendar = require('./db/calendarClass.js');

const MONGO_URL = "mongodb://site232479:ahlaYae8@mongo_site232479?writeConcern=majority";
main().catch(err => console.log(err));

async function main() {
	await mongoose.connect(MONGO_URL);
	console.log("database connesso");
}

//Prendo l'orario
app.get('/api/server-time', (req, res) => {
	const now = new Date().toISOString(); 
	res.json({ now });
  });
  
app.use(express.json());

// users - CRUD
app.post('/newuser', users.POST_new);
app.post('/userlogin', users.POST_login);

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
