import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
	const [debounceValue, setDebounceValue] = useState<T>(value);
	useEffect(() => {
		function changeDebounceValue() {
			setDebounceValue(value);
		}
		let timer = setTimeout(changeDebounceValue, delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounceValue;
}
