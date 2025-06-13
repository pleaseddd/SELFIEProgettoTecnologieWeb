const mongoose = require("mongoose");

const TimeMachineSchema = new mongoose.Schema(
  {
    fakeNow: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const TimeMachine = mongoose.model("TimeMachine", TimeMachineSchema);

let cachedOffset = 0;

async function loadFake() {
  const lastEntry = await TimeMachine.findOne().sort({ updatedAt: -1 });
  if (lastEntry && lastEntry.fakeNow) {
    // fakeNow = data/ora scelta dall’utente
    // updatedAt = momento (real) in cui è stato salvato
    const fakeMs = lastEntry.fakeNow.getTime();
    const realMs = lastEntry.updatedAt.getTime();
    cachedOffset = fakeMs - realMs;
  } else {
    cachedOffset = 0;
  }
}

module.exports.TimeMachine = TimeMachine;

module.exports.getCurrentTimestamp = function () {
  return Date.now() + cachedOffset;
};

module.exports.loadFake = loadFake;

module.exports.GET_current = async function (req, res) {
  try {
    const nowMs = Date.now() + cachedOffset;
    const nowIso = new Date(nowMs).toISOString();
    res.json({ now: nowIso });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.POST_set = async function (req, res) {
  try {
    const { datetime } = req.body;
    if (!datetime) {
      return res
        .status(400)
        .json({ message: "Devi inviare il campo 'datetime' in formato ISO." });
    }

    const parsed = new Date(datetime);
    if (isNaN(parsed.getTime())) {
      return res
        .status(400)
        .json({ message: "Il campo 'datetime' non è una data valida." });
    }

    // Salvo un nuovo documento con fakeNow
    const entry = new TimeMachine({ fakeNow: parsed });
    await entry.save();

    // Ricarico in cache l’ultimo fake
    await loadFake();

    return res
      .status(201)
      .json({ message: "Tempo impostato con successo.", now: parsed.toISOString() });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports.POST_reset = async function (req, res) {
  try {
    await TimeMachine.deleteMany({});
    cachedOffset = 0;
    return res.json({ message: "Time Machine resettata." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.TimeMachine = TimeMachine;