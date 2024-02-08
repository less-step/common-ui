import React, { FC, HtmlHTMLAttributes } from "react";
import { useClassNames } from "../../hooks";
import cls from "classnames";
import Icon, { IconModeType } from "../Icon";
export type PercentageModeType = IconModeType;
export interface PercentageBaseProps {
	/**百分比 */
	rate: number;
	/**高度 */
	height?: number;
	/**主题 */
	theme?: PercentageModeType;
	/**是否加载状态 */
	loading?: boolean;
}
export type PercentageProps = PercentageBaseProps & HtmlHTMLAttributes<HTMLElement>;
const displayName = "Percentage";
const classNamePrefix = "percentage";
const baseClassName = classNamePrefix;
/**百分比组件 */
export const Percentage: FC<PercentageProps> = (props) => {
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
