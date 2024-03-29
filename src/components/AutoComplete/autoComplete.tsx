import React, { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import Input, { InputProps } from "../Input";
import { useClassNames, useClickOutsize, useDebounce, useUlScroll } from "../../hooks";
import cls from "classnames";
import Transition from "../Transition/transition";
import Icon from "../Icon";
interface OptionType {
	/**选项标签 */
	label?: string | React.ReactNode;
	/**选项值 */
	value?: string;
	[key: string]: any;
}

/**option的映射方式 */
interface FieldNamesType {
	/**标签映射字段 */
	label: string;
	/**实际值映射字段 */
	value: string;
}
export interface AutoCompleteProps extends Omit<InputProps, "onSelect"> {
	/** 获取suggestions的回调函数 */
	fetchSuggestions: (keyWord: string) => OptionType[] | Promise<OptionType[]>;
	/**选中回调函数 */
	onSelect?: (suggestion: OptionType) => void;
	/**option的映射方式 */
	fieldNames?: FieldNamesType;
}

const displayName = "AutoComplete";
const classNamePrefix = "auto-complete";

/**自动补全组件 */
export const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
	const { fetchSuggestions, onSelect, className, onChange, value, fieldNames, onKeyDown, onInput, ...restProps } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const shouldFetch = useRef<boolean>(false);
	const suggestionsRef = useRef<HTMLUListElement>(null);
	const containerRef = useRef(null);
	const [inputValue, setInputValue] = useState(""); //输入框值
	const [suggestions, setSuggestions] = useState<OptionType[]>([]); //popover中的suggestions
	const [popoverVisible, setPopoverVisible] = useState(false); //popover显隐
	const [activeIndex, setActiveIndex] = useState<number>(-1); //高亮index
	const [fetchLoading, setFetchLoading] = useState(true); //fetchSuggestions的loading
	const debounceInputValue = useDebounce<string>(inputValue, 300); //input的debounce值
	const autoCompleteGroupClassNames = useClassNames(cls(`${classNamePrefix}-group`));
	const autoCompleteInputClassNames = useClassNames(cls(`${classNamePrefix}-input`, className), className ? className.split(" ") : undefined);
	const autoCompletePopoverClassNames = useClassNames(cls(`${classNamePrefix}-popover`));
	const autoCompleteSuggestionsClassNames = useClassNames(cls(`${classNamePrefix}-suggestions`));
	const autoCompleteSuggestionClassNames = useClassNames(cls(`${classNamePrefix}-suggestion`));
	const fieldNamesMap = fieldNames as FieldNamesType;
	const { scrollDown, scrollUp } = useUlScroll(suggestionsRef, activeIndex);

	const onSuggestionSelectedHandler = (suggestion: OptionType) => {
		setPopoverVisible(false);
		onSelect?.(suggestion);
		if (inputRef.current) {
			const event = new Event("input", { bubbles: true });
			// 触发 input 事件并修改输入值 ****
			inputRef.current.value = suggestion[fieldNamesMap.value];
			inputRef.current.dispatchEvent(event);
			shouldFetch.current = false;
		}
	};

	const onInputKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>) => {
		let newActiveIndex;
		switch (e.key) {
			case "ArrowUp":
				newActiveIndex = scrollUp();
				if (typeof newActiveIndex !== "undefined") {
					setActiveIndex(newActiveIndex);
				}
				return;
			case "ArrowDown":
				newActiveIndex = scrollDown();
				if (typeof newActiveIndex !== "undefined") {
					setActiveIndex(newActiveIndex);
				}
				return;
			case "Enter":
				onSuggestionSelectedHandler(suggestions[activeIndex]);
				return;
			default:
		}
	};

	useMemo(() => {
		if (debounceInputValue === "" || !shouldFetch.current) return;
		setFetchLoading(true);
		setPopoverVisible(true);
		const results = fetchSuggestions(debounceInputValue);
		if (results instanceof Array) {
			setSuggestions(results);
			setPopoverVisible(results.length > 0);
			setFetchLoading(false);
		} else {
			results.then(
				(suggestions) => {
					setFetchLoading(false);
					setSuggestions(suggestions);
					setPopoverVisible(suggestions.length > 0);
					setActiveIndex(-1);
					return;
				},
				() => {
					setFetchLoading(false);
				},
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceInputValue]);

	useMemo(() => {
		setInputValue(value || "");
	}, [value]);

	const setPopoverVisibleFalse = useCallback(() => {
		setPopoverVisible(false);
	}, []);

	useClickOutsize(containerRef, setPopoverVisibleFalse);

	/* 因为考虑到ul是非行内元素，所以最外层的group用div */
	return (
		<div className={autoCompleteGroupClassNames}>
			<Input
				inputRef={inputRef}
				value={inputValue}
				onInput={(e: ChangeEvent<HTMLInputElement>) => {
					if (e.target.value === "") {
						setPopoverVisible(false);
					}
					shouldFetch.current = true;
					setInputValue(e.target.value);
					onChange?.(e);
					onInput?.(e);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					onInputKeyDownHandler(e);
				}}
				className={autoCompleteInputClassNames}
				{...restProps}
			/>
			<Transition visible={popoverVisible} type={"zoom-in-top"} timeout={300}>
				<div className={autoCompletePopoverClassNames}>
					{fetchLoading ? (
						<Icon icon="spinner" spin />
					) : (
						<ul className={autoCompleteSuggestionsClassNames} ref={suggestionsRef} aria-label="ul">
							{suggestions.map((suggestion, index) => {
								const suggestionClassNames = cls(autoCompleteSuggestionClassNames, {
									active: index === activeIndex,
								});
								return (
									<li
										key={index}
										onClick={() => onSuggestionSelectedHandler(suggestion)}
										className={suggestionClassNames}
										onMouseOver={() => setActiveIndex(index)}
										onMouseLeave={() => setActiveIndex(0)}
										aria-label="li"
									>
										{suggestion[fieldNamesMap.label]}
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</Transition>
		</div>
	);
};

AutoComplete.displayName = displayName;
AutoComplete.defaultProps = {
	fieldNames: {
		label: "label",
		value: "value",
	},
};
