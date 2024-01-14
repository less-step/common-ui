import React, { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
type TransitionType = "zoom-in-top" | "zoom-in-bottom" | "zoom-in-left" | "zoom-in-right" | "scale-and-disappear";
interface ITransitionProps {
	visible: boolean;
	children: ReactNode;
	type: TransitionType;
	timeout: number;
	onExited?: () => void;
}
const displayName = "Transition";

const Transition: React.FC<ITransitionProps> = (props) => {
	const { visible, children, type, timeout, onExited } = props;
	return (
		<CSSTransition in={visible} timeout={timeout} classNames={type} unmountOnExit appear onExited={onExited}>
			{children}
		</CSSTransition>
	);
};

Transition.displayName = displayName;
Transition.defaultProps = {
	type: "zoom-in-top",
};
export default Transition;
