import React from "react";
import { render, screen } from "@testing-library/react";
import Menu from "./index";

describe("测试menu组件是否正常显示", () => {
	it("测试通用menu", () => {
		render(
			<Menu>
				<Menu.Item>1</Menu.Item>
				<Menu.Item>2</Menu.Item>
				<Menu.Item>3</Menu.Item>
			</Menu>,
		);
		const firstMenuItem = screen.getByText(1);
		expect(firstMenuItem).toBeTruthy();
	});
});
