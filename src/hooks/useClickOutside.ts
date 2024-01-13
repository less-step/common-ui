import { RefObject, useEffect } from "react";

export const useClickOutsize = (ref: RefObject<HTMLElement>, handler: (e: MouseEvent) => void) => {
	useEffect(() => {
		function clickHandler(e: MouseEvent) {
			if (!ref.current?.contains(e.target as HTMLElement)) {
				handler(e);
			}
		}
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	}, [ref, handler]);
};
