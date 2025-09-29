import { useState } from "react";
import {
	Container,
	Form,
	Button,
	Card,
	Image
} from "react-bootstrap";

import { toast } from 'react-toastify';

import ConfirmModal from "./components/ConfirmModal";
import ExternalCalsSection from "./components/settings/ExternalCalendars.js";
import NotifSection from "./components/settings/NotifSection.js";

import { DinamicList } from './utils/reusableComponents.js';

import { useTheme } from "./components/ThemeContext";
import AvatarSelectorModal from "./components/AvatarSelectorModal";
import axios from 'axios';

import './style/settings/Settings.css';
import './style/settings/personalInfo.css';
import './style/settings/generals.css';
import './style/settings/avatarModal.css';

axios.defaults.withCredentials = true;

const PersonalInfoSection = ({
	user,
	form,
	handleSingleChange,
	setShowAvatarSelector,
	notSaved,
	setNotSaved
}) => {
	return (
		<>
			{
				notSaved.includes("personalInfo") ?
					(
						<span className="text-warning text-center">
							Modifiche non salvate
						</span>
					) : null
			}
			<Card
				className={
					"mb-4 shadow-sm"
					+ (notSaved.includes("personalInfo") ?
						"border border-2 border-warning" : "")
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
										setNotSaved(prev => [...prev, "personalInfo"]);
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
										setNotSaved(prev => [...prev, "personalInfo"]);
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
	setNotSaved
}) => {
	return (
		<>
			{
				notSaved.includes("generals") ?
					(
						<span className="text-warning text-center">
							Modifiche non salvate
						</span>
					) : null
			}
			<Card
				className={
					"mb-4 shadow-sm"
					+ (notSaved.includes("generals") ?
						"border border-2 border-warning" : "")
				}
			>
				<Card.Body>
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
									setNotSaved(prev => [...prev, "generals"]);
								}}
							>
								<option value="it">Italiano</option>
								<option value="en">Inglese</option>
							</Form.Select>
						</Form.Group>

						<Form.Group className="gen-form-group">
							<Form.Label className="gen-form-label">Inizio della settimana</Form.Label>
							<Form.Select
								name="weekStart"
								className="gen-form-control"
								value={form.weekStart}
								onChange={(e) => {
									handleSingleChange("weekStart", e.target.value);
									setNotSaved(prev => [...prev, "generals"]);
								}}
							>
								<option value="sunday">Domenica</option>
								<option value="monday">Lunedì</option>
							</Form.Select>
						</Form.Group>

						<Form.Group className="gen-form-group">
							<Form.Label className="gen-form-label">Posizione</Form.Label>
							<Form.Control
								type="text"
								name="location"
								className="gen-form-control"
								value={form.location}
								onChange={(e) => {
									handleSingleChange("location", e.target.value);
									setNotSaved(prev => [...prev, "generals"]);
								}}
								placeholder="es. Milano, Roma"
							/>
						</Form.Group>
					</div>
				</Card.Body>
			</Card>
		</>
	);
};

const EventsSection = ({
	form,
	setForm,
	notSaved,
	setNotSaved
}) => {

	const [newEventCat, setNewEventCat] = useState("");

	const addEventCategory = () => {
		if (!newEventCat.trim()) {
			toast('Scegli un nome per la tua nuova categoria!', { type: 'warning' });
			return;
		}
		const updated = [...form.eventCategories, newEventCat.trim()];
		setForm((prev) => ({ ...prev, eventCategories: updated }));

		setNotSaved(prev => [...prev, "events"]);

		toast(`Categoria "${newEventCat.trim()}" aggiunta!`, {
			type: 'success',
			autoClose: 3000
		});

		setNewEventCat("");
	};

	const removeEventCategory = (index) => {
		const updated = [...form.eventCategories];
		const deleted = updated.splice(index, 1);

		setForm((prev) => ({ ...prev, eventCategories: updated }));
		setNotSaved(prev => [...prev, "events"]);

		toast(`Categoria "${deleted}" eliminata!`, { type: 'success' });
	};

	return (
		<>
			{
				notSaved.includes("events") ?
					(
						<span className="text-warning text-center">
							Modifiche non salvate
						</span>
					) : null
			}
			<Card
				className={
					"mb-4 shadow-sm"
					+ (notSaved.includes("events") ?
						"border border-2 border-warning" : "")
				}
			>
				<Card.Body>
					<div className="section-title">
						<h5>Eventi calendario</h5>
					</div>

					{/* Categorie eventi */}
					<fieldset className="fieldset-custom">
						<legend className="legend-custom">Categorie eventi</legend>

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
					</fieldset>
				</Card.Body>
			</Card>
		</>
	);
};

