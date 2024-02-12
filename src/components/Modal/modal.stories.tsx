import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Modal, ModalProps } from "./modal";
import Form from "../Form";
import Space from "../Space";
import Input from "../Input";
import Button from "../Button";
const meta = {
	title: "弹窗",
	component: Modal,
	tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

function DefaultModalComponent(props: ModalProps) {
	const [open, setOpen] = useState(false);
	return (
		<div style={{ width: "800px", height: "100vh", position: "relative" }}>
			<Button onClick={() => setOpen(true)}>打开弹窗</Button>
			<Modal {...props} open={open} onClose={() => setOpen(false)}>
				<Space direction="column">
					<Form>
						<Form.Item label="姓名" name="name" rules={[{ required: true }]}>
							<Input placeholder="请输入姓名" />
						</Form.Item>
						<Form.Item label="班级" name="class">
							<Input placeholder="请输入班级" />
						</Form.Item>
						<Form.Item label="性别" name="gender">
							<Input placeholder="请输入性别" />
						</Form.Item>
						<Button danger type="primary">
							删除
						</Button>
					</Form>
				</Space>
			</Modal>
		</div>
	);
}

export const DefaultModal: StoryObj<typeof meta> = {
	args: {},
	render(args) {
		return <DefaultModalComponent {...args} />;
	},
};

DefaultModal.storyName = "默认弹窗";
