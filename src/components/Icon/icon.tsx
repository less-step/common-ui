import { CSSProperties } from "react";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import cls from "classnames";
import { useClassNames } from "../../hooks";
library.add(fas);
type IconModeType = "primary" | "secondary" | "danger" | "success" | "warning" | "light" | "dark";
interface IIconBaseProps {
	className?: string;
	styles?: CSSProperties;
	theme?: IconModeType;
}
export type IconPropsType = FontAwesomeIconProps & IIconBaseProps;
const displayName = "Icon";
const classNamePrefix = "icon";
const baseClassName = classNamePrefix;
const Icon: React.FC<IconPropsType> = (props) => {
	const { className, icon, theme, ...restProps } = props;
	const originClassNames = cls(baseClassName, {
		[`${classNamePrefix}-${theme}`]: theme,
	});
	const classNames = cls(useClassNames(originClassNames), className);
	return <FontAwesomeIcon icon={icon} className={classNames} {...restProps} />;
};

Icon.displayName = displayName;
Icon.defaultProps = {
	theme: "dark",
};
export default Icon;
