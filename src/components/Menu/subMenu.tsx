import React, {
	CSSProperties,
	FunctionComponentElement,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import cls from "classnames";
import { MenuContext } from "./menu";
import MenuItem, { IMenuItemProps } from "./menuItem";
import { useClassNames } from "../../hooks";
const displayName = "SubMenu";
const classNamePrefix = "submenu";
const baseClassName = classNamePrefix;

export interface ISubMenuProps {
	itemKey?: string;
	children?: ReactNode;
	className?: string;
	styles?: CSSProperties;
	title: string;
	disabled?: boolean;
	defaultExpanded?: boolean;
}
const SubMenuAcceptedChildTypes = [MenuItem.displayName];
const SubMenu: React.FC<ISubMenuProps> = (props) => {
	const { itemKey, children, className, title, disabled, defaultExpanded, ...restProps } = props;
	const [expanded, setExpanded] = useState(defaultExpanded);
	const subMenuRef = useRef<HTMLLIElement>(null);
	const { mode, activeKey } = useContext(MenuContext);
	const isSubMenuActive = activeKey?.indexOf(itemKey as string) === 0;
	const originClassNames = cls(baseClassName, className, {
		disabled,
		[`${classNamePrefix}-${mode}`]: mode,
		[`${classNamePrefix}-active`]: isSubMenuActive,
	});
	const classNames = useClassNames(originClassNames);
	const titleClassNames = useClassNames(cls(`${classNamePrefix}-title`));
	const contentClassNames = useClassNames(
		cls(`${classNamePrefix}-content`, {
			[`${classNamePrefix}-content-closed`]: !expanded,
		}),
	);

	const onClickHandler = useCallback(() => {
		if (mode === "vertical") {
			setExpanded(!expanded);
		}
	}, [mode, expanded]);

	const onMouseEnterHandler = () => {
		if (mode === "horizontal") setExpanded(true);
	};

	const onMouseLeaveHandler = () => {
		if (mode === "horizontal") setExpanded(false);
	};
	return (
		<li
			className={classNames}
			key={itemKey}
			ref={subMenuRef}
			onMouseEnter={onMouseEnterHandler}
			onMouseLeave={onMouseLeaveHandler}
			{...restProps}
		>
			<p className={titleClassNames} onClick={onClickHandler}>
				{title}
			</p>
			<ul className={contentClassNames}>
				{React.Children.map(children, (child, index) => {
					const childElement = child as FunctionComponentElement<IMenuItemProps>;
					if (SubMenuAcceptedChildTypes.includes(childElement.type.displayName)) {
						return React.cloneElement(childElement, {
							itemKey: `${itemKey}-${childElement.props.itemKey || index.toString()}`,
						});
					} else {
						console.warn("SubMenu组件的children中存在节点不是MenuItem");
					}
				})}
			</ul>
		</li>
	);
};

SubMenu.displayName = displayName;
export default SubMenu;
