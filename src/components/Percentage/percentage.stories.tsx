import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Percentage } from "./percentage";
const meta = {
	title: "百分比",
	component: Percentage,
} satisfies Meta<typeof Percentage>;
export default meta;

export const DefaultPercentage: StoryObj<typeof meta> = {
	args: {
		rate: 50,
		height: 12,
		loading: true,
	},
};
