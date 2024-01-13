import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
const meta = {
	title: "输入框",
	component: Input,
	tags: ["autodocs"],
	argTypes: {
		icon: {
			control: "text",
		},
		prepend: {
			control: "text",
		},
		append: {
			control: "text",
		},
		defaultValue: {
			control: "text",
		},
	},
} satisfies Meta<typeof Input>;

export default meta;

export const DefaultInput: StoryObj<typeof meta> = {
	args: {
		onChange(e) {
			console.log(e.target.value);
		},
		value: undefined,
	},
};
DefaultInput.storyName = "默认输入框";

export const InputWithoutValue: StoryObj<typeof meta> = {
	render: (args) => <Input defaultValue="1232222" {...args} />,
};

InputWithoutValue.storyName = "没有value的Input";
