import { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
const meta = {
	title: "输入框",
	component: Input,
	tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

export const DefaultInput: StoryObj<typeof meta> = {};
DefaultInput.storyName = "默认输入框";
