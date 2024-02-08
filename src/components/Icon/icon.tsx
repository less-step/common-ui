import React, { CSSProperties } from "react";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);
export type IconModeType = "primary" | "secondary" | "danger" | "success" | "warning" | "light" | "dark";
interface IconBaseProps {
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
export type IconProps = Omit<FontAwesomeIconProps, "icon"> & IconBaseProps;
const displayName = "Icon";
const classNamePrefix = "icon";
const baseClassName = classNamePrefix;
const Icon: React.FC<IconProps> = (props) => {
	const { className, icon, theme, ...restProps } = props;
	const originClassNames = cls(baseClassName, {
		[`${classNamePrefix}-${theme}`]: theme,
	});
	const classNames = cls(useClassNames(originClassNames), className);
	return <FontAwesomeIcon icon={icon as IconProp} className={classNames} {...restProps} style={{ width: "1em", height: "1em" }} />;
};

Icon.displayName = displayName;
Icon.defaultProps = {
	theme: "dark",
};
export default Icon;
