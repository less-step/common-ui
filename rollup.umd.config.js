import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
const tsconfigOverride = {
	compilerOptions: {
		declaration: true,
	},
	exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx", "src/App.tsx", "src/index.tsx", "src/react-app-env.d.ts", "src/reportWebVitals.ts", "src/setupTests.ts"],
};
export default {
	input: "src/component.ts",
	output: {
		name: "LessStepCommon",
		file: "dist/component.umd.js",
		format: "umd",
		exports: "named",
		globals: {
			react: "React",
			"react-dom": "ReactDOM",
			axios: "Axios",
		},
	},
	plugins: [
		json(),
		commonjs(),
		nodeResolve(),
		typescript({ tsconfigOverride }),
		sass({ output: "dist/index.css" }),
		terser(),
		replace({
			"process.env.NODE_ENV": JSON.stringify("production"),
		}),
	],
	external: ["react", "react-dom", "axios"],
};
