import React, { useEffect, useRef, useState } from "react";

interface Position {
	x: number;
	y: number;
}
export type PositionOffset = Position;
export interface useDragProps {
	dragStart?: (dragStartMousePosition: Position) => void;
	dragging?: (mouseOffset: PositionOffset) => void;
	dragEnd?: () => void;
}

export const useDrag = (props: useDragProps) => {
	const { dragStart, dragging, dragEnd } = props;
	const dragHandle = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const dragStartMousePosition = useRef<Position>({ x: 0, y: 0 });
	const lastMousePosition = useRef<Position>();
	function mouseDownHandler(e: any) {
		const event = e as React.MouseEvent;
		if (event.target === dragHandle.current) {
			setIsDragging(true);
			lastMousePosition.current = dragStartMousePosition.current = {
				x: event.clientX,
				y: event.clientY,
			};
			dragStart?.(dragStartMousePosition.current);
		}
	}
	function mouseMoveHandler(e: any) {
		const event = e as React.MouseEvent;
		if (!lastMousePosition.current) {
			lastMousePosition.current = dragStartMousePosition.current;
		}
		const mouseOffset: PositionOffset = {
			x: event.clientX - lastMousePosition.current.x,
			y: event.clientY - lastMousePosition.current.y,
		};
		dragging?.(mouseOffset);
		lastMousePosition.current = { x: event.clientX, y: event.clientY };
	}

	function mouseUpHandler() {
		setIsDragging(false);
		lastMousePosition.current = undefined;
		dragEnd?.();
	}

	function mouseLeaveHandler() {
		setIsDragging(false);
		lastMousePosition.current = undefined;
		dragEnd?.();
	}

	function startDragEvent() {
		if (dragHandle) {
			document.addEventListener("mouseup", mouseUpHandler);
			document.addEventListener("mouseleave", mouseLeaveHandler);
			document.addEventListener("mousemove", mouseMoveHandler);
		}
	}

	function endDragEvent() {
		if (dragHandle) {
			document.removeEventListener("mouseup", mouseUpHandler);
			document.removeEventListener("mouseleave", mouseLeaveHandler);
			document.removeEventListener("mousemove", mouseMoveHandler);
		}
	}
	useEffect(() => {
		document.addEventListener("mousedown", mouseDownHandler);
		if (isDragging) {
			startDragEvent();
		} else {
			endDragEvent();
		}
		return () => {
			endDragEvent();
			document.removeEventListener("mousedown", mouseDownHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDragging]);

	return {
		isDragging,
		dragHandle,
	};
};
