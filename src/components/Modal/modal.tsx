import React, { ReactNode } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import Transition from "../Transition";
import Icon from "../Icon";
import Button from "../Button";
import Space from "../Space";
import { useDragResize } from "../../hooks/useDragResize";
import { useDragMove } from "../../hooks/useDragMove";

export interface ModalProps {
	open?: boolean;
	onClose?: () => void;
	onMinimize?: () => void;
	children?: ReactNode;
	minHeight?: number;
	minWidth?: number;
}

interface ModalRef {}
const displayName = "Modal";
const classNamePrefix = "modal";
const baseClassName = classNamePrefix;

export const Modal = React.forwardRef<ModalRef, ModalProps>((props, ref) => {
	const { open, onClose, onMinimize, minHeight, minWidth, children } = props as Required<ModalProps>;
	const modalContainerClassName = useClassNames(cls(`${classNamePrefix}-container`));
	const modalClassName = useClassNames(cls(baseClassName));
	const modalSizeControllerClassName = useClassNames(cls(`${classNamePrefix}-size-controller`));
	const { isDragging: isDraggingMove, dragEntity: dragMoveEntity, dragHandle: dragMoveHandle } = useDragMove({});
	const {
		isDragging: isDraggingLeftResize,
		dragEntity: dragResizeEntity,
		dragHandle: { leftHandle, rightHandle, topHandle, bottomHandle },
	} = useDragResize({ minHeight, minWidth });
	return (
		<Transition visible={open} type={"zoom-in-top"} timeout={300}>
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
							<Button shape="circle" size="sm">
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
							<Button shape="circle" size="sm">
								<Icon
									icon="minus"
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										onMinimize();
									}}
								/>
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
	);
});
Modal.displayName = displayName;
Modal.defaultProps = {
	open: false,
	onClose: () => {},
	onMinimize: () => {},
};
