import React, { CSSProperties } from "react";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);
export type IconModeType = "primary" | "secondary" | "danger" | "success" | "warning" | "light" | "dark";
interface IIconBaseProps {
	/**
	 * 主题
	 * ```
	 * 	theme类型: "primary" | "secondary" | "danger" | "success" | "warning" | "light" | "dark"
	 * ```
	 *  */
	theme?: IconModeType;
	icon: string;
	className?: string;
	style?: CSSProperties;
}
type IconPropsType = Omit<FontAwesomeIconProps, "icon"> & IIconBaseProps;
const displayName = "Icon";
const classNamePrefix = "icon";
const baseClassName = classNamePrefix;
const Icon: React.FC<IconPropsType> = (props) => {
	const { className, icon, theme, ...restProps } = props;
	const originClassNames = cls(baseClassName, {
		[`${classNamePrefix}-${theme}`]: theme,
	});
	const classNames = cls(useClassNames(originClassNames), className);
	return <FontAwesomeIcon icon={icon as IconProp} className={classNames} {...restProps} />;
};

Icon.displayName = displayName;
Icon.defaultProps = {
	theme: "dark",
};
export default Icon;
