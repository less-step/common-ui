import React, { HtmlHTMLAttributes, ReactElement, ReactNode, useContext, useEffect, useMemo } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import { FormContext } from "./form";
import { FieldDetail } from "../../hooks/useStore";
export interface FormItemBaseProps extends Partial<FieldDetail> {
	children?: ReactNode;
	initialValue?: any;
	label?: string;
	valuePropName?: string;
	trigger?: string;
	getValueProp?: (e: any) => any;
}

type FormItemProps = FormItemBaseProps & HtmlHTMLAttributes<HTMLDivElement>;
const displayName = "FormItem";
const classNamePrefix = "form-item";
const baseClassName = classNamePrefix;
export const FormItem: React.FC<FormItemProps> = (props) => {
	const { initialValue, name, children, className, label, rules, valuePropName = "value", trigger = "onChange", getValueProp = (e: any) => e.target.value, ...restProps } = props;
	const formItemClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const formItemLabelClassName = useClassNames(cls(`${classNamePrefix}-label`));
	const formItemContainerClassName = useClassNames(cls(`${classNamePrefix}-container`));
	const formItemContentClassName = useClassNames(cls(`${classNamePrefix}-content`));
	const formItemAlertClassName = useClassNames(cls(`${classNamePrefix}-alert`));
	const { addField, updateField, fields, formInitialValue } = useContext(FormContext);
	const value = name && fields[name]?.value;

	//受控组件
	const controlledComponent = useMemo(() => {
		const childList = React.Children.toArray(children) as ReactElement[];
		if (childList.length === 0) {
			return childList;
		} else {
			const firstChild = childList[0];
			if (!React.isValidElement(firstChild)) {
				return firstChild;
			} else {
				const onValueUpdate = (e: any) => {
					if (name) {
						updateField(name, {
							value: getValueProp(e),
						});
					}
				};
				const controllProps = {
					[valuePropName]: value,
					[trigger]: onValueUpdate,
				};
				return React.cloneElement(firstChild, controllProps);
			}
		}
	}, [children, trigger, value, getValueProp, updateField, name, valuePropName]);

	useEffect(() => {
		const value = initialValue || (name && formInitialValue?.[name]);
		if (name) {
			addField(name, {
				name,
				rules,
				value,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={formItemClassName} {...restProps}>
			{label && <div className={formItemLabelClassName}>{label} :</div>}
			<div className={formItemContainerClassName}>
				<div className={formItemContentClassName}>{controlledComponent}</div>
				<div className={formItemAlertClassName}>测试数据</div>
			</div>
		</div>
	);
};

FormItem.displayName = displayName;
FormItem.defaultProps = {
	trigger: "onChange",
	getValueProp(e) {
		return e.target.value;
	},
	valuePropName: "value",
};
FormItem.defaultProps = {};
