import { StoryObj, Meta } from "@storybook/react";
import Icon from "./index";
const meta = {
	title: "图标",
	component: Icon,
	parameters: {},
} satisfies Meta<typeof Icon>;
export default meta;

export const DefaultIcon: StoryObj<typeof meta> = {
	args: {
		icon: "coffee",
	},
	argTypes: {
		icon: {
			controll: "text",
		},
	},
};
