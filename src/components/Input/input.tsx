import React, { InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { DEFAULT_SIZE, SIZE } from "../../consts";
import { MergeTypes } from "../../consts/types";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import Icon from "../Icon/icon";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Transition from "../Transition/transition";
export interface InputBaseProps {
	disabled?: boolean;
	readonly?: boolean;
	icon?: IconProp;
	prepend?: string | ReactNode;
	append?: string | ReactNode;
	size?: SIZE;
	placeholder?: string;
}

type InputProps = Partial<MergeTypes<InputHTMLAttributes<HTMLElement>, InputBaseProps>>;

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
		<span className={inputGroupClassNames} {...resetProps}>
			{prepend && <span className={inputPrependClassNames}>{prepend}</span>}

			<span className={inputWrapperClassNames}>
				{icon && <Icon icon={icon} className={inputIconClassNames} />}
				<input type="text" placeholder={placeholder} />
			</span>

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
