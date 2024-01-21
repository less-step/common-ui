import { CSSProperties, ReactNode, useContext, useMemo } from "react";
import cls from "classnames";
import { MenuContext } from "./menu";
import { useClassNames } from "../../hooks";
import React from "react";
export interface IMenuItemProps {
	/**是否禁用 */
	disabled?: boolean;
	/**菜单项键值 */
	itemKey?: string; //item的标志位
	/**类名 */
	className?: string;
	/**内联样式 */
	style?: CSSProperties;
	/**子节点 */
	children?: ReactNode;
}
const displayName = "MenuItem";
const classNamePrefix = "menu-item";
const baseClassName = classNamePrefix;
/**菜单项 */
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
