import { CSSProperties, ReactNode } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import { SIZE } from "../../consts";
import React from "react";
export interface SpaceProps {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	size?: SIZE;
	direction?: "column" | "row" | "column-reverse" | "row-reverse";
}

const displayName = "Space";
const classNamePrefix = "space";
const baseClassName = classNamePrefix;

export const Space: React.FC<SpaceProps> = (props) => {
	const { className, style, children, size, direction, ...rest } = props as Required<SpaceProps>;
	const spaceClassName = useClassNames(
		cls(className, baseClassName, {
			[`${baseClassName}-${size}`]: size !== "mid",
		}),
		className ? className.split(" ") : [],
	);
	const spaceItemClassName = useClassNames(cls(`${baseClassName}-item`));
	return (
		<div className={spaceClassName} {...rest} style={{ flexDirection: direction }}>
			{React.Children.map(children, (child, index) => {
				return (
					<div className={spaceItemClassName} key={index}>
						{child}
					</div>
				);
			})}
		</div>
	);
};
Space.displayName = displayName;
Space.defaultProps = {
	size: "mid",
	direction: "row",
};
export default Space;
