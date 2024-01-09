import React, { ButtonHTMLAttributes, CSSProperties, ReactNode, useMemo } from "react";
import { SIZE, DEFAULT_SIZE } from "../../consts";
import { useClassNames } from "../../hooks";
import cls from "classnames";
type TBtnType = "link" | "primary" | "default";
interface IButtonBaseProps {
	/**按钮类型 */
	btnType?: TBtnType;
	/**是否禁用 */
	disabled?: boolean;
	/**大小 */
	size?: SIZE;
	/**类名 */
	className?: string;
	/**样式 */
	style?: CSSProperties;
	/**子节点 */
	children?: ReactNode;
	/**是否危险 */
	danger?: boolean;
	/**链接地址 */
	href?: string;
}
type IButtonProps = Partial<IButtonBaseProps & ButtonHTMLAttributes<HTMLElement>>;
const displayName = "Button";
const classNamePrefix = "btn";
const baseClassName = classNamePrefix;
/**
 * ### 页面中最常见的元素按钮
 * ```js
 * 	import Button from 'less-step'
 * ```
 * @param props
 * @returns
 */
export const Button: React.FC<IButtonProps> = (props) => {
	const { btnType, disabled, size, className, children, danger, href, ...restProps } = props;
	const originalClassNames = useMemo(() => {
		return cls(baseClassName, {
			[`${classNamePrefix}-${btnType}`]: btnType,
			[`${classNamePrefix}-danger`]: danger,
			[`${classNamePrefix}-${size}`]: size !== DEFAULT_SIZE,
			disabled,
		});
	}, [btnType, size, disabled, danger]);
	const classNames = cls(useClassNames(originalClassNames), className);

	if (btnType === "link") {
		return (
			<a className={classNames} {...restProps} href={href} target="__blank">
				{children}
			</a>
		);
	} else {
		return (
			<button className={classNames} {...restProps} disabled={disabled}>
				{children}
			</button>
		);
	}
};

Button.defaultProps = {
	size: DEFAULT_SIZE,
};

Button.displayName = displayName;

export default Button;
