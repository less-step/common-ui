import React, { InputHTMLAttributes, ReactNode } from "react";
import { DEFAULT_SIZE, SIZE } from "../../consts";
import { MergeTypes } from "../../consts/types";
import cls from "classnames";
import { useClassNames } from "../../hooks";
interface InputBaseProps {
	disabled?: boolean;
	readonly?: boolean;
	icon?: string;
	prepend?: string | ReactNode;
	append?: string | ReactNode;
	size?: SIZE;
	placeholder?: string;
}

export type InputProps = Partial<MergeTypes<InputHTMLAttributes<HTMLElement>, InputBaseProps>>;

const displayName = "Input";
const classNamePrefix = "input";
const baseClassName = classNamePrefix;
export const Input: React.FC<InputProps> = (props) => {
	const { disabled, readonly, size, icon, prepend, append, className, placeholder, ...resetProps } = props;
	const originalClassNames = cls(baseClassName, className, {
		disabled,
		readonly,
		[`${classNamePrefix}-${size}`]: size !== DEFAULT_SIZE,
	});
	const classNames = useClassNames(originalClassNames);
	const inputGroupClassNames = useClassNames(`${classNamePrefix}-group`);
	const inputPrependClassNames = useClassNames(
		cls(`${classNamePrefix}-prepend`, {
			[`${classNamePrefix}-prepend-${size}`]: size !== DEFAULT_SIZE,
		}),
	);
	const inputAppendClassNames = useClassNames(`${classNamePrefix}-append`);
	return (
		<span className={inputGroupClassNames}>
			{prepend && <span className={inputPrependClassNames}>{prepend}</span>}
			<input type="text" className={classNames} {...resetProps} placeholder={placeholder} />
			{append && <span className={inputAppendClassNames}>{append}</span>}
		</span>
	);
};

Input.defaultProps = {
	size: DEFAULT_SIZE,
	prepend: "123",
	append: "1212",
};
Input.displayName = displayName;
export default Input;
