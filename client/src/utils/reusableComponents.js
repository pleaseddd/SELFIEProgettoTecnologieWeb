import { Form, Button } from 'react-bootstrap';

export const DinamicList = ({ list, removeItem }) => {
	return (
		<div
			style={{
				maxHeight: "120px",
				overflowY: "auto",
				border: "1px solid #ccc",
				borderRadius: "5px",
				padding: "0.5rem",
			}}
		>
			{
				list.map((item, i) => (
					<div
						key={i}
						className="d-flex justify-content-between mb-1"
					>
						<span>{item.toString()}</span>
						<Button
							variant="outline-danger"
							size="sm"
							onClick={() => removeItem(i)}
						>
							Elimina
						</Button>
					</div>
				))
			}
		</div>
	);
};
