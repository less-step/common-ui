import { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./menu";
import React from "react";
const meta = {
	title: "菜单",
	component: Menu,
	parameters: {},
	tags: ["autodocs"],
	args: {
		defaultActiveKey: "0",
	},
	argTypes: {},
} satisfies Meta<typeof Menu>;

export default meta;

export const Horizontal: StoryObj<typeof meta> = {
	render: (args) => {
		return (
			<Menu {...args}>
				<Menu.Item>1</Menu.Item>
				<Menu.Item>2</Menu.Item>
				<Menu.Item>3</Menu.Item>
				<Menu.Item>4</Menu.Item>
				<Menu.Item>5</Menu.Item>
			</Menu>
		);
	},
};
Horizontal.storyName = "水平的";
Horizontal.parameters = {
	backgrounds: {
		values: [
			{
				name: "red",
				value: "#f00",
			},
			{
				name: "green",
				value: "#0f0",
			},
		],
	},
};
