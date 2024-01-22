import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button from "./index";

const meta = {
	title: "按钮",
	component: Button,
	parameters: {},
	args: {
		children: "按钮",
	},
	argTypes: {
		children: {
			control: "text",
		},
	},
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		type: "primary",
	},
};

Primary.storyName = "主要的";

export const SizeController: Story = {
	args: {
		size: "lg",
	},
	render: (args) => <Button {...args} />,
};
SizeController.storyName = "控制大小";

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
Disabled.storyName = "禁用的";

export const Linked: Story = {
	args: {
		type: "link",
	},
};
Linked.storyName = "链接";

export const Danger: Story = {
	args: {
		danger: true,
	},
};
