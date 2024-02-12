import { useEffect } from "react";
import "./styles/index.scss";
import { Modal, ModalFactory } from "./component";
function App() {
	useEffect(() => {
		const factory = new ModalFactory();
		factory.appendModal("modal", <Modal open={true}>123</Modal>);
	}, []);

	return null;
}

export default App;
