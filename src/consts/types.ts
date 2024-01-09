/**
 * 合并类型，U的属性类型会覆盖T中的
 */
export type MergeTypes<T, U> = {
	[K in keyof T]: K extends keyof U ? U[K] : T[K];
} & U;
