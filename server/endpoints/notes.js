//Moduli interni per la manipolazione dei database
const notesdb = require('../db/notesClass.js');

module.exports = {
	setEndpoints: (router) => {
		router.post('/api/notes/list', POST_list);
		router.post('/api/notes/new', POST_new);
		router.post('/api/notes/last', POST_last);
		router.post('/api/notes/delete', POST_delete);
		router.post('/api/notes/update', POST_update);
	}
};

//Lista delle note di un utente
async function POST_list(req, res) {
	try {
	    //Filtra per id utente
		const userId = req.body.userid;
		const notes = await notesdb.findBy({ author: userId });

		res.status(201).json(notes); //Successo
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

//Memorizzazione di una nuova nota nel db
async function POST_new(req, res) {
  try {
    const { title, category, body, userid } = req.body;
    const newNote = notesdb.newNote({
      title,
      category,
      body,
      author: userid,
    });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//Lista delle ultime n note modificate piu' recentemente
async function POST_last(req, res) {
	try {
	  const userId = req.body.userid;
	  const numNotes = req.body.limit;
	  const lastNotes = await notesdb.findBy({ author: userId }, `last ${numNotes}`);

	  res.status(201).json(lastNotes);
	}
	catch(err) {
		res.status(400).json({ message: err.message });
	}
}

//Eliminazione di una nota dal db
async function POST_delete(req, res) {
  try {
    const { noteid, userid } = req.body;
    const note = await notesdb.findBy({ id: noteid });

    if (!note)
      return res.status(404).json({ message: "Nota non trovata" });
    if (note.author.toString() !== userid)
      return res.status(403).json({ message: "Non autorizzato" });

    await note.deleteOne();

    res.status(200).json({ message: "Nota eliminata" }); //Successo
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//Modifica di una nota esistente
async function POST_update(req, res) {
  try {
    const { noteid, title, category, body, userid } = req.body;
    const note = await notesdb.findBy({ id: noteid });

    if (!note)
      return res.status(404).json({ message: "Nota non trovata" });
    if (note.author.toString() !== userid)
      return res.status(403).json({ message: "Non autorizzato" });

    note.title = title;
    note.category = category;
    note.body = body;
    await note.save();

    res.json({ message: "Nota aggiornata con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
