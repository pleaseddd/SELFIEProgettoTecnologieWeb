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
	"months",
];

const notifsPrettify = (notif) => {
	const oneOrMore = (n, str) =>
		n == 1 ? str[str.length-2] : str[str.length-1];

	let res = [];
	const actualNotif = notif[notif.mod];

	[
		'mesei',
		'settimanae',
		'giornoi',
		'orae',
		'minutoi'
	].map((t, i) => [timeUnits.toReversed()[i], t])
		.forEach(timeUnit => {;
			const [objProp, objStr] = timeUnit;
			if(actualNotif[objProp])
				res.push(
					actualNotif[objProp]
					+ ' ' + objStr.slice(0, -2)
					+ oneOrMore(actualNotif[objProp], objStr)
				);
		});

	let resStr = res[0];
	if(res.length > 1)
		resStr = res.slice(0, -1).join(', ') + ' e ' + res.slice(-1);

	return resStr + ' prima';
};

const AdvanceSection = ({ newNotif, setNewNotif}) => {

	const [showMore, setShowMore] = useState(false);

	const handleChangeTimeUnit = (timeUnit, value) => {
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
									e => handleChangeTimeUnit(timeUnit, e.target.value)
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
									e => handleChangeTimeUnit(timeUnit, e.target.value)
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
	const [showMore, setShowMore] = useState(false);

	const handleChangeTimeUnit = (timeUnit, value) => {
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
			<div>Mandami una notifica ogni</div>
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
									e => handleChangeTimeUnit(timeUnit, e.target.value)
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
									e => handleChangeTimeUnit(timeUnit, e.target.value)
								}
							>
							</Form.Control>
							<Form.Label className="mb-0">{timeUnit}</Form.Label>
						</Form.Group>
					</div>
				))}
			</div>
		</>
	);
};

const NotifsModal = ({
	sendNotifs, setSendNotifs,
	notifsList, setNotifsList
}) => {

	if(notifsList) {
		notifsList.forEach(notif => {
			notif.toString = () => notifsPrettify(notif);
		});
		setNotifsList(notifsList);
	}

	const advanceDefault = Object.fromEntries(
		timeUnits.map(timeUnit => [timeUnit, 0])
	);
	const [newNotif, setNewNotif] = useState({
		mod: "advance",
		advance: advanceDefault,
		toString() { return notifsPrettify(this); }
	});

	const addNotif = () => {
		const totalSum = Object.values(newNotif.advance).reduce((a, c) => a+c, 0);
		if(!totalSum) {
			toast('Non puoi avere tutti i valori a zero!', { type: 'warning' });
			return;
		}

		const updated = [...notifsList, newNotif];
		setNotifsList(updated);

		toast("Notifica aggiunta!", {
			type: 'success',
			autoClose: 3000
		});

		setNewNotif(prev => ({...prev, advance: advanceDefault}));
	};

	const removeNotif = (index) => {
		const updated = [...notifsList];
		updated.splice(index, 1);
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
										prev => ({...prev, mod:e.target.id})
									)
								}
							>
								<option value="anticipo" id="advance">
									Con anticipo
								</option>
								<option value="ripetizione" id="ripetition">
									Con ripetizione
								</option>
							</Form.Select>

							{newNotif.mod=="advance" && (
								<AdvanceSection
									newNotif={newNotif}
									setNewNotif={setNewNotif}
								/>
							)}

							{newNotif.mod=="ripetition" && (
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
