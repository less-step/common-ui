import React, { useEffect, MouseEvent, DragEvent } from "react";
export type InOutEventConfig = [string, (e: MouseEvent | DragEvent<HTMLElement>) => void];
export interface MouseInOutType {
	enter?: InOutEventConfig;
	leave?: InOutEventConfig;
}
export const useMouseInOut = (ref: React.RefObject<HTMLElement>, mouseInOut: MouseInOutType) => {
	useEffect(() => {
		function enterHandler(e: MouseEvent) {
			if (!ref.current?.isSameNode(e.target as HTMLDivElement)) {
				return;
			}
			mouseInOut.enter?.[1](e);
		}
		function leaveHandler(e: MouseEvent) {
			const event = e as MouseEvent;
			if (!ref.current || ref.current.contains(event.relatedTarget as HTMLDivElement)) {
				return;
			}
			mouseInOut.leave?.[1](e);
		}
		const refObject = ref.current;

		if (refObject) {
			mouseInOut.enter && refObject.addEventListener(mouseInOut.enter[0], enterHandler as any);
			mouseInOut.leave && refObject.addEventListener(mouseInOut.leave[0], leaveHandler as any);
		}
		return () => {
			if (refObject) {
				mouseInOut.enter && refObject.removeEventListener(mouseInOut.enter[0], enterHandler as any);
				mouseInOut.leave && refObject.removeEventListener(mouseInOut.leave[0], leaveHandler as any);
			}
		};
	}, [ref, mouseInOut]);
};
