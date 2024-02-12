import { useRef } from "react";
import { PositionOffset, useDrag, useDragProps } from "./useDrag";
import { getLimitValue, getOffset } from "./useDragMove";

export const useDragResize = (props: useDragProps & { minHeight: number; minWidth: number }) => {
	const dragEntity = useRef<HTMLDivElement>(null);
	const { minWidth = 400, minHeight = 500 } = props;
	function onLeftResize(mouseOffset: PositionOffset) {
		if (dragEntity.current) {
			const offset = getOffset(dragEntity.current);
			const limitX = {
				min: -offset,
				max: offset.width - minWidth,
			};
			const offsetX = getLimitValue(mouseOffset.x, limitX.min, limitX.max);
			dragEntity.current.style.left = offset.left + offsetX + "px";
			dragEntity.current.style.width = offset.width - offsetX + "px";
		}
	}
	function onRightResize(mouseOffset: PositionOffset) {
		if (dragEntity.current) {
			const offset = getOffset(dragEntity.current);
			const limitX = {
				min: minWidth - offset.width,
				max: offset.right,
			};
			const offsetX = Math.max(limitX.min, Math.min(limitX.max, mouseOffset.x));
			dragEntity.current.style.right = offset.right + offsetX + "px";
			dragEntity.current.style.width = offset.width + offsetX + "px";
		}
	}
	function onTopResize(mouseOffset: PositionOffset) {
		if (dragEntity.current) {
			const offset = getOffset(dragEntity.current);
			const limitY = {
				min: -offset.top,
				max: offset.height - minHeight,
			};
			const offsetY = getLimitValue(mouseOffset.y, limitY.min, limitY.max);
			dragEntity.current.style.top = offset.top + offsetY + "px";
			dragEntity.current.style.height = offset.height - offsetY + "px";
		}
	}
	function onBottomResize(mouseOffset: PositionOffset) {
		if (dragEntity.current) {
			const offset = getOffset(dragEntity.current);
			const limitY = {
				min: minHeight - offset.height,
				max: offset.bottom,
			};
			const offsetY = getLimitValue(mouseOffset.y, limitY.min, limitY.max);
			dragEntity.current.style.bottom = offset.bottom + offsetY + "px";
			dragEntity.current.style.height = offset.height + offsetY + "px";
		}
	}
	const { isDragging: isLeftDragging, dragHandle: leftHandle } = useDrag({
		...props,
		dragging: onLeftResize,
	});
	const { isDragging: isRightDragging, dragHandle: rightHandle } = useDrag({
		...props,
		dragging: onRightResize,
	});
	const { isDragging: isTopDragging, dragHandle: topHandle } = useDrag({
		...props,
		dragging: onTopResize,
	});
	const { isDragging: isBottomDragging, dragHandle: bottomHandle } = useDrag({
		...props,
		dragging: onBottomResize,
	});
	return {
		isDragging: {
			isLeftDragging,
			isRightDragging,
			isTopDragging,
			isBottomDragging,
		},
		dragHandle: {
			leftHandle,
			rightHandle,
			topHandle,
			bottomHandle,
		},
		dragEntity,
	};
};
