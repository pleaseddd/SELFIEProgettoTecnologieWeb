const mongoose = require('mongoose');

//schema per le preferenze utente su durata lavoro e pause
const TimerConfigSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workMinutes: {
    type: Number,
    required: true,
    default: 25
  },
  shortBreakMinutes: {
    type: Number,
    required: true,
    default: 5
  },
  longBreakMinutes: {
    type: Number,
    required: true,
    default: 15
  }
}, { timestamps: true });

//schema per salvare le sessioni pomodoro di un utente
const PomodoroSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cycles: [{
    workDuration: Number,
    breakDuration: Number,
    completed: Boolean
  }],
  currentCycle: Number,
  totalDuration: Number,
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const TimerConfig = mongoose.model('TimerConfig', TimerConfigSchema);
const PomodoroSession = mongoose.model('PomodoroSession', PomodoroSessionSchema);

module.exports = {
  TimerConfig,
  PomodoroSession,

  //salva o aggiorna la configurazione timer di un utente
  POST_config: async (req, res) => {
    try {
      const { userId, workMinutes, shortBreakMinutes, longBreakMinutes } = req.body;
      let cfg = await TimerConfig.findOne({ user: userId });

      if (cfg) {
        cfg.workMinutes = workMinutes;
        cfg.shortBreakMinutes = shortBreakMinutes;
        cfg.longBreakMinutes = longBreakMinutes;
      } else {
        cfg = new TimerConfig({ user: userId, workMinutes, shortBreakMinutes, longBreakMinutes });
      }

      await cfg.save();
      res.status(200).json(cfg);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  //recupera la configurazione timer salvata
  GET_config: async (req, res) => {
    try {
      const { userId } = req.query;
      const cfg = await TimerConfig.findOne({ user: userId });

      if (!cfg) return res.status(404).json({ message: 'Config non trovata' });

      res.status(200).json(cfg);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  //salva una nuova sessione pomodoro
  POST_session: async (req, res) => {
    try {
      const session = new PomodoroSession(req.body);
      await session.save();
      res.status(201).json(session);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  //aggiorna una sessione pomodoro esistente
  PATCH_session: async (req, res) => {
    try {
      const session = await PomodoroSession.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(session);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
