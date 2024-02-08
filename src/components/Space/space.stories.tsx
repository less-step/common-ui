import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Space, SpaceProps } from "./space";
import Button from "../Button";
import Icon from "../Icon";

const meta = {
	title: "间隔",
	component: Space,
	tags: ["autodocs"],
} satisfies Meta<typeof Space>;

export default meta;

function DefaultModalComponent(props: SpaceProps) {
	return (
		<Space {...props}>
			<Button>123</Button>
			<Icon icon="coffee" />
			<Icon icon="coffee" />
			<Icon icon="coffee" />
			<Icon icon="coffee" />
		</Space>
	);
}

export const DefaultModal: StoryObj<typeof meta> = {
	args: {
		size: "sm",
	},
	render(args) {
		return <DefaultModalComponent {...args} />;
	},
};

DefaultModal.storyName = "默认间隔";
