import React from "react";
import { useDrop } from "react-dnd";
import cls from "classnames";
function Droppable({ accept, handleDrop, text, children, state, style }) {
	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept,
			drop: (item, monitor) => handleDrop(item, monitor, state),
			collect: (monitor) => ({
				isOver: !!monitor.isOver({ shallow: true }),
				canDrop: !!monitor.canDrop(),
			}),
		}),
		[state], // Dependency
	);

	const isActive = isOver && canDrop;
	const classNames = cls("dnd-droppable", {
		can: canDrop,
		over: isActive,
	});
	return (
		<div className={classNames} style={style} ref={drop}>
			<div>{text}</div>
			{children}
		</div>
	);
}

export default Droppable;
