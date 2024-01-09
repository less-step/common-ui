import React, { ButtonHTMLAttributes, CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { SIZE, DEFAULT_SIZE } from "../../consts";
import { useClassNames } from "../../hooks";
import cls from "classnames";
import Transition from "../Transition/transition";
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
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [isShadowShow, setIsShadowShow] = useState(false);
	const buttonShadowClassNames = useClassNames(`${classNamePrefix}-shadow`);
	const buttonWrapperClassNames = useClassNames(`${classNamePrefix}-wrapper`);
	useEffect(() => {
		function toggleShadow() {
			setIsShadowShow((isShadowShow) => {
				return !isShadowShow;
			});
		}
		buttonRef.current?.addEventListener("click", toggleShadow);
	}, []);

	if (btnType === "link") {
		return (
			<a className={classNames} {...restProps} href={href} target="__blank">
				{children}
			</a>
		);
	} else {
		return (
			<span className={buttonWrapperClassNames}>
				<button className={classNames} {...restProps} disabled={disabled} ref={buttonRef}>
					{children}
				</button>
				<Transition timeout={600} type="scale-and-disappear" visible={isShadowShow}>
					<span className={buttonShadowClassNames}></span>
				</Transition>
			</span>
		);
	}
};

Button.defaultProps = {
	size: DEFAULT_SIZE,
};

Button.displayName = displayName;

export default Button;
