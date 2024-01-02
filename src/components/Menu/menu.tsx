import { CSSProperties, FunctionComponent, ReactNode, useState } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import React from "react";
import MenuItem, { IMenuItemProps } from "./menuItem";
import SubMenu from "./subMenu";
type MenuMode = "vertical" | "horizontal";

interface IMenuBaseProps {
	children?: ReactNode;
	className?: string;
	styles?: CSSProperties;
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
const Menu: React.FC<IMenuProps> & { Item: FunctionComponent<IMenuItemProps> } = (props) => {
	const { children, defaultActiveKey, className, mode, onSelect, ...restProps } = props;
	const [activeKey, setActiveKey] = useState(defaultActiveKey);
	const originalClassNames = cls(className, baseClassName, {
		[`${classNamePrefix}-${mode}`]: mode,
	});
	const onSelectHandler = (selectedKey: string) => {
		setActiveKey(selectedKey);
		onSelect?.(selectedKey);
	};
	const classNames = useClassNames(originalClassNames);
	return (
		<MenuContext.Provider value={{ activeKey, onSelectHandler, mode: mode as string }}>
			<ul className={classNames} {...restProps}>
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
Menu.Item = MenuItem;
export default Menu;
