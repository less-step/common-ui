import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Upload } from "./upload";
import { action } from "@storybook/addon-actions";
const meta = {
	title: "上传",
	component: Upload,
} satisfies Meta<typeof Upload>;
export default meta;

export const DefaultUpload: StoryObj<typeof meta> = {
	args: {
		url: "https://jsonplaceholder.typicode.com/posts",
		onProgress: action("progress"),
		onSuccess: action("success"),
		onError: action("error"),
		onChange: action("change"),
		multiple: true,
		accept: "image/png",
	},
	render(args) {
		return <Upload {...args}></Upload>;
	},
};
DefaultUpload.storyName = "默认上传";

export const DraggerUpload: StoryObj<typeof meta> = {
	args: {
		url: "https://jsonplaceholder.typicode.com/posts",
		triggerType: "drag",
	},
};
DraggerUpload.storyName = "拖动上传";
