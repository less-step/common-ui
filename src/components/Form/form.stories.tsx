import React, { useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Form, FormRef } from "./form";
import Input from "../Input/input";
import { AutoComplete } from "../AutoComplete/autoComplete";
import Button from "../Button/button";
const meta = {
	title: "表单",
	component: Form,
	tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;

function DefaultFormComponent(props: any) {
	const { args } = props;
	const ref = useRef<FormRef>(null);
	return (
		<div style={{ width: "700px", boxShadow: "0 0 7px 0 #f0f0f0" }}>
			<Form {...args} ref={ref}>
				<Form.Item label="姓名" name="name" initialValue={"initialName"} rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item label="班级" name="class" rules={[{ required: true }]} initialValue={"2班"}>
					<AutoComplete fetchSuggestions={() => [{ label: "1", value: "1" }]} />
				</Form.Item>
				<Form.Item
					label="性别"
					name="gendor"
					initialValue={false}
					rules={[{ type: "enum", enum: [true] }, { required: true }]}
					valuePropName="checked"
					getValueProp={(e) => e.target.checked}
				>
					<input type="checkbox" />
				</Form.Item>
			</Form>
			<Button
				type="primary"
				onClick={() => {
					ref.current?.validateFields().then((resp) => {
						console.log(resp, "resp");
					});
				}}
			>
				提交
			</Button>
			<Button
				onClick={() => {
					ref.current?.resetFields();
				}}
			>
				重置
			</Button>
		</div>
	);
}
export const DefaultForm: StoryObj<typeof meta> = {
	args: {
		initialValue: {},
		onFinish(value) {
			console.log(value);
		},
		onFinishFail(error) {
			console.log(error, "ddd");
		},
	},
	render(args) {
		return <DefaultFormComponent args={args} />;
	},
};
DefaultForm.storyName = "默认表单";
