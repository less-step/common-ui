import { CSSProperties, ReactNode, useState } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import React from "react";
import MenuItem, { IMenuItemProps } from "./menuItem";
import SubMenu from "./subMenu";
type MenuMode = "vertical" | "horizontal";

interface IMenuBaseProps {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	defaultActiveKey?: string;
	mode?: MenuMode;
	onSelect?: (selectedKey: string) => void;
}
type IMenuProps = IMenuBaseProps;

const displayName = "Menu";
const classNamePrefix = "menu";
const baseClassName = classNamePrefix;
export const MenuContext = React.createContext<{
	activeKey: string | undefined;
	onSelectHandler: (selectedKey: string) => void;
	mode: string;
}>({
	activeKey: "",
	onSelectHandler: () => {},
	mode: "horizontal",
});
const MenuAcceptedChildTypes = [MenuItem.displayName, SubMenu.displayName];
export const Menu: React.FC<IMenuProps> = (props) => {
	const { children, defaultActiveKey, className, mode, onSelect, style, ...restProps } = props;
	const [activeKey, setActiveKey] = useState(defaultActiveKey);
	const originalClassNames = cls(baseClassName, {
		[`${classNamePrefix}-${mode}`]: mode,
	});
	const onSelectHandler = (selectedKey: string) => {
		setActiveKey(selectedKey);
		onSelect?.(selectedKey);
	};
	const classNames = cls(useClassNames(originalClassNames), className);
	return (
		<MenuContext.Provider value={{ activeKey, onSelectHandler, mode: mode as string }}>
			<ul className={classNames} style={style} {...restProps}>
				{React.Children.map(children, (child, index) => {
					const childElement = child as React.FunctionComponentElement<IMenuItemProps>;
					if (MenuAcceptedChildTypes.includes(childElement?.type?.displayName)) {
						return React.cloneElement(childElement, {
							itemKey: childElement.props.itemKey || index.toString(),
						});
					} else {
						console.warn("Menu组件的children中存在节点不是MenuItem或SubMenu");
					}
				})}
			</ul>
		</MenuContext.Provider>
	);
};

Menu.displayName = displayName;
Menu.defaultProps = {
	mode: "horizontal",
};

export default Menu;
