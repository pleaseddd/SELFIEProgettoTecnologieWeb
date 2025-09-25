import Switch from "react-switch";

const NotifsModal = ({ user, sendNotifs, setSendNotifs }) => {
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
					Manda notifiche
				</div>
			)}
	  </>
	);
};

export default NotifsModal;
