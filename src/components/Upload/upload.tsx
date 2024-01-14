import axios, { AxiosHeaders } from "axios";
import cls from "classnames";
import React, { HTMLAttributes, ReactNode, useMemo, useRef, useState } from "react";
import { useClassNames } from "../../hooks";
import Button from "../Button/button";
import { uniqueId } from "lodash";
import { Percentage } from "../Percentage/percentage";
import Icon from "../Icon/icon";
import { Dragger } from "./dragger";
interface AnyObject {
	[key: string]: any;
}

type UploadStatus = "uploading" | "success" | "error";
type TriggerType = "drag" | "select";
interface UploadFileType {
	file: File;
	status: UploadStatus;
	percentage: number;
	uid: string;
	fileName: string;
}
export interface UploadBaseProps {
	children?: ReactNode;
	/**上传过程中回调 */
	onProgress?: (percentage: number, file: File) => void;
	/**上传成功回调 */
	onSuccess?: (resp: any, file: File) => void;
	/**上传失败回调 */
	onError?: (error: any, file: File) => void;
	/**上传前回调 */
	beforeUpload?: (file: any) => boolean | Promise<File>;
	/**上传地址 */
	url: string;
	/**文件的字段名 */
	filePropsName?: string;
	/**上传的其他字段内容 */
	data?: AnyObject;
	/**上传状态改变时调用 */
	onChange?: (file: UploadFileType) => void;
	/**axios headers */
	headers?: AxiosHeaders;
	/**是否携带cookies */
	withCredentials?: boolean;
	/**上传文件leixing */
	accept?: string;
	/**是否多选 */
	multiple?: boolean;
	/* 隐藏文件列表 */
	hideFileList?: boolean;
	/**触发文件上传的操作类型 */
	triggerType?: TriggerType;
}
const mockUploadFiles = [
	{
		fileName: "微信截图_20231231202700.png",
		status: "error",
		file: new File([], "jss"),
		percentage: 50,
		uid: uniqueId(),
	},
	{
		fileName: "微信截图_20231231202700.png",
		status: "success",
		file: new File([], "jss"),
		percentage: 50,
		uid: uniqueId(),
	},
	{
		fileName: "微信截图_20231231202701.png",
		status: "uploading",
		file: new File([], "jss测试"),
		percentage: 40,
		uid: uniqueId(),
	},
];
type UploadProps = UploadBaseProps & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

