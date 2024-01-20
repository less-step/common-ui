import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Form } from "./form";
import Input from "../Input/input";
import { AutoComplete } from "../AutoComplete/autoComplete";
const meta = {
	title: "表单",
	component: Form,
} satisfies Meta<typeof Form>;

export default meta;
function Test(props: any) {
	return <h1>{props.children}</h1>;
}
export const DefaultForm: StoryObj<typeof meta> = {
	args: {
		initialValue: {
			name: "hahah",
			class: "xixi",
			jss: "wwwww",
		},
	},
	render(args) {
		return (
			<div style={{ width: "700px", boxShadow: "0 0 7px 0 #f0f0f0" }}>
				<Form {...args}>
					<Form.Item label="姓名" name="name" initialValue={"initialName"}>
						<Input />
					</Form.Item>
					<Form.Item label="班级" name="class">
						<AutoComplete fetchSuggestions={() => [{ label: "1", value: "1" }]} />
					</Form.Item>
					<Form.Item label="jss" name="jss">
						<Test>123</Test>
					</Form.Item>
				</Form>
			</div>
		);
	},
};
DefaultForm.storyName = "默认表单";
