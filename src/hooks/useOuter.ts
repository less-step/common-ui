import { useEffect, useState } from "react";

export function useOuter<T>(state: T) {
	const inner = useState<T>(state);
	useEffect(() => {
		if (state) {
			inner[1](state);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	return inner;
}
