import { IconProp } from "@fortawesome/fontawesome-svg-core";
import cls from "classnames";
import React, { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { DEFAULT_SIZE, SIZE } from "../../consts";
import { useClassNames } from "../../hooks";
import Icon from "../Icon";
interface InputBaseProps {
	/**是否禁用 */
	disabled?: boolean;
	/**是否只读 */
	readonly?: boolean;
	/**输入框内左侧图标 */
	icon?: IconProp;
	/**前缀 */
	prepend?: string | ReactNode;
	/**后缀 */
	append?: string | ReactNode;
	/**大小 */
	size?: SIZE;
	/**占位显示 */
	placeholder?: string;
	/**受控值 */
	value?: string;
	/**默认值 */
	defaultValue?: string;
	/**输入框修改回调函数 */
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	/**输入框Ref */
	inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}
type OmitKeys = "size" | "disabled" | "placeholder" | "value" | "onChange";

/**输入框属性 */
export type InputProps = Partial<Omit<InputHTMLAttributes<HTMLElement>, OmitKeys> & InputBaseProps>;

const displayName = "Input";
const classNamePrefix = "input";
const baseClassName = classNamePrefix;
const inputGroupBaseClassName = `${baseClassName}-group`;

/**输入框组件 */
export const Input: React.FC<InputProps> = (props) => {
	const { disabled, readonly, size, icon, prepend, append, className, placeholder, onChange, inputRef, ...resetProps } = props;
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
		<span className={inputGroupClassNames}>
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
