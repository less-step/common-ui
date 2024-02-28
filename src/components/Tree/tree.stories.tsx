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
				title: "part1少时诵诗书少时诵诗书是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒事实上事实上少时诵诗书是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒是撒",
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
		titleRender: null,
		onSelect(keys, info) {
			alert(keys[0]);
		},
		onExpand(keys) {
			alert(keys[0]);
		},
	},
};
DefaultTree.storyName = "默认树";
