const mongoose = require("mongoose");
const { RRule } = require("rrule");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    begin: Date,
    end: Date,

    location: {
      type: String,
      required: false,
      trim: true,
    },

    isRecurring: {
      type: Boolean,
    },

    rruleStr: {
      type: String,
    },

    notifications: {
      type: String,
    },
    color: {
      type: String,
      default: "#3788d8", 
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = {
  // Elenco eventi per autore
  POST_list: async (req, res) => {
    try {
      const { userid } = req.body;
      const events = await Event.find({ author: userid });
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Nuovo evento
  POST_new: async (req, res) => {
    try {
      const { title, category, location, begin, end, isRecurring, rruleStr, userid,color } =
        req.body;
      const newEvent = new Event({
        title,
        category,
        location,
        begin,
        end,
        isRecurring,
        rruleStr,
        author: userid, // ⬅️ Mappa correttamente il campo
        color,
      });

      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      console.log("Errore salvataggio evento:", err);
      res.status(400).json({ error: err.message });
    }
  },

  // Aggiorna evento
  POST_update: async (req, res) => {
    try {
      const { _id, userid } = req.body;
      const author = userid;

      const updated = await Event.findOneAndUpdate({ _id, author }, req.body, {
        new: true,
      });

      if (!updated) {
        return res.status(403).json({ error: "Accesso negato" });
      }

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  // Elimina evento
  POST_delete: async (req, res) => {
    try {
      const { _id, author } = req.body;
      const deleted = await Event.findOneAndDelete({ _id, author });
      if (!deleted) return res.status(403).json({ error: "Accesso negato" });
      res.json({ message: "Evento eliminato" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
