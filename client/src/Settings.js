import { useState } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Card,
	Modal,
	Image,
} from "react-bootstrap";
import ConfirmModal from "./components/ConfirmModal";
import ExternalCalsSection from "./components/settings/ExternalCalendars.js";
import NotifSection from "./components/settings/NotifSection.js";
import { useTheme } from "./components/ThemeContext";
import AvatarSelectorModal from "./components/AvatarSelectorModal";
import axios from 'axios';
axios.defaults.withCredentials = true;

import './style/Settings.css';

const PersonalInfoSection = ({ user, form, handleSingleChange }) => {
	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="section-title">
					<h5>Informazioni personali</h5>
				</div>

				<div className="form-container">
					<div className="image-container">
						<Image
							src={user.propic}
							roundedCircle
							width={100}
							height={100}
							alt="Propic"
						/>
						<Button
							variant="dark"
							size="sm"
							className="hover-button"
							id="avatar-btn"
						>
							Cambia
						</Button>
					</div>

					<div className="form-fields">
						<div className="form-group">
							<Form.Label className="form-label me-2 mt-2">Nome</Form.Label>
							<Form.Control
								type="text"
								className="form-control"
								value={form.name}
								onChange={(e) => handleSingleChange("name", e.target.value)}
							/>
						</div>

						<div className="form-group">
							<Form.Label className="form-label me-2 mt-2">Email</Form.Label>
							<Form.Control
								type="email"
								className="form-control"
								value={form.email}
								onChange={(e) => handleSingleChange("email", e.target.value)}
							/>
						</div>
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

const EventsSection = ({ form, setForm }) => {

	const [newEventCat, setNewEventCat] = useState("");

	const addEventCategory = () => {
		if (!newEventCat.trim()) return;
		const updated = [...form.eventCategories, newEventCat.trim()];
		setForm((prev) => ({ ...prev, eventCategories: updated }));
		setNewEventCat("");
	};

	const removeEventCategory = (index) => {
		const updated = [...form.eventCategories];
		updated.splice(index, 1);
		setForm((prev) => ({ ...prev, eventCategories: updated }));
	};

	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="section-title">
					<h5>Eventi calendario</h5>
				</div>

				{/* Categorie eventi */}
				<Form.Group className="mb-3">
					<Form.Label>Categorie eventi</Form.Label>
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
					<div
						style={{
							maxHeight: "120px",
							overflowY: "auto",
							border: "1px solid #ccc",
							borderRadius: "5px",
							padding: "0.5rem",
						}}
					>
						{form.eventCategories.map((cat, i) => (
							<div key={i} className="d-flex justify-content-between mb-1">
								<span>{cat}</span>
								<Button
									variant="outline-danger"
									size="sm"
									onClick={() => removeEventCategory(i)}
								>
									Elimina
								</Button>
							</div>
						))}
					</div>
				</Form.Group>
			</Card.Body>
		</Card>
	);
};

const NotesSection = ({ form, setForm }) => {
	const [newNoteCat, setNewNoteCat] = useState("");

	const addNoteCategory = () => {
		if (!newNoteCat.trim()) return;
		const updated = [...form.noteCategories, newNoteCat.trim()];
		setForm((prev) => ({ ...prev, noteCategories: updated }));
		setNewNoteCat("");
	};

	const removeNoteCategory = (index) => {
		const updated = [...form.noteCategories];
		updated.splice(index, 1);
		setForm((prev) => ({ ...prev, noteCategories: updated }));
	};

	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="section-title">
					<h5>Note</h5>
				</div>

				<Form.Group className="mb-3">
					<Form.Label>Categorie note</Form.Label>
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
					<div
						style={{
							maxHeight: "120px",
							overflowY: "auto",
							border: "1px solid #ccc",
							borderRadius: "5px",
							padding: "0.5rem",
						}}
					>
						{form.noteCategories.map((cat, i) => (
							<div key={i} className="d-flex justify-content-between mb-1">
								<span>{cat}</span>
								<Button
									variant="outline-danger"
									size="sm"
									onClick={() => removeNoteCategory(i)}
								>
									Elimina
								</Button>
							</div>
						))}
					</div>
				</Form.Group>
			</Card.Body>
		</Card>
	);
};

