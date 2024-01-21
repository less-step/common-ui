import { Form as FormComponent, FormRef } from "./form";
import { FormItem } from "./form-item";

export type TransFormType = typeof FormComponent & {
	Item: typeof FormItem;
};
/**表单组件 */
const TransForm = FormComponent as TransFormType;
TransForm.Item = FormItem;
export default TransForm;
export type { FormRef };
