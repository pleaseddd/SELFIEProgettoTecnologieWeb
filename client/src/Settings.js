import { useState } from "react";
import { Container, Form, Button, Card, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmModal from "./components/ConfirmModal";
import ExternalCalsSection from "./components/settings/ExternalCalendars.js";
import NotifSection from "./components/settings/NotifSection.js";
import { DinamicList } from "./utils/reusableComponents.js";
import { useTheme } from "./components/ThemeContext";
import AvatarSelectorModal from "./components/AvatarSelectorModal";
import axios from "axios";
import "./style/settings/Settings.css";
import "./style/settings/personalInfo.css";
import "./style/settings/generals.css";
import "./style/settings/avatarModal.css";

axios.defaults.withCredentials = true;

// Funzione per ottenere il fuso orario basato sulla geolocalizzazione IP
const updatetimezone = async () => {
  try {
    // Ottieni la posizione approssimativa
    const geoRes = await fetch(
      "https://api.ipgeolocation.io/ipgeo?apiKey=ae48adddb3f64feb984decd7b4299e7b"
    );
    const geoData = await geoRes.json();
    return geoData.time_zone.name;
  } catch (err) {
    console.error("Errore geolocalizzazione:", err);
  }
};


// Sezione Informazioni Personali
const PersonalInfoSection = ({
  user,
  form,
  handleSingleChange,
  setShowAvatarSelector,
  notSaved,
  setNotSaved,
}) => {
  return (
    <>
      {notSaved.includes("personalInfo") ? (
        <span className="text-warning text-center">Modifiche non salvate</span>
      ) : null}
      <Card
        className={
          "mb-4 shadow-sm" +
          (notSaved.includes("personalInfo")
            ? "border border-2 border-warning"
            : "")
        }
      >
        <Card.Body>
          <div className="section-title">
            <h5>Informazioni personali</h5>
          </div>

          <div className="pers-form-container">
            <div className="propic-container">
              <Image
                src={user.propic}
                roundedCircle
                width={100}
                height={100}
                alt="Propic"
              />
              <Button
                id="avatar-btn"
                variant="dark"
                size="sm"
                className="change-propic-button"
                onClick={() => setShowAvatarSelector(true)}
              >
                Cambia
              </Button>
            </div>

            <div className="pers-form-fields">
              <div className="pers-form-group">
                <Form.Label className="pers-form-label">Nome</Form.Label>
                <Form.Control
                  type="text"
                  className="pers-form-control"
                  value={form.name}
                  onChange={(e) => {
                    handleSingleChange("name", e.target.value);
                    setNotSaved((prev) => [...prev, "personalInfo"]);
                  }}
                />
              </div>

              <div className="pers-form-group">
                <Form.Label className="pers-form-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  className="pers-form-control"
                  value={form.email}
                  onChange={(e) => {
                    handleSingleChange("email", e.target.value);
                    setNotSaved((prev) => [...prev, "personalInfo"]);
                  }}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

const GeneralsSection = ({
  form,
  handleSingleChange,
  notSaved,
  setNotSaved,
}) => {
  return (
    <>
      {notSaved.includes("generals") ? (
        <span className="text-warning text-center">Modifiche non salvate</span>
      ) : null}
      <Card
        className={
          "mb-4 shadow-sm" +
          (notSaved.includes("generals")
            ? "border border-2 border-warning"
            : "")
        }
      >
        <Card.Body>
          {/* Sezione Generali */}
          <div className="section-title">
            <h5>Generali</h5>
          </div>

          <div className="gen-form-container">
            <Form.Group className="gen-form-group">
              <Form.Label className="gen-form-label">Lingua</Form.Label>
              <Form.Select
                name="language"
                className="gen-form-control"
                value={form.language}
                onChange={(e) => {
                  handleSingleChange("language", e.target.value);
                  setNotSaved((prev) => [...prev, "generals"]);
                }}
              >
                <option value="it">Italiano</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="gen-form-group">
              <Form.Label className="gen-form-label">
                Inizio della settimana
              </Form.Label>
              <Form.Select
                name="weekStart"
                className="gen-form-control"
                value={form.weekStart}
                onChange={(e) => {
                  handleSingleChange("weekStart", e.target.value);
                  setNotSaved((prev) => [...prev, "generals"]);
                }}
              >
                <option value="sunday">Domenica</option>
                <option value="monday">Lunedì</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="gen-form-group">
              <Form.Label className="gen-form-label">Fuso Orario</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  name="location"
                  className="gen-form-control"
                  value={form.location}
                  readOnly
                  placeholder="es. Europe/Rome"
                  style={{ flex: "1" }}
                />
                <Button
                  variant="success"
                  className="ms-2"
                  onClick={async () => {
                    const tz = await updatetimezone();
                    if (tz) {
                      handleSingleChange("location", tz);
                      setNotSaved((prev) => [...prev, "generals"]);
                      toast(`Fuso aggiornato a "${tz}"`, {
                        type: "success",
                        autoClose: 3000,
                      });
                    }
                  }}
                >
                  Fuso Attuale
                </Button>
              </div>
            </Form.Group>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

// Sezione categorie eventi
const EventsSection = ({ form, setForm, notSaved, setNotSaved }) => {
  const [newEventCat, setNewEventCat] = useState("");
  // Aggiunge categoria eventi
  const addEventCategory = () => {
    if (!newEventCat.trim()) {
      toast("Scegli un nome per la tua nuova categoria!", { type: "warning" });
      return;
    }
    const updated = [...form.eventCategories, newEventCat.trim()];
    setForm((prev) => ({ ...prev, eventCategories: updated }));

    setNotSaved((prev) => [...prev, "events"]);

    toast(`Categoria "${newEventCat.trim()}" aggiunta!`, {
      type: "success",
      autoClose: 3000,
    });

    setNewEventCat("");
  };
  // Rimuove categoria eventi
  const removeEventCategory = (index) => {
    const updated = [...form.eventCategories];
    const deleted = updated.splice(index, 1);

    setForm((prev) => ({ ...prev, eventCategories: updated }));
    setNotSaved((prev) => [...prev, "events"]);

    toast(`Categoria "${deleted}" eliminata!`, { type: "success" });
  };

  return (
    <>
      {notSaved.includes("events") ? (
        <span className="text-warning text-center">Modifiche non salvate</span>
      ) : null}
      <Card
        className={
          "mb-4 shadow-sm" +
          (notSaved.includes("events") ? "border border-2 border-warning" : "")
        }
      >
        <Card.Body>
          <div className="section-title">
            <h5>Eventi calendario</h5>
          </div>

          {/* Categorie eventi */}
          <div>
            <h6>Categorie eventi</h6>

            <div className="d-flex mb-2">
              <Form.Control
                type="text"
                placeholder="Aggiungi categoria..."
                value={newEventCat}
                onChange={(e) => setNewEventCat(e.target.value)}
              />
              <Button
                variant="success"
                className="ms-2"
                onClick={addEventCategory}
              >
                Aggiungi
              </Button>
            </div>

            <DinamicList
              list={form.eventCategories}
              removeItem={removeEventCategory}
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
};


//Sezione note per fare modifiche alle categorie note e al numero di note visibili nella home
const NotesSection = ({
  form,
  setForm,
  notSaved,
  setNotSaved,
  handleSingleChange,
}) => {
  const [newNoteCat, setNewNoteCat] = useState("");
  // Aggiunge categoria note
  const addNoteCategory = () => {
    if (!newNoteCat.trim()) {
      toast("Scegli un nome per la tua nuova categoria!", { type: "warning" });
      return;
    }
    const updated = [...form.noteCategories, newNoteCat.trim()];
    setForm((prev) => ({ ...prev, noteCategories: updated }));

    setNotSaved((prev) => [...prev, "notes"]);

    toast(`Categoria "${newNoteCat.trim()}" aggiunta!`, {
      type: "success",
      autoClose: 3000,
    });

    setNewNoteCat("");
  };

  const removeNoteCategory = (index) => {
    const updated = [...form.noteCategories];
    const deleted = updated.splice(index, 1);

    setForm((prev) => ({ ...prev, noteCategories: updated }));
    setNotSaved((prev) => [...prev, "notes"]);

    toast(`Categoria "${deleted}" eliminata!`, { type: "success" });
  };

  return (
    <>
      {//Segnalo che modifiche non sono salvate
      notSaved.includes("notes") ? (
        <span className="text-warning text-center">Modifiche non salvate</span>
      ) : null}
      <Card
        className={
          "mb-4 shadow-sm" +
          (notSaved.includes("notes") ? "border border-2 border-warning" : "")
        }
      >
        <Card.Body>
          <div className="section-title">
            <h5>Note</h5>
          </div>

					{/* Categorie note */}
          <div>
						<h6>Categorie note</h6>
            <div className="d-flex mb-2">
              <Form.Control
                type="text"
                placeholder="Aggiungi categoria..."
                value={newNoteCat}
                onChange={(e) => setNewNoteCat(e.target.value)}
              />
              <Button
                variant="success"
                className="ms-2"
                onClick={addNoteCategory}
              >
                Aggiungi
              </Button>
            </div>

            <DinamicList
              list={form.noteCategories}
              removeItem={removeNoteCategory}
            />
          </div>

          {/* Numero di note visibili nella home */}
          <div>
            <h6>Varie</h6>
            <Form.Label className="mt-2 me-2 mb-0 text-nowrap">
              Note visibili nella home:
            </Form.Label>
            <Form.Control
              type="number"
              name="notesInHome"
              className="underline-input"
              min={1}
              value={form.notesInHome}
              onChange={(e) =>
                handleSingleChange("notesInHome", e.target.value)
              }
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

function Settings({ user, updateUser }) {
  const { themeKey, setThemeKey } = useTheme();

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    eventCategories: user.settings.categoryEvents.split("/") || [], // array di stringhe
    noteCategories: user.settings.categoryNotes.split("/") || [], // array di stringhe
    language: user.settings.language,
    weekStart: user.settings.startDay ? "sunday" : "monday",
    location: user.settings.position,
    notesInHome: user.settings.homeNotes,
  });

  const [notSaved, setNotSaved] = useState([]);

  // Modal per conferma del salvataggio
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [pendingThemeKey, setPendingThemeKey] = useState(null); // scelto ma non applicato
  const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleSingleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarPreviewSelect = (key) => {
    setPendingThemeKey(key);
    setShowAvatarConfirm(true);
    setShowAvatarSelector(false);
  };

  // Salva le impostazioni sul server
  const handleSaveSettings = async () => {
    setLoading(true);
    const payload = {
      user: {
        id: user._id,
        name: form.name,
        email: form.email,
        propic: user.propic,
        settings: {
          categoryEvents: form.eventCategories.join("/"),
          categoryNotes: form.noteCategories.join("/"),
          language: form.language,
          startDay: form.weekStart === "sunday",
          position: form.location,
          homeNotes: form.notesInHome,
          paletteKey: themeKey,
        },
      },
    };

    try {
      // Invia i dati al server per l'aggiornamento
      const data = await fetch("/api/user/updatesettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((resp) => resp.json());

      console.log("Risposta server:", data.message);
      // Aggiorna il contesto utente con i nuovi dati
      const updatedUser = {
        ...user,
        name: form.name,
        email: form.email,
        settings: payload.user.settings,
      };

      updateUser(updatedUser);
      closeConfirm();
      toast("Impostazioni salvate!", { type: "success" });
      setNotSaved([]);
    } catch (error) {
      console.error("Errore salvataggio:", error);
      toast("Errore durante il salvataggio", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (key) => {
    if (!key) return;
    setAvatarLoading(true);

    try {
      const url = `/pfp/${key}.png`;

      await setThemeKey(key); // aggiorna palette locale + server via ThemeContext (updateThemeKey)
      const updatedUserLocal = {
        ...user,
        propic: url,
        settings: { ...user.settings, paletteKey: key },
      };
      updateUser(updatedUserLocal);

      try {
        await axios.post("/api/user/setPaletteKey", { paletteKey: key });
        const refreshed = await axios.get("/api/user/auth", {
          withCredentials: true,
        });
        if (refreshed?.data) updateUser(refreshed.data);
      } catch (serverErr) {
        console.error(
          "Errore salvataggio avatar/palette sul server:",
          serverErr
        );
        toast(
          "Impossibile salvare l'avatar sul server. Aggiornamento locale applicato.",
          { type: "warning" }
        );
      }
    } catch (err) {
      console.error("Errore during avatar set:", err);
      toast("Errore cambiando avatar.", { type: "error" });
    } finally {
      setAvatarLoading(false);
      setShowAvatarConfirm(false);
      setPendingThemeKey(null);
    }
  };

  const handleAvatarCancel = () => {
    setPendingThemeKey(null);
    setShowAvatarConfirm(false);
  };

  return (
    <Container className="mt-4">
      {/* Card principale contenente tutte le sezioni */}
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Impostazioni</h3>

        <PersonalInfoSection
          user={user}
          form={form}
          handleSingleChange={handleSingleChange}
          setShowAvatarSelector={setShowAvatarSelector}
          notSaved={notSaved}
          setNotSaved={setNotSaved}
        />

        <GeneralsSection
          form={form}
          handleSingleChange={handleSingleChange}
          notSaved={notSaved}
          setNotSaved={setNotSaved}
        />

        <EventsSection
          form={form}
          setForm={setForm}
          notSaved={notSaved}
          setNotSaved={setNotSaved}
        />

        <NotesSection
          form={form}
          setForm={setForm}
          handleSingleChange={handleSingleChange}
          notSaved={notSaved}
          setNotSaved={setNotSaved}
        />

        {/* Pulsante Salva */}
        <div className="d-grid mb-4">
          <Button variant="primary" size="lg" onClick={openConfirm}>
            Salva tutte le impostazioni
          </Button>

          <ConfirmModal
            show={showConfirm}
            title="Conferma"
            body="Sei sicuro di voler salvare le impostazioni?"
            confirmText="Salva"
            cancelText="Annulla"
            loading={loading}
            onConfirm={handleSaveSettings}
            onCancel={closeConfirm}
            onClose={closeConfirm}
          />
        </div>

        <NotifSection user={user} updateUser={updateUser} />

        <ExternalCalsSection user={user} updateUser={updateUser} />
      </Card>

      <AvatarSelectorModal
        show={showAvatarSelector}
        onHide={() => setShowAvatarSelector(false)}
        onSelect={handleAvatarPreviewSelect} // riceve la key e apre confirm
        currentKey={user.settings?.paletteKey || themeKey}
      />


      <ConfirmModal
        className="confirm-modal"
        contentClassName="confirm-modal--content"
        show={showAvatarConfirm}
        title={
          <span className="confirm-modal__title">Conferma cambio avatar</span>
        }
        body={
          pendingThemeKey ? (
            <div className="confirm-body" style={{ textAlign: "center" }}>
              <p className="confirm-text">
                Vuoi cambiare avatar in <strong>{pendingThemeKey}</strong>?
              </p>
              <img
                src={`/pfp/${pendingThemeKey}.png`}
                alt={pendingThemeKey}
                style={{ width: 96, height: 96, borderRadius: 999 }}
              />
            </div>
          ) : (
            "Sei sicuro?"
          )
        }
        confirmText="Cambia avatar"
        cancelText="Annulla"
        loading={avatarLoading}
        onConfirm={() => handleAvatarSelect(pendingThemeKey)}
        onCancel={handleAvatarCancel}
        onClose={handleAvatarCancel}
      />
    </Container>
  );
}

export default Settings;
