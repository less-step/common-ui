import cls from "classnames";
import React, {
	CSSProperties,
	FunctionComponentElement,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { useClassNames } from "../../hooks";
import { MenuContext } from "./menu";
import MenuItem, { IMenuItemProps } from "./menuItem";
import Icon from "../Icon/icon";
import Transition from "../Transition/transition";
const displayName = "SubMenu";
const classNamePrefix = "submenu";
const baseClassName = classNamePrefix;

export interface ISubMenuProps {
	itemKey?: string;
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	title: string;
	disabled?: boolean;
	defaultExpanded?: boolean;
}
const SubMenuAcceptedChildTypes = [MenuItem.displayName];
export const SubMenu: React.FC<ISubMenuProps> = (props) => {
	const { itemKey, children, className, title, disabled, defaultExpanded, ...restProps } = props;
	const [expanded, setExpanded] = useState(defaultExpanded as boolean);
	const subMenuRef = useRef<HTMLLIElement>(null);
	const { mode, activeKey } = useContext(MenuContext);
	const isSubMenuActive = activeKey?.indexOf(itemKey as string) === 0;
	const originClassNames = cls(baseClassName, {
		disabled,
		[`${classNamePrefix}-${mode}`]: mode,
		[`${classNamePrefix}-active`]: isSubMenuActive,
	});
	const classNames = cls(useClassNames(originClassNames), className);
	const titleClassNames = useClassNames(cls(`${classNamePrefix}-title`));
	const togglerClassNames = cls(useClassNames(`${classNamePrefix}-title-toggler`), {
		reverse: expanded,
	});
	const togglerTheme = useMemo(() => {
		return isSubMenuActive ? "primary" : "dark";
	}, [isSubMenuActive]);
	const contentClassNames = useClassNames(cls(`${classNamePrefix}-content`));

	const onClickHandler = useCallback(() => {
		if (mode === "vertical") {
			setExpanded(!expanded);
		}
	}, [mode, expanded]);

	let timer: NodeJS.Timeout;
	const toggleExpandHandler = (e: React.MouseEvent, mode: string, toggle: boolean) => {
		timer && clearTimeout(timer);
		e.preventDefault();
		if (mode === "horizontal") {
			timer = setTimeout(() => {
				setExpanded(toggle);
			}, 100);
		}
	};
	const onMouseEnterHandler = (e: React.MouseEvent) => {
		toggleExpandHandler(e, mode, true);
	};
	const onMouseLeaveHandler = (e: React.MouseEvent) => {
		toggleExpandHandler(e, mode, false);
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
				<Icon icon="angle-down" className={togglerClassNames} theme={togglerTheme} />
			</p>
			<Transition visible={expanded} type="zoom-in-top" timeout={300}>
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
			</Transition>
		</li>
	);
};

SubMenu.displayName = displayName;
SubMenu.defaultProps = {
	defaultExpanded: false,
};
export default SubMenu;
