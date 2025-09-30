import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "trix/dist/trix.css";
import "trix";
import "../style/addNote.css";

function AddNote({ user, selectedNote, clearSelectedNote }) {
  // Recupero dal USER le categorie possibili per le note e le metto sottoforma di Array per ciclarle 
  const categories = user.settings.categoryNotes.split("/");
  // Variabili per la Nota 
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    text: "",
  });
  const editorRef = useRef(null);
  const [message, setMessage] = useState("");

//Verifica se l'utente sta modificando o meno una nota e nel caso aggiorna le variabili
//di stato con i valori della nota selezionata
  useEffect(() => {
    if (selectedNote) {
      setForm({
        title: selectedNote.title,
        category: selectedNote.category,
        text: selectedNote.body,
      });
      //timeout per verificare il Trix Editor sia caricato prima di settare il contenuto
      setTimeout(() => {
        const editor = document.querySelector("trix-editor");
        if (editor && selectedNote.body) {
          editor.editor.loadHTML(selectedNote.body);
        }
      }, 100);
    } else {
      setForm({ title: "", category: categories[0], text: "" });
    }
  }, [selectedNote]);

//Monta il componente Trix Editor e gestisce gli eventi di cambio
  useEffect(() => {
    const editor = editorRef.current;
    const handleChange = () => {
      const value = document.querySelector("#trix_input").value;
      setForm((prev) => ({ ...prev, text: value }));
    };

    editor?.addEventListener("trix-change", handleChange);

    return () => {
      editor?.removeEventListener("trix-change", handleChange);
    };
  }, []);


  //Personalizzo lo stile del Trix Editor
  //Aggiungo un useEffect per montare gli stili CSS direttamente nel documento
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    trix-toolbar .trix-button {
      font-size: 1.25rem;
      padding: 0.4rem 0.6rem;
    }

    .trix-button-row {
      display: flex;
      gap: 0.3rem; /* spazio tra TUTTI i bottoni, puoi metterlo anche a 0 */
    }

    .trix-button-group {
      margin-right: 0; /* elimina spazio tra gruppi */
    }
      trix-editor {
      min-height: 200px;
      max-height: 200px;
      overflow-y: auto;
      padding: 1rem;
      font-size: 1.1rem;
      border: 1px solid #ced4da;
      border-radius: 0.375rem;
  }
  `;
    document.head.appendChild(style);
  }, []);

  // Gestione dell'aggiunta o modifica della nota
  // In base alla presenza o meno della selectedNote decide se creare una nuova nota o modificarne una esistente
  // Dopo l'operazione ricarica la pagina per aggiornare la lista delle note
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, category, text } = form;
    const userid = user._id;

    const nota = {
      title,
      category,
      body: text,
      userid,
      ...(selectedNote && { noteid: selectedNote._id }),
    };

    //Decide l'endpoint in base alla presenza o meno della selectedNote quindi se modificare o creare una nuova nota
    const endpoint = "/api/notes/" + (selectedNote ? "update" : "new");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nota),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          selectedNote ? "Nota aggiornata!" : "Nota creata con successo!"
        );
        clearSelectedNote();
        setTimeout(() => window.location.reload(), 500);
      } else {
        setMessage("Errore: " + data.message);
      }
    } catch (err) {
      setMessage("Errore di connessione");
    }
  };

  return (
    <div className="card p-4 shadow-lg">
      <h2 className="text-center mb-4">
        {selectedNote ? "Modifica nota" : "Aggiungi nota"}
      </h2>
      {message && <p className="text-center text-success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Titolo</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        {/* Cicla le categorie per creare le opzioni del select */}
        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <select
            className="form-control"
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Corpo</label>
          {/* Personalizzo la barra per il Mark-down */}
          <trix-toolbar id="custom-toolbar">
            <div className="trix-button-row">
              {/* Testo */}
              <span className="trix-button-group trix-button-group--text-tools">
                <button
                  type="button"
                  data-trix-attribute="bold"
                  className="trix-button"
                  title="Grassetto"
                  tabIndex="-1"
                >
                  B
                </button>
                <button
                  type="button"
                  data-trix-attribute="italic"
                  className="trix-button"
                  title="Corsivo"
                  tabIndex="-1"
                >
                  <i>I</i>
                </button>
                <button
                  type="button"
                  data-trix-attribute="strike"
                  className="trix-button"
                  title="Barrato"
                  tabIndex="-1"
                >
                  S
                </button>
              </span>

              {/* Liste */}
              <span className="trix-button-group trix-button-group--list-tools">
                <button
                  type="button"
                  data-trix-attribute="bullet"
                  className="trix-button"
                  title="Elenco puntato"
                  tabIndex="-1"
                >
                  •
                </button>
                <button
                  type="button"
                  data-trix-attribute="number"
                  className="trix-button"
                  title="Elenco numerato"
                  tabIndex="-1"
                >
                  1.
                </button>
              </span>

              {/* Storico */}
              <span className="trix-button-group trix-button-group--history-tools">
                <button
                  type="button"
                  data-trix-action="undo"
                  className="trix-button"
                  title="Annulla"
                  tabIndex="-1"
                >
                  ↺
                </button>
                <button
                  type="button"
                  data-trix-action="redo"
                  className="trix-button"
                  title="Ripeti"
                  tabIndex="-1"
                >
                  ↻
                </button>
              </span>
            </div>
          </trix-toolbar>

          <input
            id="trix_input"
            type="hidden"
            value={form.text}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, text: e.target.value }))
            }
          />
          <trix-editor
            input="trix_input"
            toolbar="custom-toolbar"
            ref={editorRef}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {selectedNote ? "Modifica" : "Aggiungi"}
        </button>
        {/* Bottone per annullare la modifica e tornare alla modalità di aggiunta */}
        {selectedNote && (
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={clearSelectedNote}
          >
            Annulla modifica
          </button>
        )}
      </form>
    </div>
  );
}

export default AddNote;
