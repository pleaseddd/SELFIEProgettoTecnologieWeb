const timeMachineDB = require("../db/timeMachineClass.js");

module.exports = {
	setEndpoints: (router) => {
		//Prendo l'orario
		router.get('/api/server-time', GET_servertime);
		router.post("/api/server-time/set", POST_set);
		router.post("/api/server-time/reset", POST_reset);
		router.get("/api/server-time/flag", GET_flag);
	}
};

async function GET_servertime(req, res) {
	const nowTimestamp = timeMachineDB.getCurrentTimestamp(); // numero di millisecondi
	const now = new Date(nowTimestamp).toISOString();
	res.json({ now });
}

async function POST_set(req, res) {
  try {
    const { datetime } = req.body;
    if (!datetime) {
      return res.status(400).json({
		  message: "Devi inviare il campo 'datetime' in formato ISO."
	  });
    }

    const parsed = new Date(datetime);
    if (isNaN(parsed.getTime())) {
      return res
        .status(400)
        .json({ message: "Il campo 'datetime' non è una data valida." });
    }

    // Salvo un nuovo documento con fakeNow
    const entry = await timeMachineDB.newTime(parsed);

    // Ricarico in cache l’ultimo fake
    await timeMachineDB.loadFake();

    return res
      .status(201)
      .json({ message: "Tempo impostato con successo.", now: parsed.toISOString() });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

async function POST_reset(req, res) {
  try {
    await timeMachineDB.deleteAll();
    timeMachineDB.resetCache();
    return res.json({ message: "Time Machine resettata." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

async function GET_flag(req, res) {
  try {
    const flag = timeMachineDB.getFlag();
    res.json({ flag });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}