const displayName = "Upload";
const classNamePrefix = "upload";
const baseClassName = classNamePrefix;
export const Upload: React.FC<UploadProps> = (props) => {
	const {
		className,
		children,
		onProgress,
		onSuccess,
		onError,
		beforeUpload,
		onChange,
		filePropsName,
		url,
		data,
		headers,
		withCredentials,
		accept,
		multiple,
		hideFileList,
		triggerType,
	} = props;
	const [uploadFiles, setUploadFiles] = useState<UploadFileType[]>(mockUploadFiles as UploadFileType[]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const uploadClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const uploadTriggerClassName = useClassNames(cls(`${classNamePrefix}-trigger`));
	const uploadFilesClassName = useClassNames(cls(`${classNamePrefix}-files`));
	const uploadFileClassName = useClassNames(cls(`${classNamePrefix}-file`));
	const uploadFilePercentageClassName = useClassNames(cls(`${classNamePrefix}-file-percentage`));
	const triggerElement = useMemo(() => {
		return (
			children ?? (
				<Button type="primary" size="mid">
					上传文件
				</Button>
			)
		);
	}, [children]);

	const triggerUploadHanlder = (e: React.MouseEvent<HTMLDivElement>) => {
		inputRef.current?.click();
	};

	const uploadFileHandler = (wrapperFile: UploadFileType) => {
		//构建表单字段
		const formData = new FormData();
		formData.append(filePropsName as string, wrapperFile.file);
		if (data instanceof Object) {
			Object.keys(data as AnyObject).forEach((key) => {
				formData.append(key, data[key]);
			});
		}
		//发送post请求
		axios
			.post(url, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					...headers,
				},
				withCredentials,
				onUploadProgress(e) {
					const percentage = Math.round((e.loaded * 100) / (e.total as number)) || 0;
					if (percentage < 100) {
						onProgress?.(percentage, wrapperFile.file);
						setUploadFiles((files) =>
							files.map((uploadFile) => {
								if (uploadFile.uid !== wrapperFile.uid) {
									return uploadFile;
								}
								return {
									...uploadFile,
									percentage,
								};
							}),
						);
					}
					onChange?.(wrapperFile);
				},
			})
			.then(
				(resp) => {
					onSuccess?.(resp, wrapperFile.file);
					onChange?.(wrapperFile);
					setUploadFiles((files) =>
						files.map((uploadFile) => {
							if (uploadFile.uid !== wrapperFile.uid) {
								return uploadFile;
							}
							return {
								...uploadFile,
								status: "success",
								percentage: 100,
							};
						}),
					);
				},
				(error) => {
					onError?.(error, wrapperFile.file);
					onChange?.(wrapperFile);
					setUploadFiles((files) =>
						files.map((uploadFile) => {
							if (uploadFile.uid !== wrapperFile.uid) {
								return uploadFile;
							}
							return {
								...uploadFile,
								status: "error",
								percentage: 100,
							};
						}),
					);
					return;
				},
			);
	};

	const beforeUploadHandler = (files: File[]) => {
		const resultPromises = files
			.map((file) => {
				let formatResult: Promise<File> | boolean;
				if (beforeUpload) {
					formatResult = beforeUpload(file);
					if (formatResult instanceof Promise) {
						return formatResult;
					} else {
						if (formatResult) {
							return Promise.resolve(file);
						} else {
							return false;
						}
					}
				} else {
					return Promise.resolve(file);
				}
			})
			.filter((file) => {
				return !!file;
			}) as Promise<File>[];
		Promise.all(resultPromises).then((results) => {
			const wrapperFiles: UploadFileType[] = results.map((file) => {
				return {
					file,
					status: "uploading",
					percentage: 0,
					uid: uniqueId("file"),
					fileName: file.name,
				};
			});
			setUploadFiles([...uploadFiles, ...wrapperFiles]);
			wrapperFiles.forEach((wrapperFile) => {
				uploadFileHandler(wrapperFile);
			});
		});
	};

	const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files as FileList);
		beforeUploadHandler(files);
	};

	const onFilesHandler = (files: File[]) => {
		beforeUploadHandler(files);
	};

	return (
		<div className={uploadClassName}>
			<div className={uploadTriggerClassName} onClick={triggerUploadHanlder}>
				{triggerType === "drag" && <Dragger onFiles={onFilesHandler}></Dragger>}
				{triggerType === "select" && triggerElement}
			</div>
			<ul className={uploadFilesClassName} hidden={hideFileList}>
				{uploadFiles.map((uploadFile, index) => {
					return (
						<li
							key={index}
							className={cls(uploadFileClassName, {
								[`${uploadFile.status}`]: uploadFile.status,
							})}
							onMouseEnter={() => setActiveIndex(index)}
							onMouseLeave={() => setActiveIndex(-1)}
						>
							{uploadFile.fileName}
							{uploadFile.status === "uploading" && (
								<div className={uploadFilePercentageClassName}>
									<Percentage rate={uploadFile.percentage} height={8} loading={true} />
								</div>
							)}
							{activeIndex !== index && uploadFile.status === "error" && <Icon icon="circle-xmark" className="error-icon" theme="danger" />}
							{activeIndex !== index && uploadFile.status === "success" && <Icon icon="circle-check" className="success-icon" theme="success" />}
							{activeIndex === index && (
								<Icon
									icon="circle-xmark"
									className="close-icon"
									onClick={() => {
										setUploadFiles((uploadFiles) => {
											return uploadFiles.filter((file) => file.uid !== uploadFile.uid);
										});
									}}
								/>
							)}
						</li>
					);
				})}
			</ul>
			<input type="file" hidden ref={inputRef} onChange={onInputChangeHandler} multiple={multiple} accept={accept} />
		</div>
	);
};

Upload.displayName = displayName;
Upload.defaultProps = {
	filePropsName: "file",
	data: {},
	triggerType: "select",
};
