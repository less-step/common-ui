import { RefObject, useCallback } from "react";

export const useUlScroll = (ref: RefObject<HTMLUListElement>, activeIndex: number) => {
	const scrollUp = useCallback(() => {
		if (!ref.current) return;
		const newActiveIndex = Math.max(activeIndex - 1, 0);
		const liHeight = ref.current.scrollHeight / ref.current.children.length;
		const bottomHeight = liHeight * (ref.current.children.length - newActiveIndex);
		const scrollBottom = ref.current.scrollHeight - ref.current.clientHeight - ref.current.scrollTop;
		ref.current.scrollTop = ref.current.scrollHeight - Math.max(bottomHeight - ref.current.clientHeight, scrollBottom) - ref.current.clientHeight;
		return newActiveIndex;
	}, [ref, activeIndex]);
	const scrollDown = useCallback(() => {
		if (!ref.current) return;
		const newActiveIndex = Math.min(activeIndex + 1, ref.current.children.length - 1);
		if (ref.current) {
			const liHeight = ref.current.scrollHeight / ref.current.children.length;
			const aboveLiHeight = liHeight * (newActiveIndex + 1);
			ref.current.scrollTop = Math.max(aboveLiHeight - ref.current.clientHeight, ref.current.scrollTop);
		}
		return newActiveIndex;
	}, [ref, activeIndex]);

	return {
		scrollDown,
		scrollUp,
	};
};
