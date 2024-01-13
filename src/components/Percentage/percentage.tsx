import React, { FC, HtmlHTMLAttributes } from "react";
import { useClassNames } from "../../hooks";
import cls from "classnames";
import Icon, { IconModeType } from "../Icon/icon";
export type PercentageModeType = IconModeType;
export interface PercentageBasePropsType {
	rate: number;
	height?: number;
	theme?: PercentageModeType;
	loading?: boolean;
}
type PercentagePropsType = PercentageBasePropsType & HtmlHTMLAttributes<HTMLElement>;
const displayName = "Percentage";
const classNamePrefix = "percentage";
const baseClassName = classNamePrefix;
export const Percentage: FC<PercentagePropsType> = (props) => {
	const { className, rate, height, style, theme, loading, ...restProps } = props;
	const percentageClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const percentageGroupClassName = useClassNames(cls(`${classNamePrefix}-group`));
	const percentageBarClassName = useClassNames(
		cls(`${classNamePrefix}-bar`, {
			[`${classNamePrefix}-bar-loading`]: loading,
		}),
	);
	const percentageLoadingClassName = useClassNames(cls(`${classNamePrefix}-loading`));
	const percentageRateClassName = useClassNames(cls(`${classNamePrefix}-rate`));
	return (
		<div className={percentageGroupClassName}>
			<div className={percentageLoadingClassName} hidden={!loading}>
				<Icon icon="spinner" spin theme={theme} />
			</div>
			<div className={percentageClassName} style={{ ...style, height }} {...restProps}>
				<div
					className={percentageBarClassName}
					style={{
						width: `${rate}%`,
					}}
				></div>
			</div>
			<div className={percentageRateClassName}>{`${rate}%`}</div>
		</div>
	);
};

Percentage.displayName = displayName;
Percentage.defaultProps = {
	theme: "primary",
};
