import React, { HtmlHTMLAttributes, ReactElement, ReactNode, useContext, useEffect, useMemo } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import { FormContext } from "./form";
import { FieldDetail } from "../../hooks/useStore";
import type { SomeRequired } from "../../consts/types";

export interface FormItemBaseProps extends Partial<FieldDetail> {
	children?: ReactNode;
	/**初始值 */
	initialValue?: any;
	/**item标签 */
	label?: string;
	/**组件中value的实际字段名 */
	valuePropName?: string;
	/**触发change的函数名 */
	trigger?: string;
	/**从trigger函数中获取value的方式 */
	getValueProp?: (e: any) => any;
	/**验证字段值的函数名 */
	validate?: string;
}

type FormItemProps = FormItemBaseProps & HtmlHTMLAttributes<HTMLDivElement>;
const displayName = "FormItem";
const classNamePrefix = "form-item";
const baseClassName = classNamePrefix;
/**表单项组件 */
export const FormItem: React.FC<FormItemProps> = (props) => {
	const { initialValue, name, children, className, label, rules, valuePropName, trigger, getValueProp, validate, ...restProps } = props as SomeRequired<
		FormItemProps,
		"trigger" | "getValueProp" | "valuePropName" | "validate"
	>;
	const { addField, updateField, fields, formInitialValue, validateField } = useContext(FormContext);

	const isRequired = name && fields[name]?.rules?.some((rule) => typeof rule !== "function" && rule.required);

	const formItemClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const formItemLabelClassName = useClassNames(
		cls(`${classNamePrefix}-label`, {
			required: isRequired,
		}),
		["required"],
	);
	const formItemContainerClassName = useClassNames(cls(`${classNamePrefix}-container`));
	const formItemContentClassName = useClassNames(cls(`${classNamePrefix}-content`));
	const formItemAlertClassName = useClassNames(cls(`${classNamePrefix}-alert`));
	const value = name && fields[name]?.value;
	const isValid = !name || fields[name]?.isValid;
	const errorMessages = (name && fields[name]?.errors?.map((e) => e.message)) || [];
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
				/**值更新函数 */
				const onValueUpdate = (e: any) => {
					if (name) {
						updateField(name, {
							value: getValueProp(e),
						});
					}
					(firstChild.props as any)?.onChange?.(e);
				};
				/**验证函数 */
				const onValidate = (e: any) => {
					(firstChild.props as any)?.[validate]?.(e);
					// 如果更新和验证都是同一个函数，那在验证前会更新内容，但是更新是异步的，所以validate的时候应该用最新的值
					if (validate === trigger) {
						onValueUpdate(e);
					}
					name && validateField(name, getValueProp(e));
				};
				//value,onChange,validate注入
				const controllProps = {
					[valuePropName]: value,
					[trigger]: onValueUpdate,
					[validate]: onValidate,
					className: isValid ? className : cls(className, "danger"),
				};

				return React.cloneElement(firstChild, controllProps);
			}
		}
	}, [children, trigger, value, getValueProp, updateField, name, valuePropName, validate, validateField, isValid, className]);

	useEffect(() => {
		let value;
		if (typeof initialValue === "undefined" || initialValue === null) {
			value = name && formInitialValue?.[name];
		} else {
			value = initialValue;
		}
		if (name) {
			addField(name, {
				name,
				rules,
				value,
				errors: [],
				isValid: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={formItemClassName} {...restProps}>
			{label && <div className={formItemLabelClassName}>{label} :</div>}
			<div className={formItemContainerClassName}>
				<div className={formItemContentClassName}>{controlledComponent}</div>
				<ol className={formItemAlertClassName}>
					{errorMessages.map((message, index) => {
						return (
							<li key={index}>
								{index + 1} . {message}
							</li>
						);
					})}
				</ol>
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
	validate: "onBlur",
	rules: [],
};
