/* eslint-disable testing-library/no-render-in-setup */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AutoComplete } from "./autoComplete";
import { APPNAME } from "../../consts";
const onChangeHandler = jest.fn();
const onSelectHanlder = jest.fn();
describe("测试自动补全组件", () => {
	it("默认类名&添加类名验证", () => {
		render(
			<AutoComplete fetchSuggestions={() => [{ label: 1, value: "1" }]} placeholder="auto-complete" onChange={onChangeHandler} className="jss-auto-complete helloworld" />,
		);
		const input = screen.getByPlaceholderText("auto-complete");
		expect(input).toBeTruthy();
		expect(input).toHaveClass(`${APPNAME}-input`);
		expect(input).toHaveClass("jss-auto-complete helloworld");
	});
	it("测试输入框输入内容,suggestions正常显示", async () => {
		render(
			<AutoComplete fetchSuggestions={() => [{ label: 1, value: "1" }]} placeholder="auto-complete" onChange={onChangeHandler} className="jss-auto-complete helloworld" />,
		);
		const input = screen.getByPlaceholderText("auto-complete");
		fireEvent.change(input, { target: { value: "1" } });
		expect(onChangeHandler).toBeCalled();
		await waitFor(() => {
			expect(screen.getByLabelText("ul")).toBeTruthy();
		});
		const li = screen.getAllByLabelText("li")[0];
		fireEvent.mouseEnter(li);
		expect(li).toHaveClass("active");
	});
	it("测试suggestion被点击后切换为active状态", async () => {
		render(
			<AutoComplete
				fetchSuggestions={() => [{ label: 1, value: "1" }]}
				placeholder="auto-complete"
				onChange={onChangeHandler}
				onSelect={onSelectHanlder}
				className="jss-auto-complete helloworld"
			/>,
		);
		const input = screen.getByPlaceholderText("auto-complete");
		fireEvent.change(input, { target: { value: "1" } });
		await waitFor(() => {
			expect(screen.getByLabelText("ul")).toBeTruthy();
		});
		const li = screen.getAllByLabelText("li")[0];
		fireEvent.mouseEnter(li);
		expect(li).toHaveClass("active");
		fireEvent.click(li);
		expect(onSelectHanlder).toHaveBeenCalledWith({ label: 1, value: "1" });
		expect(input).toHaveValue("1");
	});
	it("测试键盘上下键切换&Enter选择", async () => {
		render(
			<AutoComplete
				fetchSuggestions={() => [
					{ label: 1, value: "1" },
					{ label: 1, value: "2" },
				]}
				placeholder="auto-complete"
				onChange={onChangeHandler}
				className="jss-auto-complete helloworld"
			/>,
		);
		const input = screen.getByPlaceholderText("auto-complete");
		fireEvent.change(input, { target: { value: "1" } });
		await waitFor(() => {
			expect(screen.getByLabelText("ul")).toBeTruthy();
		});
		const li = screen.getAllByLabelText("li")[1];
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "ArrowDown" });
		expect(li).toHaveClass("active");
		fireEvent.keyDown(input, { key: "Enter" });
		expect(input).toHaveValue("2");
	});
	it("测试点击组件外部，隐藏popover", async () => {
		render(
			<AutoComplete
				fetchSuggestions={() => [
					{ label: 1, value: "1" },
					{ label: 1, value: "2" },
				]}
				placeholder="auto-complete"
				onChange={onChangeHandler}
				className="jss-auto-complete helloworld"
			/>,
		);
		const input = screen.getByPlaceholderText("auto-complete");
		fireEvent.change(input, { target: { value: "1" } });
		await waitFor(() => {
			expect(screen.getByLabelText("ul")).toBeTruthy();
		});
		fireEvent.click(document);
		await waitFor(() => {
			expect(screen.queryByLabelText("ul")).not.toBeTruthy();
		});
	});
});
