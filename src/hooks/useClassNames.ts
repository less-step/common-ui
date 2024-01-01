import { APPNAME } from "../consts";
export const useClassNames = function (classNames: string) {
	const cls = classNames.split(" ").map((className) => {
		if (className === "disabled") {
			return className;
		}
		return `${APPNAME}-${className}`;
	});
	return cls.join(" ");
};
