import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "../../../dist/index.css";
import Button from "./button";
import { APPNAME } from "../../consts";
const clickHanlder = jest.fn();
const mouseOverHandler = jest.fn();

describe("测试按钮组件", () => {
	it("默认按钮正常显示", () => {
		render(<Button onClick={clickHanlder}>按钮</Button>);
		const element = screen.getByText("按钮");
		expect(element).toBeTruthy();
		fireEvent.click(element);
		expect(clickHanlder).toBeCalled();
	});
	it("primary按钮正常显示", () => {
		render(
			<Button btnType="primary" onMouseOver={mouseOverHandler}>
				按钮
			</Button>,
		);
		const element = screen.getByText("按钮");
		const computedStyle = getComputedStyle(element);
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(`${APPNAME}-btn-primary`);
		expect(computedStyle.backgroundColor).toBe("#219673");
	});
	it("link按钮正常显示", () => {
		render(<Button btnType="link">按钮</Button>);
		const element = screen.getByText("按钮");
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(`${APPNAME}-btn-link`);
	});
	it("lg的按钮正常显示", () => {
		render(<Button size="lg">按钮</Button>);
		const element = screen.getByText("按钮");
		expect(element.tagName).toBe("BUTTON");
		expect(element).toHaveClass(`${APPNAME}-btn-lg`);
	});
	it("sm的按钮正常显示", () => {
		render(<Button size="sm">按钮</Button>);
		const element = screen.getByText("按钮");
		expect(element.tagName).toBe("BUTTON");
		expect(element).toHaveClass(`${APPNAME}-btn-sm`);
	});
	it("disabled按钮不能执行操作", () => {
		render(
			<Button size="sm" disabled onClick={clickHanlder}>
				按钮
			</Button>,
		);
		const element = screen.getByText("按钮");
		expect(element).toHaveClass(`disabled`);
		fireEvent.click(element);
		expect(clickHanlder).not.toBeCalled();
	});
});
