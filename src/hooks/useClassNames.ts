import { APPNAME } from "../consts";
/**
 *
 * @param classNames 原始类名
 * @returns 添加应用名作为前缀后的类名（disabled,readonly,loading,circle,exclude除外)
 */
export const useClassNames = function (classNames: string, exclude?: string[]) {
	const cls = classNames.split(" ").map((className) => {
		if (className === "disabled" || className === "readonly" || className === "circle" || className === "loading" || exclude?.includes(className)) {
			return className;
		}
		return `${APPNAME}-${className}`;
	});
	return cls.join(" ");
};
