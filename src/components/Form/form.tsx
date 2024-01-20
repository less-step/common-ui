import React, { HtmlHTMLAttributes, ReactNode, useImperativeHandle } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import { FormItem } from "./form-item";
import { ErrorResult, FieldsState, useStore } from "../../hooks/useStore";
import Button from "../Button/button";
export interface FormBaseProps {
	/**表单初始值，优先级低于Form.Item的initialValue */
	initialValue?: Record<string, any>;
	/**表单name字段 */
	name?: string;
	/**子节点 */
	children?: ReactNode;
	/**布局方式 */
	layout?: "horizontal" | "vertical" | "inline";
	onFinish?: (formValue: Record<string, any>) => void;
	onFinishFail?: (errors: ErrorResult) => void;
}

type FormProps = FormBaseProps & HtmlHTMLAttributes<HTMLFormElement>;
const displayName = "Form";
const classNamePrefix = "form";
const baseClassName = classNamePrefix;

export type FormRef = Pick<ReturnType<typeof useStore>, "getFieldsValue" | "getFieldValue" | "setFieldValue" | "setFieldsValue" | "resetFields" | "validateFields">;
export type FormContextType = Pick<ReturnType<typeof useStore>, "addField" | "updateField" | "fields" | "validateField"> & { formInitialValue?: Record<string, any> };
export const FormContext = React.createContext<FormContextType>({} as FormContextType);
const FormComponent = React.forwardRef<FormRef, FormProps>((props, ref) => {
	const { initialValue, name, children, className, layout, onFinish, onFinishFail, ...restProps } = props;
	const { fields, addField, updateField, validateField, validateFields, resetFields, getFieldsValue, getFieldValue, setFieldValue, setFieldsValue } = useStore();
	const formClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const formContextValue = {
		addField,
		updateField,
		fields,
		formInitialValue: initialValue,
		validateField,
	};
	useImperativeHandle(ref, () => {
		return {
			getFieldValue,
			getFieldsValue,
			setFieldValue,
			setFieldsValue,
			validateFields,
			resetFields,
		};
	});
	return (
		<FormContext.Provider value={formContextValue}>
			<form
				{...restProps}
				name={name}
				className={formClassName}
				onSubmit={(e) => {
					e.stopPropagation();
					e.preventDefault();
					validateFields().then(
						(formValue) => {
							onFinish?.(formValue as FieldsState);
						},
						(error) => {
							console.log(error);
							onFinishFail?.(error);
						},
					);
				}}
			>
				{children}
			</form>
		</FormContext.Provider>
	);
});

type form = typeof FormComponent & { Item: typeof FormItem };
export const Form: form = FormComponent as any;
Form.Item = FormItem;
Form.displayName = displayName;
Form.defaultProps = {
	name: "less-step-form",
	layout: "horizontal",
};
(Form as any).Item = FormItem;
