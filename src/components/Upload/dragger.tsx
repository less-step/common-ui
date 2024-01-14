import cls from "classnames";
import React, { DragEvent, HtmlHTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import { InOutEventConfig, useClassNames, useMouseInOut } from "../../hooks";
import Icon from "../Icon/icon";
export interface DraggerBasePropsType {
	onFiles: (fileList: File[]) => void;
	children?: React.ReactNode;
}
type DraggerPropsType = DraggerBasePropsType & HtmlHTMLAttributes<HTMLDivElement>;
const displayName = "Dragger";
const classNamePrefix = "dragger";
const baseClassName = classNamePrefix;
export const Dragger: React.FC<DraggerPropsType> = (props) => {
	const { className, onFiles, children, ...restProps } = props;
	const draggerRef = useRef<HTMLDivElement>(null);
	const [isDragged, setIsDragged] = useState(false);
	const draggerClassName = useClassNames(
		cls(baseClassName, {
			"drag-over": isDragged,
		}),
		className ? className.split(" ").concat("drag-over") : ["drag-over"],
	);
	const draggerUploadIconClassName = "upload-icon";
	const onDragEnterHandler = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragged(true);
	}, []);

	const onDragLeaveHandler = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		setIsDragged(false);
	}, []);

	const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragged(false);
		onFiles(Array.from(e.dataTransfer.files));
	};

	const mouseInOutHanlder = useMemo(() => {
		return {
			enter: ["dragenter", onDragEnterHandler] as InOutEventConfig,
			leave: ["dragleave", onDragLeaveHandler] as InOutEventConfig,
		};
	}, [onDragEnterHandler, onDragLeaveHandler]);

	useMouseInOut(draggerRef, mouseInOutHanlder);

	return (
		<div
			aria-label="dragger"
			className={draggerClassName}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={onDropHandler}
			ref={draggerRef}
			{...restProps}
		>
			<Icon icon="upload" className={draggerUploadIconClassName} theme={isDragged ? "primary" : "dark"} />
			<p>拖动文件到此区域上传文件</p>
			{children}
		</div>
	);
};

Dragger.displayName = displayName;
