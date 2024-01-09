import { CSSProperties, ReactNode, useContext, useMemo } from "react";
import cls from "classnames";
import { MenuContext } from "./menu";
import { useClassNames } from "../../hooks";
import React from "react";
export interface IMenuItemProps {
	disabled?: boolean;
	itemKey?: string; //item的标志位
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}
const displayName = "MenuItem";
const classNamePrefix = "menu-item";
const baseClassName = classNamePrefix;
export const MenuItem: React.FC<IMenuItemProps> = (props) => {
	const { disabled, itemKey, className, children, ...restProps } = props;
	const { activeKey, onSelectHandler } = useContext(MenuContext);
	const originClassNames = useMemo(() => {
		return cls(baseClassName, {
			disabled,
			[`${classNamePrefix}-active`]: activeKey === itemKey,
		});
	}, [activeKey, disabled, itemKey]);
	const classNames = cls(useClassNames(originClassNames), className);
	const onClickHandler = () => {
		onSelectHandler(itemKey as string);
	};
	return (
		<li key={itemKey} className={classNames} onClick={onClickHandler} {...restProps}>
			{children}
		</li>
	);
};
MenuItem.displayName = displayName;
MenuItem.defaultProps = {};
export default MenuItem;
