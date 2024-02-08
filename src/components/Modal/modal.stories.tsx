import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Modal, ModalProps } from "./modal";
import Button from "../Button";
import Space from "../Space";

const meta = {
	title: "弹窗",
	component: Modal,
	tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

function DefaultModalComponent(props: ModalProps) {
	return (
		<div style={{ width: "800px", height: "100vh", position: "relative" }}>
			<Modal {...props}>
				<Space direction="column">
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
					<Button>123</Button>
				</Space>
			</Modal>
		</div>
	);
}

export const DefaultModal: StoryObj<typeof meta> = {
	args: {
		open: false,
	},
	render(args) {
		return <DefaultModalComponent {...args} />;
	},
};

DefaultModal.storyName = "默认弹窗";
