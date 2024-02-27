import React, { ReactNode } from "react";
import DndListItem from "./dnd-list-item";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DndListProps {
	direction: "column" | "row";
	list: any[];
	setList: (list: any[] | ((list: any) => any[])) => void;
	titleRender?: (item: any) => ReactNode;
	className?: string;
}
function DndList(props: DndListProps) {
	const { direction, list, setList, titleRender, className } = props;

	const handleDrag = (dragIndex: number, hoverIndex: number) => {
		setList((prev) => {
			const copy = [...prev];
			const listItem = copy[dragIndex];
			// remove origin
			copy.splice(dragIndex, 1);
			// add to target
			copy.splice(hoverIndex, 0, listItem);
			return copy;
		});
	};

	return (
		<DndProvider backend={HTML5Backend}>
			{list.map((item, index) => (
				<DndListItem key={item.key} index={index} item={item} handleDrag={handleDrag} state={list} direction={direction} className={className}>
					{titleRender?.(item) || item.title}
				</DndListItem>
			))}
		</DndProvider>
	);
}

export default DndList;
