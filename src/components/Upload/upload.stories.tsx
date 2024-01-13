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
		// beforeUpload: (file) => {
		// 	if (file.size / 1024 > 50) {
		// 		alert("file too big");
		// 		return false;
		// 	} else {
		// 		return true;
		// 	}
		// },
		otherData: { haha: 1 },
	},
	render(args) {
		return <Upload {...args}></Upload>;
	},
};
