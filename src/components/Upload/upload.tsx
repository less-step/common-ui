import axios from "axios";
import { AxiosHeaders } from "axios";
import cls from "classnames";
import React, { HTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useClassNames } from "../../hooks";
import Button from "../Button";
import { uniqueId } from "lodash";
import { Percentage } from "../Percentage/percentage";
import Icon from "../Icon";
import { Dragger } from "./dragger";
import Transition from "../Transition/transition";
interface AnyObject {
	[key: string]: any;
}

type UploadStatus = "uploading" | "success" | "error" | "deleted"; //deleted状态是为了做删除动效
type TriggerType = "drag" | "select";
export interface UploadFileType {
	file: File;
	status: UploadStatus;
	percentage: number;
	uid: string;
	fileName: string;
	response: any;
	size: number;
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
	/**默认文件 */
	defaultFileList?: UploadFileType[];
}

export type UploadProps = UploadBaseProps & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

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
		defaultFileList = [],
	} = props;
	const [uploadFiles, setUploadFiles] = useState<UploadFileType[]>([]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const uploadClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const uploadTriggerClassName = useClassNames(
		cls(`${classNamePrefix}-trigger`, {
			[`${classNamePrefix}-trigger-drag`]: triggerType === "drag",
		}),
	);
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
								response: resp,
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
								response: error,
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
					response: undefined,
					size: file.size,
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

	useEffect(() => {
		setUploadFiles([...defaultFileList]);
	}, [defaultFileList]);

	return (
		<div className={uploadClassName}>
			<div className={uploadTriggerClassName} onClick={triggerUploadHanlder}>
				{triggerType === "drag" && <Dragger onFiles={onFilesHandler}></Dragger>}
				{triggerType === "select" && triggerElement}
			</div>
			<ul className={uploadFilesClassName} hidden={hideFileList}>
				{uploadFiles.map((uploadFile, index) => {
					return (
						<Transition
							visible={uploadFile.status !== "deleted"}
							type="zoom-in-right"
							timeout={300}
							onExited={() => {
								setUploadFiles((uploadFiles) => {
									return uploadFiles.filter((file) => file.uid !== uploadFile.uid);
								});
							}}
							key={uploadFile.uid}
						>
							<li
								key={uploadFile.uid}
								className={cls(uploadFileClassName, {
									[`${uploadFile.status}`]: uploadFile.status,
								})}
								onMouseEnter={() => setActiveIndex(index)}
								onMouseLeave={() => setActiveIndex(-1)}
								aria-label="uploadFile"
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
										aria-label="close-icon"
										icon="circle-xmark"
										className="close-icon"
										onClick={() => {
											setUploadFiles((uploadFiles) => {
												return uploadFiles.map((file) => {
													if (file.uid === uploadFile.uid) {
														return {
															...file,
															status: "deleted",
														};
													} else {
														return file;
													}
												});
											});
										}}
									/>
								)}
							</li>
						</Transition>
					);
				})}
			</ul>
			<input type="file" hidden ref={inputRef} onChange={onInputChangeHandler} multiple={multiple} accept={accept} aria-label="uploadInput" />
		</div>
	);
};

Upload.displayName = displayName;
Upload.defaultProps = {
	filePropsName: "file",
	data: {},
	triggerType: "select",
	defaultFileList: [],
};
