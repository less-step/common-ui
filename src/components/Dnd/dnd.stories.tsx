import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DndList from "./dnd-list";

const meta = {
	title: "拖动",
	component: Draggable,
	parameters: {},
	args: {
		children: "拖动",
	},
	argTypes: {
		children: {
			control: "text",
		},
	},
} satisfies Meta<typeof Draggable>;
export default meta;

type Story = StoryObj<typeof meta>;

function DndListStory() {
	const [list, setList] = useState<any[]>([
		{ title: "1", key: "1" },
		{ title: "2", key: "2" },
		{ title: "3", key: "3" },
		{ title: "4", key: "4" },
		{ title: "5", key: "5" },
	]);
	return (
		<DndProvider backend={HTML5Backend}>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<DndList
					direction={"row"}
					list={list}
					setList={setList}
					titleRender={(node) => {
						return <div style={{ width: "100px", height: "100px", backgroundColor: "pink", margin: "0 24px" }}>{node.title}</div>;
					}}
				></DndList>
			</div>
		</DndProvider>
	);
}

export const Primary: Story = {
	args: {} as any,
	render() {
		return <DndListStory />;
	},
};

function DropAndDrag(props) {
	return (
		<Droppable accept="1">
			<Draggable type={"1"} item={undefined} state={undefined}>
				{props.children}
			</Draggable>
		</Droppable>
	);
}

function DefaultDragStory() {
	return Array.from({ length: 3 }).map((_, index) => {
		return (
			<DropAndDrag>
				<div style={{ height: "100px", backgroundColor: "yellow", margin: "24px" }}>{index + 1}</div>
			</DropAndDrag>
		);
	});
}

export const DefaultDrag: Story = {
	args: {} as any,
	render() {
		return (
			<DndProvider backend={HTML5Backend}>
				<DefaultDragStory />
			</DndProvider>
		);
	},
};
