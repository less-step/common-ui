import React, { InputHTMLAttributes, ReactNode } from "react";
import { DEFAULT_SIZE, SIZE } from "../../consts";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import Icon from "../Icon/icon";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
export interface InputBaseProps {
	disabled?: boolean;
	readonly?: boolean;
	icon?: IconProp;
	prepend?: string | ReactNode;
	append?: string | ReactNode;
	size?: SIZE;
	placeholder?: string;
}
type OmitKeys = "size" | "disabled";
type InputProps = Partial<Omit<InputHTMLAttributes<HTMLElement>, OmitKeys> & InputBaseProps>;

const displayName = "Input";
const classNamePrefix = "input";
const baseClassName = classNamePrefix;
const inputGroupBaseClassName = `${baseClassName}-group`;
export const Input: React.FC<InputProps> = (props) => {
	const { disabled, readonly, size, icon, prepend, append, className, style, placeholder, ...resetProps } = props;
	const inputGroupClassNames = useClassNames(
		cls(inputGroupBaseClassName, className, {
			disabled,
			readonly,
			[`${inputGroupBaseClassName}-${size}`]: size !== DEFAULT_SIZE,
		}),
		className ? [className] : undefined,
	);
	const inputWrapperClassNames = useClassNames(`${classNamePrefix}-wrapper`);
	const inputPrependClassNames = useClassNames(`${classNamePrefix}-prepend`);
	const inputAppendClassNames = useClassNames(`${classNamePrefix}-append`);
	const inputIconClassNames = useClassNames(`${classNamePrefix}-icon`);

	return (
		<span className={inputGroupClassNames} style={style}>
			{prepend && <span className={inputPrependClassNames}>{prepend}</span>}

			<span className={inputWrapperClassNames} tabIndex={-1}>
				{icon && <Icon icon={icon} className={inputIconClassNames} />}
				<input type="text" placeholder={placeholder} {...resetProps} />
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
