import axios from "axios";
import cls from "classnames";
import React, { HTMLAttributes, ReactNode, useMemo, useRef, useState } from "react";
import { useClassNames } from "../../hooks";
import Button from "../Button/button";
import { uniqueId } from "lodash";
import { Percentage } from "../Percentage/percentage";
import Icon from "../Icon/icon";
interface AnyObject {
	[key: string]: any;
}

type UploadStatus = "uploading" | "success" | "error";
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
	otherData?: AnyObject;
	/**上传状态改变时调用 */
	onChange?: (file: UploadFileType) => void;
}

type UploadProps = UploadBaseProps & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

const displayName = "Upload";
const classNamePrefix = "upload";
const baseClassName = classNamePrefix;
export const Upload: React.FC<UploadProps> = (props) => {
	const { className, children, onProgress, onSuccess, onError, beforeUpload, onChange, filePropsName, url, otherData, ...restProps } = props;
	const [uploadFiles, setUploadFiles] = useState<UploadFileType[]>([
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
	]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const uploadClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const uploadTriggerClassName = useClassNames(cls(`${classNamePrefix}-trigger`));
	const uploadFilesClassName = useClassNames(cls(`${classNamePrefix}-files`));
	const uploadFileClassName = useClassNames(cls(`${classNamePrefix}-file`));
	const uploadFilePercentageClassName = useClassNames(cls(`${classNamePrefix}-file-percentage`));
	const trigger = useMemo(() => {
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
		if (otherData instanceof Object) {
			Object.keys(otherData as AnyObject).forEach((key) => {
				const data = otherData as AnyObject;
				formData.append(key, data[key]);
			});
		}
		//发送post请求
		axios
			.post(url, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
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

	const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const [file] = Array.from(e.target.files as FileList);
		const sholdUpload = beforeUpload ? beforeUpload(file) : true;
		if (sholdUpload && sholdUpload instanceof Promise) {
			sholdUpload.then((formatFile) => {
				const wrapperFile: UploadFileType = {
					file: formatFile,
					status: "uploading",
					percentage: 0,
					uid: uniqueId("file"),
					fileName: formatFile.name,
				};
				setUploadFiles([...uploadFiles, wrapperFile]);
				uploadFileHandler(wrapperFile);
			});
		} else if (sholdUpload !== false) {
			const wrapperFile: UploadFileType = {
				file,
				status: "uploading",
				percentage: 0,
				uid: uniqueId("file"),
				fileName: file.name,
			};
			setUploadFiles([...uploadFiles, wrapperFile]);
			uploadFileHandler(wrapperFile);
		}
	};

	return (
		<div className={uploadClassName}>
			<div className={uploadTriggerClassName} onClick={triggerUploadHanlder}>
				{trigger}
			</div>
			<ul className={uploadFilesClassName}>
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
									<Percentage rate={uploadFile.percentage} height={8} />
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
			<input type="file" hidden ref={inputRef} onChange={onInputChangeHandler} {...restProps} />
		</div>
	);
};

Upload.displayName = displayName;
Upload.defaultProps = {
	filePropsName: "file",
	otherData: {},
};