const NotesSection = ({
	form,
	setForm,
	notSaved,
	setNotSaved,
	handleSingleChange
}) => {
	const [newNoteCat, setNewNoteCat] = useState("");

	const addNoteCategory = () => {
		if (!newNoteCat.trim()) {
			toast('Scegli un nome per la tua nuova categoria!', { type: 'warning' });
			return;
		}
		const updated = [...form.noteCategories, newNoteCat.trim()];
		setForm((prev) => ({ ...prev, noteCategories: updated }));

		setNotSaved(prev => [...prev, "notes"]);

		toast(`Categoria "${newNoteCat.trim()}" aggiunta!`, {
			type: 'success',
			autoClose: 3000
		});

		setNewNoteCat("");
	};

	const removeNoteCategory = (index) => {
		const updated = [...form.noteCategories];
		const deleted = updated.splice(index, 1);

		setForm((prev) => ({ ...prev, noteCategories: updated }));
		setNotSaved(prev => [...prev, "notes"]);

		toast(`Categoria "${deleted}" eliminata!`, { type: 'success' });
	};

	return (
		<>
			{
				notSaved.includes("notes") ?
					(
						<span className="text-warning text-center">
							Modifiche non salvate
						</span>
					) : null
			}
			<Card
				className={
					"mb-4 shadow-sm"
					+ (notSaved.includes("notes") ?
						"border border-2 border-warning" : "")
				}
			>
				<Card.Body>
					<div className="section-title">
						<h5>Note</h5>
					</div>

					<fieldset className="fieldset-custom mb-2">
						<legend className="legend-custom">Categorie note</legend>
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
					</fieldset>

					<fieldset className="fieldset-custom d-flex">
						<legend className="legend-custom">Varie</legend>
						<Form.Label className="mt-2 me-2 mb-0 text-nowrap">
							Note visibili nella home:
						</Form.Label>
						<Form.Control
							type="number"
							name="notesInHome"
							className="underline-input"
							min={1}
							value={form.notesInHome}
							onChange={(e) => handleSingleChange("notesInHome", e.target.value)}
						/>
					</fieldset>
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
		eventCategories: user.settings.categoryEvents.split("/") || [],
		noteCategories: user.settings.categoryNotes.split("/") || [],
		language: user.settings.language,
		weekStart: user.settings.startDay ? "sunday" : "monday",
		location: user.settings.position,
		notesInHome: user.settings.homeNotes,
	});

	const [notSaved, setNotSaved] = useState([]);

	// Modal per conferma
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
			const data = await fetch("/api/user/updatesettings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}).then(resp => resp.json());

			console.log("Risposta server:", data.message);

			const updatedUser = {
				...user,
				name: form.name,
				email: form.email,
				settings: payload.user.settings,
			};

			updateUser(updatedUser);
			closeConfirm();
			toast("Impostazioni salvate!", { type: 'success' });
			setNotSaved([]);
		} catch (error) {
			console.error("Errore salvataggio:", error);
			toast("Errore durante il salvataggio", { type: 'error' });
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
				const refreshed = await axios.get("/api/user/auth", { withCredentials: true });
				if (refreshed?.data) updateUser(refreshed.data);
			} catch (serverErr) {
				console.error("Errore salvataggio avatar/palette sul server:", serverErr);
				toast("Impossibile salvare l'avatar sul server. Aggiornamento locale applicato.", { type: "warning" });
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
					<Button
						variant="primary"
						size="lg"
						onClick={openConfirm}
					>
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

				<NotifSection
					user={user}
					updateUser={updateUser}
				/>

				<ExternalCalsSection
					user={user}
					updateUser={updateUser}
				/>
			</Card>

			<AvatarSelectorModal
				show={showAvatarSelector}
				onHide={() => setShowAvatarSelector(false)}
				onSelect={handleAvatarPreviewSelect} // riceve la key e apre confirm
				currentKey={user.settings?.paletteKey || themeKey}
			/>

			<ConfirmModal
				className="confirm-modal"
				show={showAvatarConfirm}
				title="Conferma cambio avatar"
				body={
					pendingThemeKey ? (
						<div className="confirm-body" style={{ textAlign: "center" }}>
							<p className="confirm-text">Vuoi cambiare avatar in <strong>{pendingThemeKey}</strong>?</p>
							<img
								src={`/pfp/${pendingThemeKey}.png`}
								alt={pendingThemeKey}
								style={{ width: 96, height: 96, borderRadius: 999 }}
							/>
						</div>
					) : "Sei sicuro?"
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
