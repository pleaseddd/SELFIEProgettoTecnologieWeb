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
	else if(notif.mod == "ripetition" && res[0].substring(0, 2) == '1 ')
		resStr = resStr.substring(2);

	if(notif.mod == "advance")
		return resStr + " prima";
	else {
		return 'ogni '
			+ resStr
			+ ' per '
			+ actualNotif.howMany
			+ ' volt'
			+ (actualNotif.howMany==1 ? 'a' : 'e');
	}
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
	const handleChangeParam = (param, value) => {
		setNewNotif(
			prev => ({
				...prev,
				ripetition: {...prev.ripetition, [param]: value}
			})
		);
	};

	return (
		<>
			<div className="d-flex justify-content-start align-items-center column-gap-1 my-2">
				<div>Ricordamelo per</div>
				<Form.Control
					type="number"
					className="w-25"
					value={newNotif.ripetition.howMany}
					onChange={
						e => handleChangeParam("howMany", e.target.value)
					}
				>
				</Form.Control>
				<div>volte, ogni:</div>
			</div>

			<div className="d-flex flex-column flex-md-row mb-2 gap-2">
				{timeUnits.slice(0, 3).map((timeUnit, i) => (
					<div key={i}>
						<Form.Group
							className="d-flex justify-content-start align-items-center gap-2"
						>
							<Form.Control
								type="number"
								className="w-50"
								value={newNotif.ripetition[timeUnit]}
								onChange={
									e => handleChangeParam(timeUnit, e.target.value)
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
	sendNotifs, setSendNotifs, //Lo stato dello switch per le notifiche
	notifsList, setNotifsList //L'insieme delle notifiche dell'evento
}) => {

	/*
	 * La lista può essere non vuota:
	 * se l'utente modifica un evento
	 * con delle notifiche pre-esistenti,
	 * queste vengono estratte dall'api
	 * in tramite initialData in EventModal.js,
	 * l'unica cosa che faccio in questo if è aggiungere
	 * la funzione .toString() a tutti i suoi elementi,
	 * in quanto la funzione è molto lunga e non avrei
	 * potuto farlo in EventModal.js per non ripetere
	 * la stessa funzione
	 */
	if(notifsList) {
		notifsList.forEach(notif => {
			notif.toString = () => notifsPrettify(notif);
		});
		setNotifsList(notifsList);
	}

	/*
	 * I dati della singola notifica vengono confezionati
	 * in questo modo:
	 * l'utente sceglie se ricerverla prima dell'inizio
	 * ("advance"), o dopo la fine con ripetizione ("ripetition")
	 * e questo valore è la proprietà .mod,
	 * e a seconda di quest'ultimo viene riferito
	 * il suo sotto-oggetto per i dati effettivi.
	 * le proprietà .advance e .ripetition coesistono,
	 * ma solo una di queste è modificata e letta, mentre l'altra
	 * rimane sempre con i valori di default
	 */

	/*
	 * Costruisco l'oggetto con i valori predifiniti
	 * in maniera programmatica, in questo modo
	 * se volessi aggiungere altri parametri
	 * dovrei solo modificare timeUnits
	 */
	const defaults = {
		advance: Object.fromEntries(
			timeUnits.map(timeUnit => [timeUnit, 0])
		),
		ripetition: {
			howMany: 0,
			...Object.fromEntries(
				timeUnits.slice(0, 3).map(timeUnit => [timeUnit, 0])
			)
		}
	};

	const [newNotif, setNewNotif] = useState({
		mod: "advance",
		advance: defaults.advance,
		ripetition: defaults.ripetition,
		toString() { return notifsPrettify(this); }
	});

	//La funzione attivata quando il pulsante "Aggiungi" viene premuto
	const addNotif = () => {
		const mod = newNotif.mod;

		/*
		 * Controlli dei parametri del form:
		 * se anche un controllo non passa,
		 * mando un messaggio di avviso sotto forma di toast
		 * ed esco dalla funzione senza fare nient'altro
		 */

		//Almeno un parametro deve essere maggiore di zero
		const zeroFinds = Object.values(newNotif[mod])
			.reduce((a, c) => a && (c == 0), true);
		if(zeroFinds) {
			toast('Non puoi avere tutti i valori a zero!', { type: 'warning' });
			return;
		}

		//In particolare, il numero di ripetizioni non può mai essere zero
		if(mod == 'ripetition') {
			if(newNotif[mod].howMany == 0) {
				toast('Non puoi avere il numero di ripetizioni a zero!', { type: 'warning' });
				return;
			}
			//E se il numero di ripetizione è maggiore di zero,
			//le unità di tempo devono avere almeno un valore positivo
			else if(
				timeUnits.slice(0, 3)
					.reduce((a, c) => a && (newNotif[mod][c] == 0), true)
			) {
				toast("Almeno un'unità di tempo deve essere positiva!", { type: 'warning' });
				return;
			}
		}

		//E nessun parametro deve essere negativo
		const negativeFinds = Object.values(newNotif[mod])
			.reduce((a, c) => a || (c < 0), false);
		if(negativeFinds) {
			toast('Non puoi avere un valore negativo!', { type: 'warning' });
			return;
		}

		//I dati sono corretti, aggiungo la nuova notifica alle altre
		const updated = [...notifsList, newNotif];
		setNotifsList(updated);

		//Feedback visivo per l'utente
		toast("Notifica aggiunta!", {
			type: 'success',
			autoClose: 3000
		});

		//Resetto i parametri del form
		setNewNotif(prev => ({...prev, [mod]: defaults[mod]}));
	};

	//La funzione per rimuovere una notifica dalla lista
	const removeNotif = (index) => {
	  setNotifsList(notifsList.toSpliced(index, 1));
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
									e => {
										setNewNotif(prev => (
											{...prev, mod: e.target.value }
										));
										setNotifsList([]);
									}
								}
							>
								<option value="advance">
									Prima dell'inizio dell'evento
								</option>
								<option value="ripetition">
									Dopo la fine dell'attività
								</option>
							</Form.Select>

							{newNotif.mod=="advance" && (<>
								<AdvanceSection
									newNotif={newNotif}
									setNewNotif={setNewNotif}
								/>

								<Button
									className="mb-2"
									variant="success"
									onClick={addNotif}
								>
									Aggiungi
								</Button>

								<DinamicList
									list={notifsList}
									removeItem={removeNotif}
								/>
							</>)}

							{newNotif.mod=="ripetition" && (<>
								<RipetitionSection
									newNotif={newNotif}
									setNewNotif={setNewNotif}
								/>

								<Button
									className="mb-2"
									variant="success"
									onClick={addNotif}
								>
									Aggiungi
								</Button>

								<DinamicList
									list={notifsList}
									removeItem={removeNotif}
								/>
							</>)}
						</Form>
					</div>
			)}
	  </>
	);
};

export default NotifsModal;
