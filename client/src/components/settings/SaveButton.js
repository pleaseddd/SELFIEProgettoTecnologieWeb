import { useState } from 'react';
import { Button } from 'react-bootstrap';
import ConfirmModal from '../ConfirmModal';

const SaveButton = ({ handleSave, label, confirmLabel }) => {

	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const openConfirm = () => setShowConfirm(true);
	const closeConfirm = () => setShowConfirm(false);

	return (
		<div className="d-grid mt-2">
			<Button variant="primary" size="lg" onClick={openConfirm}>
				{label}
			</Button>

			<ConfirmModal
				show={showConfirm}
				title="Conferma"
				body={confirmLabel}
				confirmText="Salva"
				cancelText="Annulla"
				loading={loading}
				onConfirm={handleSave}
				onCancel={closeConfirm}
				onClose={closeConfirm}
			/>
		</div>
	);
};

export default SaveButton;
