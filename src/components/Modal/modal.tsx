import React, { ReactNode, useEffect, useRef, useState } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import Transition from "../Transition";
import Icon from "../Icon";
import Button from "../Button";
import Space from "../Space";

export interface ModalProps {
	open?: boolean;
	onClose?: () => void;
	onMinimize?: () => void;
	children?: ReactNode;
}

type MousePosition = {
	x: number;
	y: number;
};
type ModalRect = {
	width: number;
	height: number;
	left: number;
	right: number;
	top: number;
	bottom: number;
};
type SizeControllerType = "left" | "right" | "top" | "bottom";
type SizeProps = "width" | "height";
interface ModalRef {}
const displayName = "Modal";
const classNamePrefix = "modal";
const baseClassName = classNamePrefix;

const dircetionSizePropMap: Record<SizeControllerType, SizeProps> = {
	left: "width",
	right: "width",
	top: "height",
	bottom: "height",
};

const directionBaseMap: Record<SizeControllerType, 1 | -1> = {
	left: -1,
	right: 1,
	top: -1,
	bottom: 1,
};

const limitRect: Partial<ModalRect> = {
	width: 500,
	height: 500,
};

export const Modal = React.forwardRef<ModalRef, ModalProps>((props, ref) => {
	const { open, onClose, onMinimize, children } = props as Required<ModalProps>;
	const modalContainerClassName = useClassNames(cls(`${classNamePrefix}-container`));
	const modalClassName = useClassNames(cls(baseClassName));
	const modalSizeControllerClassName = useClassNames(cls(`${classNamePrefix}-size-controller`));
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const leftSizeController = useRef<HTMLDivElement>(null);
	const rightSizeController = useRef<HTMLDivElement>(null);
	const topSizeController = useRef<HTMLDivElement>(null);
	const bottomSizeController = useRef<HTMLDivElement>(null);
	const sizeControllerType = useRef<SizeControllerType>("left");
	const mouseDownPosition = useRef<MousePosition>({ x: 0, y: 0 });
	const mouseDownModalRect = useRef<ModalRect>({ width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 });

	function startDrag(e: React.MouseEvent) {
		setIsDragging(true);
		setMouseDownPosition(e.clientX, e.clientY);
		const target = modalRef.current as HTMLDivElement;
		mouseDownModalRect.current = target.getBoundingClientRect();
		console.log("drag start");
	}

	function startResize(e: React.MouseEvent, direction: SizeControllerType) {
		const target = modalRef.current as HTMLDivElement;
		mouseDownModalRect.current = target.getBoundingClientRect();
		sizeControllerType.current = direction;
		setIsResizing(true);
		setMouseDownPosition(e.clientX, e.clientY);
	}

	function endDrag() {
		setIsDragging(false);
		console.log("drag end");
	}

	function endResize() {
		setIsResizing(false);
		console.log("resize end");
	}

	function setMouseDownPosition(x: number, y: number) {
		mouseDownPosition.current = { x, y };
	}

	function isRectContained(rect1: ModalRect, rect2: ModalRect) {
		return rect1.left <= rect2.left && rect1.top <= rect2.top && rect1.right >= rect2.right && rect1.bottom >= rect2.bottom;
	}

	function isRectGreaterThan(rect1: ModalRect, rect2: ModalRect) {
		return rect1.width >= rect2.width && rect1.height >= rect2.height;
	}

	function getResizeCalculateRect(direction: SizeControllerType, sizePropName: SizeProps, originRect: ModalRect, offset: number, negativeBase: 1 | -1) {
		const newRect: ModalRect = {
			width: originRect.width,
			height: originRect.height,
			left: originRect.left,
			right: originRect.right,
			top: originRect.top,
			bottom: originRect.bottom,
		};
		newRect[direction] = originRect[direction] + offset;
		newRect[sizePropName] = originRect[sizePropName] + offset * negativeBase;
		return newRect;
	}

	function getMoveCalculateRect(offset: { x: number; y: number }, originRect: ModalRect) {
		const newRect: ModalRect = {
			width: originRect.width,
			height: originRect.height,
			left: originRect.left + offset.x,
			right: originRect.right + offset.x,
			top: originRect.top + offset.y,
			bottom: originRect.bottom + offset.y,
		};
		return newRect;
	}

	function resizeModal(event: any) {
		const e = event as React.MouseEvent;
		const modal = modalRef.current as HTMLElement;
		const targetParent = modal.parentElement;
		const modalParentRect = targetParent?.getBoundingClientRect() || { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
		//计算偏移量
		const { x, y } = mouseDownPosition.current;
		const offsetX = e.clientX - x;
		const offsetY = e.clientY - y;

		//计算偏移量后得到的弹窗rect
		const sizePropName = dircetionSizePropMap[sizeControllerType.current];
		const modalCalculateRect = getResizeCalculateRect(
			sizeControllerType.current,
			sizePropName,
			mouseDownModalRect.current,
			sizePropName === "width" ? offsetX : offsetY,
			directionBaseMap[sizeControllerType.current],
		);

		// 限制不能超过相对父组件
		if (!isRectContained(modalParentRect, modalCalculateRect)) {
			setIsResizing(false);
			return;
		}
		//不能小于limit
		if (!isRectGreaterThan(modalCalculateRect, limitRect as ModalRect)) {
			return;
		}

		//子div相对父div的position
		const modalOffsetRect: Partial<ModalRect> = {
			left: modalCalculateRect.left - modalParentRect.left,
			right: modalParentRect.right - modalCalculateRect.right,
			top: modalCalculateRect.top - modalParentRect.top,
			bottom: modalParentRect.bottom - modalCalculateRect.bottom,
			width: modalCalculateRect.width,
			height: modalCalculateRect.height,
		};
		Object.keys(modalOffsetRect).forEach((key) => {
			modal.style[key as keyof ModalRect] = modalOffsetRect[key as keyof ModalRect] + "px";
		});

		console.log("is resizing");
	}

	function dragModal(event: any) {
		const e = event as React.MouseEvent;
		const modal = modalRef.current as HTMLElement;
		const modalParentRect = modal.parentElement?.getBoundingClientRect() as ModalRect;
		const { x, y } = mouseDownPosition.current;
		const offsetX = e.clientX - x;
		const offsetY = e.clientY - y;
		const modalCalculateRect = getMoveCalculateRect({ x: offsetX, y: offsetY }, mouseDownModalRect.current);
		if (!isRectContained(modalParentRect, modalCalculateRect)) {
			setIsDragging(false);
			return;
		}
		//子div相对父div的position
		const modalOffsetRect: Partial<ModalRect> = {
			left: modalCalculateRect.left - modalParentRect.left,
			top: modalCalculateRect.top - modalParentRect.top,
		};
		Object.keys(modalOffsetRect).forEach((key) => {
			modal.style[key as keyof ModalRect] = modalOffsetRect[key as keyof ModalRect] + "px";
		});
		console.log("is draging");
	}

	useEffect(() => {
		function endDragEvent() {
			document.removeEventListener("mousemove", dragModal);
			document.removeEventListener("mouseleave", endDrag);
			document.removeEventListener("mouseup", endDrag);
		}
		function startDragEvent() {
			document.addEventListener("mousemove", dragModal);
			document.addEventListener("mouseleave", endDrag);
			document.addEventListener("mouseup", endDrag);
		}
		if (isDragging) {
			startDragEvent();
		} else {
			endDragEvent();
		}
		return () => {
			endDragEvent();
		};
	}, [isDragging]);

	useEffect(() => {
		function endResizeEvent() {
			document.removeEventListener("mousemove", resizeModal);
			document.removeEventListener("mouseleave", endResize);
			document.removeEventListener("mouseup", endResize);
		}
		function startResizeEvent() {
			document.addEventListener("mousemove", resizeModal);
			document.addEventListener("mouseleave", endResize);
			document.addEventListener("mouseup", endResize);
		}
		if (isResizing) {
			startResizeEvent();
		} else {
			endResizeEvent();
		}
		return () => {
			endResizeEvent();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isResizing]);

	return (
		<Transition visible={open} type={"zoom-in-top"} timeout={300}>
			<div
				ref={modalRef}
				className={modalContainerClassName}
				onMouseDown={(e) => {
					switch (e.target) {
						case headerRef.current:
							startDrag(e);
							break;
						case leftSizeController.current:
							startResize(e, "left");
							break;
						case rightSizeController.current:
							startResize(e, "right");
							break;
						case topSizeController.current:
							startResize(e, "top");
							break;
						case bottomSizeController.current:
							startResize(e, "bottom");
							break;
						default:
					}
				}}
			>
				<div className={cls(modalSizeControllerClassName, "left")} ref={leftSizeController}></div>
				<div className={cls(modalSizeControllerClassName, "right")} ref={rightSizeController}></div>
				<div className={cls(modalSizeControllerClassName, "top")} ref={topSizeController}></div>
				<div className={cls(modalSizeControllerClassName, "bottom")} ref={bottomSizeController}></div>
				<div className={modalClassName}>
					<div className="header" ref={headerRef}>
						<Space size="sm">
							<Button shape="circle">
								<Icon
									icon="close"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										onClose();
									}}
									theme="danger"
								/>
							</Button>
							<Button shape="circle">
								<Icon
									icon="minus"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										onMinimize();
									}}
								/>
							</Button>
						</Space>
					</div>
					<div className="content">{children}</div>
				</div>
			</div>
		</Transition>
	);
});
Modal.displayName = displayName;
Modal.defaultProps = {
	open: false,
	onClose: () => {},
	onMinimize: () => {},
};
