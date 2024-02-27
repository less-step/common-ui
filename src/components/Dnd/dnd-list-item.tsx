import React from "react";
import { useDrop, useDrag } from "react-dnd";
import cls from "classnames";
interface DndListItemProps {
	index: number;
	children: React.ReactNode;
	handleDrag: (dragIndex: number, hoverIndex: number) => void;
	state: any;
	item: any;
	direction: "row" | "column";
	className?: string;
}
function DndListItem(props: DndListItemProps) {
	const { index, item, handleDrag, state, children, direction, className } = props;
	const ref = React.useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: "dnd-list-item",
			item: { ...item, index },
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[item, index],
	);

	const [{ handlerId }, drop] = useDrop(
		() => ({
			accept: "dnd-list-item",
			collect: (monitor) => ({
				handlerId: monitor.getHandlerId(),
			}),
			hover: (item: any, monitor) => {
				if (!ref.current) return;
				const dragIndex = item.index;
				const hoverIndex = index;
				console.log(dragIndex, hoverIndex);
				// Do nothing if target and source are same
				if (dragIndex === hoverIndex) return;
				const hoverRect = ref.current.getBoundingClientRect();
				// Get vertical middle
				const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
				const hoverMiddleX = (hoverRect.right - hoverRect.left) / 2;
				// Determine mouse position
				const clientOffset = monitor.getClientOffset();
				if (!clientOffset) {
					return;
				}
				// Get pixels to the top
				const hoverClientY = clientOffset.y - hoverRect.top;
				const hoverClientX = clientOffset.x - hoverRect.left;
				// Only move when the mouse has crossed half of the items height
				if (direction === "column") {
					if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
						return;
					}
					if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
						return;
					}
				} else {
					console.log(hoverClientX, hoverMiddleX);
					if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
						return;
					}
					if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
						return;
					}
				}
				handleDrag(dragIndex, hoverIndex);
				item.index = hoverIndex;
			},
			drop(item: any, monitor) {
				if (!ref.current) return;
				const dragIndex = item.index;
				const hoverIndex = index;
				console.log(dragIndex, hoverIndex);
				// Do nothing if target and source are same
				if (dragIndex === hoverIndex) return;

				const hoverRect = ref.current.getBoundingClientRect();
				// Get vertical middle
				const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
				const hoverMiddleX = (hoverRect.right - hoverRect.left) / 2;
				// Determine mouse position
				const clientOffset = monitor.getClientOffset();
				if (!clientOffset) {
					return;
				}
				// Get pixels to the top
				const hoverClientY = clientOffset.y - hoverRect.top;
				const hoverClientX = clientOffset.x - hoverRect.left;
				// Only move when the mouse has crossed half of the items height
				if (direction === "column") {
					if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
						return;
					}
					if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
						return;
					}
				} else {
					console.log(hoverClientX, hoverMiddleX);
					if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
						return;
					}
					if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
						return;
					}
				}
				handleDrag(dragIndex, hoverIndex);
				item.index = hoverIndex;
			},
		}),
		[state],
	);

	drag(drop(ref));
	return (
		<div className={cls("dnd-list-item", className)} ref={ref} data-handler-id={handlerId}>
			{children}
		</div>
	);
}

export default DndListItem;
