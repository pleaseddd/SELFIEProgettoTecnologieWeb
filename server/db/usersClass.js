//Moduli esterni
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //Per criptare le password
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: { type: String, required: true },

  propic: { type: String, default: "/pfp/avatar1.png" },
  
  google: {
    isLogged: { type: Boolean, default: false },

    tokens: {
      access_token: String,
      refresh_token: String,
    },

    propic: String,
    calendarId: String,

    gmail: {
      address: String,
      notifs: Boolean,
    },
  },

  settings: {
    language: { type: String, default: "italian" },
    categoryNotes: { type: String, default: "appunti/todo" },
    categoryEvents: { type: String, default: "studio/lavoro/sport" },
    startDay: { type: Boolean, default: false }, // false lunedì, true domenica
    position: { type: String, default: "world" },
    homeNotes: { type: Number, default: 3 },
    paletteKey: { type: String, default: "avatar1" },
  },

  lastPomodoroSession: {
    total: { type: Number, default: 0 },
    work: { type: Number, default: 0 },
    break: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
});

//Funzione che viene eseguita prima del salvataggio nel db
//per la criptazione della password
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  }
  catch (error) {
    next(error);
  }
});

UserSchema.methods.checkpw = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("La password non matcha :')");
  }
};

const User = mongoose.model("User", UserSchema);

//Funzioni che si possono usare in file esterni
module.exports = {
  /*
	 * Crea un nuovo utente
	 * @param user: Object, l'oggetto con i dati dell'utente
	 * returns: Object, il nuovo documento della collezione
	 */
  newUser: async (user) => {
    const newuser = new User(user);
    return await newuser.save();
  },

  /*
   * Trova un solo utente specifico
   * @param filter: Object, i parametri di ricerca
   * possono essere 'id' o 'email',
   * in entrambi casi sono valori univoci quindi
   * associato ad un solo utente
   * returns: Object, l'utente trovato
   */
  findBy: async (filter) => {
    if (filter.hasOwnProperty("id")) return await User.findById(filter.id);
    if (filter.hasOwnProperty("email")) return await User.findOne(filter);
  },

  /*
   * Modifica un utente
   * @param filter: Object, i parametri di ricerca
   * @param update: Object, i dati per la modifica
   * returns: Object, l'utente modificato del db
   */
  update: async (filter, update) => {
    return await User.findOneAndUpdate(filter, update);
  },
  
  /*
   * Aggiorna l'associazione utente - account google
   * Dopo che l'utente ha fatto l'accesso a google
   * viene richiamata questa funzione per memorizzare i token
   * @param email: String, l'email dell'utente
   * @param update: Object, i dati dell'account google
   */
  googleLogin: async (email, update) => {
    const filter = { email };
    return await User.findOneAndUpdate(filter, update);
  },

  /*
   * Elimina l'associazione utente - account google
   * i dati dell'account google nel db vengono resettati
   * @param id: String, l'id mongoose dell'utente di riferimento
   * returns: Object, l'utente senza account google
   */
  googleLogout: async (id) => {
    const filter = { _id: id };
    const update = { $set: { google: { isLogged: false } } };
    return await User.findOneAndUpdate(filter, update);
  },

  /*
   * Imposta il calendario google in cui salvare gli eventi
   * @param userid: String, id mongoose dell'utente di riferimento
   * @param calid: String, id del calendario google
   * returns: Object, l'utente aggiornato del db
   */
  setGoogleCal: async (userid, calid) => {
    const filter = { _id: userid };
    const update = { $set: { "google.calendarId": calid } };
    return await User.findOneAndUpdate(filter, update);
  },

  /*
   * Memorizza le ultime impostazioni del pomoodoro
   * @param userid: id mongoose dell'utente di riferimento
   * @param session: Object, i dati delle impostazioni pomodoro
   * returns: Object, l'utente aggiornato del db
   */
  setLastPomodoro: async (userid, session) => {
    const filter = { _id: userid };
    const update = {
      $set: {
        lastPomodoroSession: {
          total: session.totalminutes,
          work: session.w,
          break: session.b,
          updatedAt: new Date(),
        },
      },
    };
    return await User.findOneAndUpdate(filter, update, { new: true });
  },
  
  /*
   * Imposta la palette di colori del sito
   * @param userid: String, id mongoose dell'utente di riferimento
   * @param paletteKey: String, la chiave della palette di colori
   * returns: Object, l'utente aggiornato del db
   */
  setPaletteKey: async (userid, paletteKey) => {
    const url = `/pfp/${paletteKey}.png`;
    const filter = { _id: userid };
    const update = {
      $set: {
        "settings.paletteKey": paletteKey,
        propic: url,
      },
    };

    return await User.findOneAndUpdate(filter, update, { new: true });
  },
};
