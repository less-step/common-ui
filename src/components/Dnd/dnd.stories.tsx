import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Draggable from "./Draggable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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

export const Primary: Story = {
	args: {} as any,
	render() {
		return (
			<DndProvider backend={HTML5Backend}>
				<Draggable type={"123"} item={1} style={undefined} hideWhenDrag={true} state={undefined}>
					123
				</Draggable>
			</DndProvider>
		);
	},
};
