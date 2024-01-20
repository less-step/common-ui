import { useCallback, useReducer, useRef, useState } from "react";
import type { RuleItem, ValidateError } from "async-validator";
import Schema from "async-validator";
import { mapValues, each } from "lodash";
export interface FormState {
	isValid?: boolean;
	isSubmitting?: boolean;
	errors: Record<string, ValidateError[]>;
}

interface FormController {
	getFieldValue: (name: string) => any;
}
export interface ErrorResult {
	errors: ValidateError[];
	fields: Record<string, ValidateError[]>;
}
export type CustomRuleItem = RuleItem | ((formController: FormController) => RuleItem);
export interface FieldDetail {
	/**field唯一标识 */
	name?: string;
	/**field值 */
	value?: any;
	/**field是否合法 */
	isValid?: boolean;
	/**field的验证规则 */
	rules?: CustomRuleItem[];
	/**field验证失败的原因 */
	errors?: ValidateError[];
}

export interface FieldsState {
	[key: string]: FieldDetail;
}

export type FieldActionType = "AddField" | "EditField" | "ValidateField" | "EditFields" | "ResetFields";

export interface FieldAction {
	type: FieldActionType;
	name: string;
	payload: FieldDetail;
}
export interface FieldsAction {
	type: FieldActionType;
	payload: FieldsState;
}
export const FieldActionTypes = {
	AddField: "AddField",
	EditField: "EditField",
	ValidateField: "ValidateField",
	EditFields: "EditFields",
	ResetFields: "ResetFields",
};

const initialFormState: FormState = { isValid: true, errors: {}, isSubmitting: false };
function fieldReduce(state: FieldsState, action: FieldAction | FieldsAction): FieldsState {
	if ((action as FieldAction).name) {
		let fieldAction = action as FieldAction;
		switch (fieldAction.type) {
			case FieldActionTypes.AddField:
				return {
					...state,
					[fieldAction.name]: { ...fieldAction.payload },
				};
			case FieldActionTypes.EditField:
				return {
					...state,
					[fieldAction.name]: {
						...state[fieldAction.name],
						value: fieldAction.payload.value,
					},
				};
			case FieldActionTypes.ValidateField:
				return {
					...state,
					[fieldAction.name]: {
						...state[fieldAction.name],
						isValid: fieldAction.payload.isValid,
						errors: fieldAction.payload.errors,
					},
				};

			default:
				return {
					...state,
				};
		}
	} else {
		let fieldsAction = action as FieldsAction;
		switch (fieldsAction.type) {
			case FieldActionTypes.EditFields:
				return {
					...mapValues(state, (field, key) => ({ ...field, ...fieldsAction.payload[key] })),
				};
			case FieldActionTypes.ResetFields:
				return {
					...(action.payload as FieldsState),
				};
			default:
				return {
					...state,
				};
		}
	}
}
export const useStore = () => {
	const initialFieldsState = useRef<Record<string, FieldDetail>>({});
	const [fields, dispatch] = useReducer<typeof fieldReduce>(fieldReduce, {});
	const [form, setForm] = useState<FormState>(initialFormState);
	const addField = useCallback((name: string, payload: FieldDetail) => {
		initialFieldsState.current[name] = { ...payload };
		dispatch({
			type: "AddField",
			name,
			payload,
		});
	}, []);
	const updateField = useCallback((name: string, payload: FieldDetail) => {
		dispatch({
			type: "EditField",
			name,
			payload,
		});
	}, []);

	const getFieldValue = useCallback(
		(name: string) => {
			return fields[name].value;
		},
		[fields],
	);

	const getFieldsValue = useCallback(() => {
		return mapValues(fields, (field) => field.value);
	}, [fields]);

	const setFieldValue = useCallback(
		(name: string, value: any) => {
			updateField(name, { name, value });
		},
		[updateField],
	);

	const setFieldsValue = useCallback((values: any) => {
		dispatch({
			type: "EditFields",
			payload: mapValues(values, (value) => ({ value })),
		});
	}, []);

	const resetFields = useCallback(() => {
		dispatch({
			type: "ResetFields",
			payload: initialFieldsState.current,
		});
	}, []);

	const transformRuleItem = useCallback(
		(rules: CustomRuleItem[], dirtyData?: { name: string; value: any }) => {
			return rules.map((rule) => {
				if (typeof rule === "function") {
					//解决数据异步刷新问题，如果change和validate触发函数是同名的情况，
					//会出现field字段滞后的问题，所以就需要验证一下哪个数据是脏的，如果有字段是脏的，则直接用新数据
					const getFieldValueDirty = (name: string) => {
						if (name === dirtyData?.name) {
							return dirtyData.value;
						} else {
							return getFieldValue(name);
						}
					};
					return rule({ getFieldValue: getFieldValueDirty });
				} else {
					return rule;
				}
			});
		},
		[getFieldValue],
	);

	const validateField = useCallback(
		(name: string, value: any) => {
			const descriptor = {
				[name]: transformRuleItem(fields[name].rules as CustomRuleItem[], { name, value }),
			};
			const field = {
				[name]: value,
			};
			const validator = new Schema(descriptor);
			validator.validate(field).then(
				() => {
					dispatch({
						type: "ValidateField",
						name,
						payload: {
							isValid: true,
							errors: [],
						},
					});
				},
				(result: ErrorResult) => {
					dispatch({
						type: "ValidateField",
						name,
						payload: {
							isValid: false,
							errors: result.errors,
						},
					});
				},
			);
		},
		[dispatch, fields, transformRuleItem],
	);

	const validateFields = useCallback(async () => {
		const descriptor = mapValues(fields, (field) => transformRuleItem(field.rules as CustomRuleItem[]));
		const fieldsState = mapValues(fields, (field) => field.value);
		const validator = new Schema(descriptor);
		setForm((form) => ({ ...form, isSubmitting: true }));
		let isValid = true;
		try {
			await validator.validate(fieldsState);
		} catch (error: any) {
			let e = error as ErrorResult;
			let newFields: Record<string, FieldDetail> = {};
			each(fields, (value, name) => {
				if (e.fields[name]) {
					isValid = false;
					newFields[name] = { isValid: false, errors: e.fields[name] };
				} else {
					newFields[name] = { isValid: true, errors: [] };
				}
			});
			dispatch({
				type: "EditFields",
				payload: newFields,
			});
			setForm((form) => ({ ...form, isValid, isSubmitting: false }));
			return Promise.reject(e.fields);
		} finally {
			if (isValid) {
				dispatch({
					type: "EditFields",
					payload: mapValues(fields, (field) => ({ isValid: true, errors: [] })),
				});
				setForm((form) => ({ ...form, isValid: true, isSubmitting: false, errors: {} }));
				return Promise.resolve(fieldsState);
			}
		}
	}, [fields, transformRuleItem]);

	return {
		fields,
		form,
		addField,
		updateField,
		validateField,
		setForm,
		validateFields,
		getFieldValue,
		getFieldsValue,
		setFieldValue,
		setFieldsValue,
		resetFields,
	};
};
