import type { Preview } from "@storybook/react";
import "../src/styles/index.scss";
const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		options: {
			storySort: {
				order: ["Less-step 组件库", "按钮", "图标", "输入框", "自动补全", "表单", "百分比", "上传"],
			},
		},
	},
};

export default preview;
