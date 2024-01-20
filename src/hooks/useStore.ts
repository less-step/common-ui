import { useCallback, useReducer, useState } from "react";

export interface FormState {
	isValid?: boolean;
}

export interface FieldDetail {
	name: string;
	value: any;
	isValid: boolean;
	rules: any[];
	errors: any[];
}

export interface FieldsState {
	[key: string]: Partial<FieldDetail>;
}

export type FieldActionType = "AddField" | "EditField";

export interface FieldAction {
	type: FieldActionType;
	name: string;
	payload: Partial<FieldDetail>;
}

export const FieldActionTypes = {
	AddField: "AddField",
	EditField: "EditField",
};

const initialFieldsState: FieldsState = {};
const initialFormState: FormState = { isValid: true };
const fieldReduce = (state: FieldsState, action: FieldAction) => {
	switch (action.type) {
		case FieldActionTypes.AddField:
			return {
				...state,
				[action.name]: { ...action.payload },
			};
		case FieldActionTypes.EditField:
			return {
				...state,
				[action.name]: {
					...state[action.name],
					...action.payload,
				},
			};
		default:
			return {
				...state,
			};
	}
};
export const useStore = () => {
	const [fields, dispatch] = useReducer<typeof fieldReduce>(fieldReduce, initialFieldsState);
	const [form, setForm] = useState<FormState>(initialFormState);
	const addField = useCallback(
		(name: string, payload: Partial<FieldDetail>) => {
			dispatch({
				type: "AddField",
				name,
				payload,
			});
		},
		[dispatch],
	);
	const updateField = useCallback(
		(name: string, payload: Partial<FieldDetail>) => {
			dispatch({
				type: "EditField",
				name,
				payload,
			});
		},
		[dispatch],
	);
	return {
		fields,
		form,
		addField,
		updateField,
		setForm,
	};
};
