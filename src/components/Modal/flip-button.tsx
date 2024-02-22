import React, { useRef, useState } from "react";
import Transition from "../Transition";
import { useMouseInOut } from "../../hooks";
import Button from "../Button";

export function FlipButton() {
	const [visible, setVisible] = useState(true);
	const ref = useRef<HTMLDivElement>(null);
	useMouseInOut(ref, {
		enter: [
			"mouseenter",
			() => {
				setVisible(true);
			},
		],
		leave: [
			"mouseleave",
			() => {
				setVisible(false);
			},
		],
	});
	return (
		<div className="flip-button" ref={ref}>
			<Transition visible={visible} type={"flip"} timeout={300}>
				<Button>123</Button>
			</Transition>
		</div>
	);
}
