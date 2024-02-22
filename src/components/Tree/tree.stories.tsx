import { Meta, StoryObj } from "@storybook/react";
import Tree from "./tree";
const meta = {
	title: "树",
	component: Tree,
	tags: ["autodocs"],
} satisfies Meta<typeof Tree>;

export default meta;

export const DefaultTree: StoryObj<typeof meta> = {
	args: {
		treeData: [
			{
				key: "1",
				title: "part1",
				name: "jss",
				className: "1",
				sex: "男",
				children: Array.from({ length: 100 }, (_, i) => {
					return {
						key: i,
						title: "part" + i,
						name: "jss" + i,
						className: "1",
						sex: "男",
						children: [],
					};
				}),
			},
			{
				key: "2",
				title: "part3",
				name: "jss",
				className: "1",
				sex: "男",
				children: [],
			},
		],
		columns: [
			{
				key: "name",
				title: "姓名",
			},
			{
				key: "className",
				title: "班级",
			},
			{
				key: "sex",
				title: "性别",
			},
		],
		multiple: true,
	},
};
DefaultTree.storyName = "默认树";