const MiscellaneousSection = ({ form, handleSingleChange }) => {
	return (
		<Card className="mb-4 shadow-sm">
			<Card.Body>
				<div className="section-title">
					<h5>Varie ed eventuali</h5>
				</div>

				<Form.Group className="mb-3">
					<Form.Label>Lingua</Form.Label>
					<Form.Select
						name="language"
						value={form.language}
						onChange={(e) => handleSingleChange("language", e.target.value)}
					>
						<option value="it">Italiano</option>
						<option value="en">Inglese</option>
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Inizio della settimana</Form.Label>
					<Form.Select
						name="weekStart"
						value={form.weekStart}
						onChange={(e) => handleSingleChange("weekStart", e.target.value)}
					>
						<option value="sunday">Domenica</option>
						<option value="monday">Lunedì</option>
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Posizione</Form.Label>
					<Form.Control
						type="text"
						name="location"
						value={form.location}
						onChange={(e) => handleSingleChange("location", e.target.value)}
						placeholder="es. Milano, Roma"
					/>
				</Form.Group>

				<Form.Group className="mb-4">
					<Form.Label>Note visibili nella home</Form.Label>
					<Form.Control
						type="number"
						name="notesInHome"
						min={1}
						value={form.notesInHome}
						onChange={(e) => handleSingleChange("notesInHome", e.target.value)}
					/>
				</Form.Group>
			</Card.Body>
		</Card>
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

	const [newEventCat, setNewEventCat] = useState("");
	const [newNoteCat, setNewNoteCat] = useState("");

	// Modal per conferma
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const openConfirm = () => setShowConfirm(true);
	const closeConfirm = () => setShowConfirm(false);

	const [showAvatarSelector, setShowAvatarSelector] = useState(false);
	const [pendingThemeKey, setPendingThemeKey] = useState(null);
	const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);

	const handleSingleChange = (name, value) => {
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const addEventCategory = () => {
		if (!newEventCat.trim()) return;
		const updated = [...form.eventCategories, newEventCat.trim()];
		setForm((prev) => ({ ...prev, eventCategories: updated }));
		setNewEventCat("");
	};

	const removeEventCategory = (index) => {
		const updated = [...form.eventCategories];
		updated.splice(index, 1);
		setForm((prev) => ({ ...prev, eventCategories: updated }));
	};

	const addNoteCategory = () => {
		if (!newNoteCat.trim()) return;
		const updated = [...form.noteCategories, newNoteCat.trim()];
		setForm((prev) => ({ ...prev, noteCategories: updated }));
		setNewNoteCat("");
	};

	const removeNoteCategory = (index) => {
		const updated = [...form.noteCategories];
		updated.splice(index, 1);
		setForm((prev) => ({ ...prev, noteCategories: updated }));
	};

	const handleSaveSettings = async () => {
		setLoading(true);

		const payload = {
			user: {
				id: user._id,
				name: form.name,
				email: form.email,
				propic: user.propic,  // filename salvato in user.propic
				settings: {
					categoryEvents: form.eventCategories.join("/"),
					categoryNotes: form.noteCategories.join("/"),
					language: form.language,
					startDay: form.weekStart === "sunday",
					position: form.location,
					homeNotes: form.notesInHome,
					paletteKey: themeKey,  //stringa come "avatar2"
				},
			},
		};
		// Modal per conferma
		const [showConfirm, setShowConfirm] = useState(false);
		const [loading, setLoading] = useState(false);
		const openConfirm = () => setShowConfirm(true);
		const closeConfirm = () => setShowConfirm(false);

		const handleSingleChange = (name, value) => {
			setForm((prev) => ({ ...prev, [name]: value }));
		};

		const handleSaveSettings = async () => {
			setLoading(true);
			const payload = {
				user: {
					id: user._id,
					name: form.name,
					email: form.email,
					settings: {
						categoryEvents: form.eventCategories.join("/"),
						categoryNotes: form.noteCategories.join("/"),
						language: form.language,
						startDay: form.weekStart === "sunday",
						position: form.location,
						homeNotes: form.notesInHome,
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

				try {
					const res = await fetch("/updatesettings", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(payload),
					});

					const data = await res.json();
					console.log("Risposta server:", data);

					const updatedUser = {
						...user,
						name: form.name,
						email: form.email,
						settings: payload.user.settings,
					};

					updateUser(updatedUser);
					closeConfirm();
					alert("Impostazioni salvate!");
				} catch (error) {
					console.error("Errore salvataggio:", error);
					alert("Errore durante il salvataggio.");
				} finally {
					setLoading(false);
				}
			};

			const handleAvatarSelect = async (key) => {
				//client: aggiorna tema + propic in locale
				const url = `/pfp/${key}.png`;
				setThemeKey(key);
				updateUser({ ...user, propic: url, settings: { ...user.settings, paletteKey: key }, });

				//server: chiama endpoint e cattura risposta
				try {
					const res = await axios.post("/api/user/setPaletteKey", { paletteKey: key });
					//res.data è l’utente aggiornato
					updateUser(res.data);
				} catch (err) {
					console.error(err);
				}

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
						/>

						<div className="d-flex align-items-center mb-4">
							<h5 className="section-title position-relative">
								Informazioni personali
							</h5>
						</div>

						<Row className="mb-4">
							<Col md={4} className="text-center">
								<div className="position-relative d-inline-block">
									<Image
										src={user.propic}
										roundedCircle
										width={100}
										height={100}
										alt="Profilo"
									/>
									<Button
										variant="dark"
										size="sm"
										className="position-absolute top-50 start-50 translate-middle opacity-75"
										onClick={() => setShowAvatarSelector(true)}
									>
										Cambia
									</Button>
								</div>
							</Col>
							<Col md={8}>
								<Row className="mb-3">
									<Col md={6}>
										<Form.Label>Nome</Form.Label>
										<Form.Control
											type="text"
											value={form.name}
											onChange={(e) => handleSingleChange("name", e.target.value)}
										/>
									</Col>
									<Col md={6}>
										<Form.Label>Email</Form.Label>
										<Form.Control
											type="email"
											value={form.email}
											onChange={(e) => handleSingleChange("email", e.target.value)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>

					</Card.Body>
				</Card>

				{/* Sezione degli eventi del calendario */ }
			<Card className="mb-4 shadow-sm">
				<Card.Body>

					<div className="d-flex align-items-center mb-4">
						<h5 className="section-title position-relative">
							Eventi calendario
						</h5>
					</div>

					{/* Categorie eventi */}
					<Form.Group className="mb-3">
						<Form.Label>Categorie eventi</Form.Label>
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
						<div
							style={{
								maxHeight: "120px",
								overflowY: "auto",
								border: "1px solid #ccc",
								borderRadius: "5px",
								padding: "0.5rem",
							}}
						>
							{form.eventCategories.map((cat, i) => (
								<div key={i} className="d-flex justify-content-between mb-1">
									<span>{cat}</span>
									<Button
										variant="outline-danger"
										size="sm"
										onClick={() => removeEventCategory(i)}
									>
										Elimina
									</Button>
								</div>
							))}
						</div>
					</Form.Group>
				</Card.Body>
			</Card>

			{/* Sezione delle note */ }
			<Card className="mb-4 shadow-sm">
				<Card.Body>
					<div className="d-flex align-items-center mb-4">
						<h5 className="section-title position-realative">
							Note
						</h5>
					</div>

					<Form.Group className="mb-3">
						<Form.Label>Categorie note</Form.Label>
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
						<div
							style={{
								maxHeight: "120px",
								overflowY: "auto",
								border: "1px solid #ccc",
								borderRadius: "5px",
								padding: "0.5rem",
							}}
						>
							{form.noteCategories.map((cat, i) => (
								<div key={i} className="d-flex justify-content-between mb-1">
									<span>{cat}</span>
									<Button
										variant="outline-danger"
										size="sm"
										onClick={() => removeNoteCategory(i)}
									>
										Elimina
									</Button>
								</div>
							))}
						</div>
					</Form.Group>
				</Card.Body>
			</Card>

			{/* Sezione delle altre impostazioni */ }
				<Card className="mb-4 shadow-sm">
					<Card.Body>

						<div className="d-flex align-items-center mb-4">
							<h5 className="position-relative">
								Varie ed eventuali
							</h5>
						</div>

						<Form.Group className="mb-3">
							<Form.Label>Lingua</Form.Label>
							<Form.Select
								name="language"
								value={form.language}
								onChange={(e) => handleSingleChange("language", e.target.value)}
							>
								<option value="it">Italiano</option>
								<option value="en">Inglese</option>
							</Form.Select>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Inizio della settimana</Form.Label>
							<Form.Select
								name="weekStart"
								value={form.weekStart}
								onChange={(e) => handleSingleChange("weekStart", e.target.value)}
							>
								<option value="sunday">Domenica</option>
								<option value="monday">Lunedì</option>
							</Form.Select>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Posizione</Form.Label>
							<Form.Control
								type="text"
								name="location"
								value={form.location}
								onChange={(e) => handleSingleChange("location", e.target.value)}
								placeholder="es. Milano, Roma"
							/>
						</Form.Group>

						<Form.Group className="mb-4">
							<Form.Label>Note visibili nella home</Form.Label>
							<Form.Control
								type="number"
								name="notesInHome"
								min={1}
								value={form.notesInHome}
								onChange={(e) => handleSingleChange("notesInHome", e.target.value)}
							/>
						</Form.Group>
					</Card.Body>
				</Card>

				<NotifSection user={user} />

				<ExternalCalsSection user={user} updateUser={updateUser} />

			{/* Pulsante Salva */ }
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
			</Card >
			<AvatarSelectorModal
				show={showAvatarSelector}
				onHide={() => setShowAvatarSelector(false)}
				onSelect={(key) => {
					setPendingThemeKey(key);
					setShowAvatarConfirm(true);
				}}
			/>

			<Modal show={showAvatarConfirm} onHide={() => setShowAvatarConfirm(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Conferma cambio avatar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Cambiando immagine profilo cambieranno anche i temi di SELFIE. Continuare?
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => {
							setPendingThemeKey(null);
							setShowAvatarConfirm(false);
						}}
					>
						Annulla
					</Button>
					<Button variant="primary" onClick={() => handleAvatarSelect(pendingThemeKey)}>
						Conferma
					</Button>
				</Modal.Footer>
			</Modal>

			<style>{`
        .position-relative:hover #avatar-btn {
          display: block !important;
        }
      `}</style>
		</Container >
	);
}

export default Settings;
