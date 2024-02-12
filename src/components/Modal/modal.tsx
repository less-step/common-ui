import React, { ReactNode, useEffect, useRef, useState } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import Transition from "../Transition";
import Icon from "../Icon";
import Button from "../Button";
import Space from "../Space";
import { useDragResize } from "../../hooks/useDragResize";
import { useDragMove } from "../../hooks/useDragMove";
import html2canvas from "html2canvas";
export interface ModalProps {
	open?: boolean;
	minimal?: boolean;
	onClose?: () => void;
	children?: ReactNode;
	minHeight?: number;
	minWidth?: number;
}

interface ModalRef {}
const displayName = "Modal";
const classNamePrefix = "modal";
const baseClassName = classNamePrefix;

export const Modal = React.forwardRef<ModalRef, ModalProps>((props, ref) => {
	const { open, onClose, minHeight, minWidth, children } = props as Required<ModalProps>;
	const [minimal, setMinimal] = useState(false);
	const modalContainerClassName = useClassNames(cls(`${classNamePrefix}-container`));
	const modalClassName = useClassNames(cls(baseClassName));
	const minimalClassName = useClassNames(cls(`${classNamePrefix}-minimal`));
	const modalSizeControllerClassName = useClassNames(cls(`${classNamePrefix}-size-controller`));
	const { isDragging: isDraggingMove, dragEntity: dragMoveEntity, dragHandle: dragMoveHandle } = useDragMove({});
	const {
		isDragging: isDraggingLeftResize,
		dragEntity: dragResizeEntity,
		dragHandle: { leftHandle, rightHandle, topHandle, bottomHandle },
	} = useDragResize({ minHeight, minWidth });
	const minimalRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		if (minimal) {
			if (dragMoveEntity.current && minimalRef.current) {
				html2canvas(dragMoveEntity.current).then((canvas) => {
					const drawCanvas = minimalRef.current as HTMLCanvasElement;
					const modal = dragMoveEntity.current as HTMLDivElement;
					let ctx = drawCanvas.getContext("2d");
					let scale = Math.min(modal.offsetHeight / drawCanvas.offsetHeight, modal.offsetWidth / drawCanvas.offsetWidth);
					let drawSize = {
						width: modal.offsetWidth / scale,
						height: modal.offsetHeight / scale,
					};
					if (ctx) {
						ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
						ctx.drawImage(canvas, (drawCanvas.width - drawSize.width) / 2, (drawCanvas.height - drawSize.height) / 2, drawSize.width, drawSize.height);
					}
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [minimal]);
	return (
		<>
			<Transition visible={open && !minimal} type={"zoom-in-top"} timeout={300}>
				<div
					ref={(ref) => {
						/* 因为报错很烦，所以用这个 */
						if (ref) {
							Object.defineProperties(dragMoveEntity, {
								current: {
									value: ref,
								},
							});
							Object.defineProperties(dragResizeEntity, {
								current: {
									value: ref,
								},
							});
							if (!ref.style.left) ref.style.left = ((ref.offsetParent || document.body).clientWidth - ref.offsetWidth) / 2 + "px";
							if (!ref.style.top) ref.style.top = ((ref.offsetParent || document.body).clientHeight - ref.offsetHeight) / 2 + "px";
						}
					}}
					className={modalContainerClassName}
				>
					<div className={cls(modalSizeControllerClassName, "left")} ref={leftHandle}></div>
					<div className={cls(modalSizeControllerClassName, "right")} ref={rightHandle}></div>
					<div className={cls(modalSizeControllerClassName, "top")} ref={topHandle}></div>
					<div className={cls(modalSizeControllerClassName, "bottom")} ref={bottomHandle}></div>
					<div className={modalClassName}>
						<div className="header" ref={dragMoveHandle}>
							<Space size="sm">
								<Button
									shape="circle"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										onClose();
									}}
								>
									<Icon icon="close" theme="danger" />
								</Button>
								<Button
									shape="circle"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										setMinimal(true);
									}}
								>
									<Icon icon="minus" />
								</Button>
								{isDraggingMove && "draggingMove"}
								{isDraggingLeftResize.isLeftDragging && "draggingResize-left"}
								{isDraggingLeftResize.isRightDragging && "draggingResize-right"}
								{isDraggingLeftResize.isTopDragging && "draggingResize-top"}
								{isDraggingLeftResize.isBottomDragging && "draggingResize-bottom"}
							</Space>
						</div>
						<div className="content">{children}</div>
					</div>
				</div>
			</Transition>
			<Transition visible={minimal} type={"zoom-in-left"} timeout={300}>
				<canvas
					className={minimalClassName}
					ref={minimalRef}
					onClick={() => {
						setMinimal(false);
					}}
				>
					我是一个缩略图
				</canvas>
			</Transition>
		</>
	);
});
Modal.displayName = displayName;
Modal.defaultProps = {
	open: false,
	onClose: () => {},
};
