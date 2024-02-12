import React from "react";
import { ReactElement } from "react";
import ReactDOM from "react-dom";

const modalMap = Symbol("modals");
const instance = Symbol("instance");
const defaultModalsRoot = Symbol("modalsRoot");

interface ModalInfo {
	ref: any;
	modalRoot: HTMLElement;
	key: string;
}

interface ModalFactoryInterface {
	[modalMap]: Map<string, ModalInfo> | null;
	getModalMap(arg: string): void;
	[defaultModalsRoot]: HTMLElement | null;
}

export class ModalFactory implements ModalFactoryInterface {
	static [instance]: ModalFactory | null = null;
	[modalMap]: Map<string, any> | null = null;
	[defaultModalsRoot]: HTMLElement | null = null;
	constructor() {
		if (!ModalFactory[instance]) {
			ModalFactory[instance] = this;
			ModalFactory[instance][modalMap] = new Map();
			let root = document.getElementById("modalsRoot");
			if (!root) {
				root = document.createElement("div");
				root.id = "modalsRoot";
				document.body.appendChild(root);
			}
			ModalFactory[instance][defaultModalsRoot] = root;
		}
		return ModalFactory[instance];
	}

	getModalMap() {
		return this[modalMap];
	}

	appendModal(key: string, modalInstance: ReactElement) {
		const ref = React.createRef();
		const modalRoot = document.createElement("div");
		modalRoot.setAttribute("data-modal-root-id", key);
		modalRoot.style.width = "100vw";
		modalRoot.style.height = "100vh";
		modalRoot.style.position = "relative";
		modalRoot.style.backgroundColor = "orange";
		(this[defaultModalsRoot] as HTMLElement).appendChild(modalRoot);
		const modal = React.cloneElement(modalInstance, { ref });
		ReactDOM.render(modal, modalRoot, () => {
			(this[modalMap] as Map<string, any>).set(key, {
				ref,
				key,
				modalRoot,
			});
			console.log(key, "被挂载");
			console.log("当前modals", this[modalMap]);
			console.log("---");
		});
	}
	closeModal(key: string) {
		const modals = this[modalMap] as Map<string, ModalInfo>;
		const modalInfo = modals.get(key);
		const root = this[defaultModalsRoot] as HTMLElement;
		if (modalInfo) {
			modalInfo.ref.current = null;
			ReactDOM.unmountComponentAtNode(modalInfo.modalRoot);
			modals.delete(key);
			root.removeChild(modalInfo.modalRoot);
			console.log(key, "被卸载");
			console.log("当前modals", this[modalMap]);
			console.log("---");
		}
	}
}
