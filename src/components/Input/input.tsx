import { IconProp } from "@fortawesome/fontawesome-svg-core";
import cls from "classnames";
import React, { ChangeEvent, InputHTMLAttributes, ReactNode, RefObject } from "react";
import { DEFAULT_SIZE, SIZE } from "../../consts";
import { useClassNames } from "../../hooks";
import { AutoComplete, AutoCompleteProps } from "../AutoComplete/autoComplete";
import Icon from "../Icon/icon";
interface InputBaseProps {
	disabled?: boolean;
	readonly?: boolean;
	icon?: IconProp;
	prepend?: string | ReactNode;
	append?: string | ReactNode;
	size?: SIZE;
	placeholder?: string;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}
type OmitKeys = "size" | "disabled" | "placeholder" | "value" | "onChange";
type SubComponents = {
	AutoComplete: React.FC<AutoCompleteProps>;
};
export type InputProps = Partial<Omit<InputHTMLAttributes<HTMLElement>, OmitKeys> & InputBaseProps>;

const displayName = "Input";
const classNamePrefix = "input";
const baseClassName = classNamePrefix;
const inputGroupBaseClassName = `${baseClassName}-group`;

export const Input: React.FC<InputProps> & SubComponents = (props) => {
	const { disabled, readonly, size, icon, prepend, append, className, style, placeholder, onChange, inputRef, ...resetProps } = props;
	if ("value" in props) {
		delete resetProps.defaultValue;
		if (resetProps.value === null || typeof resetProps.value === "undefined") {
			resetProps.value = "";
		}
	}
	const inputGroupClassNames = useClassNames(
		cls(inputGroupBaseClassName, {
			disabled,
			readonly,
			[`${inputGroupBaseClassName}-${size}`]: size !== DEFAULT_SIZE,
		}),
	);
	const inputWrapperClassNames = useClassNames(`${classNamePrefix}-wrapper`);
	const inputPrependClassNames = useClassNames(`${classNamePrefix}-prepend`);
	const inputAppendClassNames = useClassNames(`${classNamePrefix}-append`);
	const inputIconClassNames = useClassNames(`${classNamePrefix}-icon`);
	//经过验证还是将外部className传递给input标签
	const inputClassNames = useClassNames(
		cls(`${classNamePrefix}`, className, {
			"has-icon": !!icon,
		}),
		["has-icon", ...(className ? className.split(" ") : [])],
	);
	return (
		<span className={inputGroupClassNames} style={style}>
			{prepend && <span className={inputPrependClassNames}>{prepend}</span>}
			<span className={inputWrapperClassNames} tabIndex={-1}>
				{icon && <Icon icon={icon} className={inputIconClassNames} />}
				<input ref={inputRef} type="text" placeholder={placeholder} className={inputClassNames} onChange={onChange} {...resetProps} />
			</span>
			{append && <span className={inputAppendClassNames}>{append}</span>}
		</span>
	);
};

Input.defaultProps = {
	size: DEFAULT_SIZE,
};
Input.displayName = displayName;
export default Input;

Input.AutoComplete = AutoComplete;
