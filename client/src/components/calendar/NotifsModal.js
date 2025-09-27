import { useState } from 'react';
import Switch from "react-switch";
import { DinamicList} from '../../utils/reusableComponents';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const timeUnits = [
	"minutes",
	"hours",
	"days",
	"weeks",
	"months"
];

const AdvanceSection = ({ newNotif, setNewNotif}) => {

	const [showMore, setShowMore] = useState(false);

	const handleTimeUnitChange = (timeUnit, value) => {
		setNewNotif(
			prev => ({
				...prev,
				advance: {...prev.advance, [timeUnit]: value}
			})
		);
	};

	const handleClickShowMore = () => {
		setShowMore(!showMore);
	};

	return (
		<>
			<div>Mandami una notifica</div>
			<div className="d-flex flex-column flex-md-row mb-2 gap-2">
				{timeUnits.slice(0, 3).map((timeUnit, i) => (
					<div key={i}>
						<Form.Group
							className="d-flex justify-content-start align-items-center gap-2"
						>
							<Form.Control
								type="number"
								className="w-50"
								value={newNotif.advance[timeUnit]}
								onChange={
									e => handleTimeUnitChange(timeUnit, e.target.value)
								}
							>
							</Form.Control>
							<Form.Label className="mb-0">{timeUnit}</Form.Label>
						</Form.Group>
					</div>
				))}
			</div>

			<Button
				className="mb-2"
				onClick={handleClickShowMore}
				size="sm"
			>
				{showMore ? "Nascondi" : "Mostra altro"}
			</Button>

			<div className="d-flex flex-column flex-md-row mb-2 gap-2">
				{showMore && timeUnits.slice(3).map((timeUnit, i) => (
					<div key={i}>
						<Form.Group
							className="d-flex justify-content-start align-items-center column-gap-2"
						>
							<Form.Control
								type="number"
								className="w-50"
								value={newNotif.advance[timeUnit]}
								onChange={
									e => handleTimeUnitChange(timeUnit, e.target.value)
								}
							>
							</Form.Control>
							<Form.Label className="mb-0">{timeUnit}</Form.Label>
						</Form.Group>
					</div>
				))}
			</div>
			<div>prima</div>
		</>
	);
};

const RipetitionSection = ({ newNotif, setNewNotif}) => {
	return (
		<div>
			Hai scelto con ripetizione
		</div>
	);
};

const NotifsModal = ({
	user,
	sendNotifs,
	setSendNotifs,
	notifsForm,
	setNotifsForm
}) => {

	const [notifsList, setNotifsList] = useState([]);

	const advanceDefault = Object.fromEntries(timeUnits.map(x => [x, 0]));
	const [newNotif, setNewNotif] = useState({
		mod: "anticipo",
		advance: advanceDefault,
		toString() {
			console.log(this);
			let l = [];
			timeUnits.forEach(timeUnit => {
				if(this.advance[timeUnit] != 0)
					l.push(`${this.advance[timeUnit]} ${timeUnit}`);
			});
			return l.join(', ');
		}
	});

	const addNotif = () => {
		const updated = [...notifsList, newNotif];
		setNotifsList(updated);
		console.log(notifsList);
		// if (!newEventCat.trim()) {
		// 	toast('Scegli un nome per la tua nuova categoria!', { type: 'warning' });
		// 	return;
		// }

		toast("Notifica aggiunta!", {
			type: 'success',
			autoClose: 3000
		});

		setNewNotif(prev => ({...prev, advance: advanceDefault}));
	};

	const removeNotif = (index) => {
		const updated = [...notifsList];
		const deleted = updated.splice(index, 1);
	  setNotifsList(updated);
		toast("Notifica eliminata!", { type: 'success' });
	};

	return (
		<>
			<div className="mb-3">
		    <div className="d-flex align-items-center">
		      <Switch
		        className="me-2"
		        id="notifs"
		        onChange={() => setSendNotifs(!sendNotifs)}
		        checked={sendNotifs}
		        onColor="#3788d8"
		        offColor="#ccc"
		        uncheckedIcon={false}
		        checkedIcon={false}
		      />
		      <label
		        className="form-check-label mb-0"
		        htmlFor="notifs"
		      >
						Notifiche
		      </label>
		    </div>
		  </div>

		  {sendNotifs && (
					<div>
						<Form className="border border-1 rounded-1 p-2 mb-2">
							<Form.Select
								aria-label="default select"
								onChange={
									e => setNewNotif(
										prev => ({...prev, mod:e.target.value})
									)
								}
							>
								<option value="anticipo">
									Con anticipo
								</option>
								<option value="ripetizione">
									Con ripetizione
								</option>
							</Form.Select>

							{newNotif.mod=="anticipo" && (
								<AdvanceSection
									newNotif={newNotif}
									setNewNotif={setNewNotif}
								/>
							)}

							{newNotif.mod=="ripetizione" && (
								<RipetitionSection
									newNotif={newNotif}
									setNewNotif={setNewNotif}
								/>
							)}

							<Button
								variant="success"
								onClick={addNotif}
							>
								Aggiungi
							</Button>
						</Form>

						<DinamicList
							list={notifsList}
							removeItem={removeNotif}
						/>
					</div>
			)}
	  </>
	);
};

export default NotifsModal;
