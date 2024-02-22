import React, { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import cls from "classnames";
export interface DraggableProps {
	children: React.ReactNode;
	type: string;
	item: any;

	style?: CSSProperties;
	hideWhenDrag?: boolean;
	state: any;
}

function Draggable(props: DraggableProps) {
	const { children, type, item, style, hideWhenDrag, state } = props;
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type,
			item,
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[state],
	);

	const classNames = cls("dnd-draggable", {
		isDragging,
	});
	return (
		<span className={classNames} style={style} ref={drag} hidden={isDragging && hideWhenDrag}>
			{children}
		</span>
	);
}

export default Draggable;
