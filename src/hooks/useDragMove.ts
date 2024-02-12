import { useRef } from "react";
import { PositionOffset, useDrag, useDragProps } from "./useDrag";

export function getOffset(element: HTMLElement) {
	const offsetParent = element.offsetParent || document.body;
	const rect = element.getBoundingClientRect();
	const offsetParentRect = offsetParent.getBoundingClientRect();
	return {
		left: element.offsetLeft,
		top: element.offsetTop,
		bottom: offsetParentRect.bottom - rect.bottom,
		right: offsetParentRect.right - rect.right,
		width: element.offsetWidth,
		height: element.offsetHeight,
	};
}

export function getLimitValue(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

export const useDragMove = (props: useDragProps) => {
	const dragEntity = useRef<HTMLDivElement>(null);

	function onMove(mouseOffset: PositionOffset) {
		if (dragEntity.current) {
			const offset = getOffset(dragEntity.current);
			const limitX = {
				min: -offset.left,
				max: offset.right,
			};
			const limitY = {
				min: -offset.top,
				max: offset.bottom,
			};
			const offsetX = getLimitValue(mouseOffset.x, limitX.min, limitX.max);
			const offsetY = getLimitValue(mouseOffset.y, limitY.min, limitY.max);
			dragEntity.current.style.left = dragEntity.current.offsetLeft + offsetX + "px";
			dragEntity.current.style.top = dragEntity.current.offsetTop + offsetY + "px";
		}
	}
	const { isDragging, dragHandle } = useDrag({
		...props,
		dragging: onMove,
	});

	return {
		dragEntity,
		dragHandle,
		isDragging,
	};
};
