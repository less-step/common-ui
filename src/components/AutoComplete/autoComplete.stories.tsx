import { Meta, StoryObj } from "@storybook/react";
import { AutoComplete } from "./autoComplete";
import { mockSuggestions } from "./mock";
const meta = {
	title: "自动补全",
	component: AutoComplete,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof AutoComplete>;

export default meta;

export const DefaultAutoComplete: StoryObj<typeof meta> = {
	args: {
		fetchSuggestions: (query) =>
			fetch(`https://api.github.com/search/users?q=${query}`)
				.then((resp) => resp.json())
				.then(({ items }) => {
					return items.map((item: any) => {
						return {
							label: item.login,
							value: item.login,
						};
					});
				}),
	},
};
DefaultAutoComplete.storyName = "默认自动补全";
