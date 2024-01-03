import { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
type TransitionType = "zoom-in-top" | "zoom-in-bottom" | "zoom-in-left" | "zoom-in-right";
interface ITransitionProps {
	visible: boolean;
	children: ReactNode;
	type: TransitionType;
	timeout: number;
}
const Transition: React.FC<ITransitionProps> = (props) => {
	const { visible, children, type, timeout } = props;
	return (
		<CSSTransition in={visible} timeout={timeout} classNames={type} unmountOnExit appear>
			{children}
		</CSSTransition>
	);
};

export default Transition;
