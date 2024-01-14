import { screen, render, fireEvent, waitFor, createEvent } from "@testing-library/react";
import { Upload, UploadFileType } from "./upload";
import { uniqueId } from "lodash";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockUploadFiles = [
	{
		fileName: "微信截图_20231231202700.png",
		status: "error",
		file: new File([], "jss"),
		percentage: 50,
		uid: uniqueId(),
		size: 0,
	},
	{
		fileName: "微信截图_20231231202700.png",
		status: "success",
		file: new File([], "jss"),
		percentage: 50,
		size: 0,
		uid: uniqueId(),
	},
	{
		fileName: "微信截图_20231231202701.png",
		status: "uploading",
		file: new File([], "jss测试"),
		percentage: 40,
		size: 0,
		uid: uniqueId(),
	},
];
const mockFiles = [new File([], "jss")];
describe("上传组件测试", () => {
	it("测试组件是否正常显示", () => {
		render(<Upload url="fakeUrl" defaultFileList={mockUploadFiles as UploadFileType[]} />);
		const input = screen.queryByLabelText("uploadInput");
		const uploadFiles = screen.queryAllByLabelText("uploadFile");
		expect(input).toBeInTheDocument();
		expect(input).not.toBeVisible();
		expect(uploadFiles.length).toEqual(3);
		expect(uploadFiles[0]).toHaveTextContent("微信截图");
	});
	it("测试文件上传", async () => {
		render(<Upload url="fakeUrl" defaultFileList={mockUploadFiles as UploadFileType[]} />);
		const input = screen.getByLabelText("uploadInput");
		mockedAxios.post.mockImplementation(() => {
			return Promise.resolve({ data: "less-step" });
		});
		fireEvent.change(input, {
			target: {
				files: [
					{
						fileName: "微信截图_20231231202704.png",
						status: "error",
						file: new File([], "jss"),
						percentage: 50,
						uid: uniqueId(),
					},
				],
			},
		});
		await waitFor(() => {
			const uploadFiles = screen.queryAllByLabelText("uploadFile");
			expect(uploadFiles.length).toEqual(4);
		});
		await waitFor(() => {
			const uploadFiles = screen.queryAllByLabelText("uploadFile");
			const lastFile = uploadFiles[uploadFiles.length - 1];
			expect(lastFile).toHaveClass("success");
		});
	});
	it("测试鼠标移入file&删除文件", async () => {
		render(<Upload url="fakeUrl" defaultFileList={mockUploadFiles as UploadFileType[]} />);
		let closeIcon = screen.queryByLabelText("close-icon");
		expect(closeIcon).not.toBeTruthy();
		const file = screen.queryAllByLabelText("uploadFile")[0];
		expect(file).toBeInTheDocument();
		fireEvent.mouseEnter(file);
		closeIcon = screen.getByLabelText("close-icon");
		expect(closeIcon).toBeInTheDocument();
		fireEvent.click(closeIcon);
		await waitFor(() => {
			const files = screen.queryAllByLabelText("uploadFile");
			expect(files.length).toEqual(2);
		});
	});
	it("测试文件拖入操作", async () => {
		render(<Upload url="fakeUrl" triggerType="drag" />);
		let files = screen.queryAllByLabelText("uploadFile");
		const input = screen.queryByLabelText("uploadInput");
		const dragger = screen.getByLabelText("dragger");
		mockedAxios.post.mockImplementation(() => {
			return Promise.resolve({ data: "less-step" });
		});
		expect(files.length).toEqual(0);
		expect(input).toBeTruthy();
		const dropEvent = createEvent.drop(dragger);
		Object.defineProperty(dropEvent, "dataTransfer", {
			value: {
				files: mockFiles,
			},
		});
		fireEvent(dragger, dropEvent);
		await waitFor(() => {
			files = screen.queryAllByLabelText("uploadFile");
			expect(files.length).toEqual(1);
		});
	});
});
