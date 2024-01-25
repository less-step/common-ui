import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import exclude from "rollup-plugin-exclude-dependencies-from-bundle";
const tsconfigOverride = {
	compilerOptions: {
		declaration: true,
	},
	exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx", "src/App.tsx", "src/index.tsx", "src/react-app-env.d.ts", "src/reportWebVitals.ts", "src/setupTests.ts"],
};
export default {
	input: "src/component.ts",
	output: {
		file: "dist/component.es.js",
		format: "es",
	},
	plugins: [json(), commonjs(), nodeResolve(), typescript({ tsconfigOverride }), sass({ output: "dist/index.css" }), exclude()],
};
