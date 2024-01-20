import React, { HtmlHTMLAttributes, ReactNode } from "react";
import cls from "classnames";
import { useClassNames } from "../../hooks";
import { FormItem } from "./form-item";
import { useStore } from "../../hooks/useStore";
export interface FormBaseProps {
	initialValue?: Record<string, any>;
	name?: string;
	children?: ReactNode;
	layout?: "horizontal" | "vertical" | "inline";
}

type FormProps = FormBaseProps & HtmlHTMLAttributes<HTMLFormElement>;
const displayName = "Form";
const classNamePrefix = "form";
const baseClassName = classNamePrefix;

export type FormContextType = Pick<ReturnType<typeof useStore>, "addField" | "updateField" | "fields"> & { formInitialValue?: Record<string, any> };
export const FormContext = React.createContext<FormContextType>({} as FormContextType);
export const Form: React.FC<FormProps> & { Item: typeof FormItem } = (props) => {
	const { initialValue, name, children, className, layout, ...restProps } = props;
	const { form, fields, addField, updateField, setForm } = useStore();
	const formClassName = useClassNames(cls(baseClassName, className), className ? className.split(" ") : []);
	const formContextValue = {
		addField,
		updateField,
		fields,
		formInitialValue: initialValue,
	};
	return (
		<FormContext.Provider value={formContextValue}>
			<form name={name} className={formClassName} {...restProps}>
				{children}
			</form>
			<div style={{ padding: "24px" }}>
				<pre>form:{JSON.stringify(form, null, 4)}</pre>
				<pre>fields:{JSON.stringify(fields, null, 4)}</pre>
			</div>
		</FormContext.Provider>
	);
};

Form.displayName = displayName;
Form.defaultProps = {};
Form.Item = FormItem;
