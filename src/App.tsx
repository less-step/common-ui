import { useEffect } from "react";
import "./styles/index.scss";
import { Button, Modal, ModalFactory } from "./component";
function App() {
	useEffect(() => {
		const factory = new ModalFactory();
		factory.appendModal(
			"modal",
			<Modal open={true} title="标题">
				<Button>123</Button>
			</Modal>,
		);
	}, []);

	return null;
}

export default App;
