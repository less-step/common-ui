import { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
const meta = {
	title: "输入框",
	component: Input,
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: { type: "boolean" },
		},
		size: {
			options: ["mid", "lg", "sm"],
			control: { type: "radio" },
		},
		prepend: {
			control: { type: "text" },
		},
		append: {
			control: { type: "text" },
		},
		placeholder: {
			control: { type: "text" },
		},
		icon: {
			control: { type: "text" },
		},
	},
} satisfies Meta<typeof Input>;

export default meta;

export const DefaultInput: StoryObj<typeof meta> = {};
DefaultInput.storyName = "默认输入框";
