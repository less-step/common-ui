import { Meta, StoryObj } from "@storybook/react";
import Button from "./button";
const meta = {
	title: "Button",
	component: Button,
	parameters: {},
	tags: ["autodocs"],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		btnType: "primary",
		children: "测试",
	},
};
Primary.storyName = "主要的";
