import { Key } from "react";
import { TreeNode } from "./tree-es6";
export interface UpdateHandler<T extends Record<string, any>> {
	(treeNode: TreeNode<T>): Partial<TreeNode<T>>;
}
export interface Trigger<T extends Record<string, any>> {
	(treeNode: TreeNode<T>): boolean;
}

type TraverseType = "dfs" | "wfs";

/* 树的深度查询 */
function DFSQuery<T extends Record<string, any>>(node: TreeNode<T>, trigger: Trigger<T>): TreeNode<T> | undefined {
	if (trigger(node)) {
		return node;
	} else {
		if (!node.children) return undefined;
		for (let i = 0; i < node.children.length; i++) {
			const result = DFSQuery(node.children[i], trigger);
			if (result) {
				return result;
			}
		}
	}
	return undefined;
}

function DFSQueryAll<T extends Record<string, any>>(node: TreeNode<T>, trigger: Trigger<T>): TreeNode<T>[] {
	let nodeList: TreeNode<T>[] = [];
	if (node.children) {
		for (let i = 0; i < node.children.length; i++) {
			const subNodeList = DFSQueryAll(node.children[i], trigger);
			nodeList = nodeList.concat(subNodeList);
		}
	}
	if (trigger(node)) {
		nodeList.push(node);
	}
	return nodeList;
}

/* 树的广度查询 */
function WFSQuery<T extends Record<string, any>>(node: TreeNode<T>, trigger: Trigger<T>): TreeNode<T> | undefined {
	const stack = [node];
	let currentNode;
	while (stack.length > 0) {
		currentNode = stack.shift() as TreeNode<T>;
		if (trigger(currentNode)) {
			return currentNode;
		}
		if (currentNode.children) {
			for (let i = 0; i < currentNode.children.length; i++) {
				stack.push(currentNode.children[i]);
			}
		}
	}
}

/* 深度遍历查询节点 */
function queryNodeByDFS<T extends Record<string, any>>(trigger: Trigger<T>, treeData: TreeNode<T>[]) {
	for (let i = 0; i < treeData.length; i++) {
		const result = DFSQuery(treeData[i], trigger);
		if (result) return result;
	}
}

function queryAllNodeByDFS<T extends Record<string, any>>(trigger: Trigger<T>, treeData: TreeNode<T>[]) {
	if (!treeData) {
		return [];
	}
	let nodeList: TreeNode<T>[] = [];
	for (let i = 0; i < treeData.length; i++) {
		const subList = DFSQueryAll(treeData[i], trigger);
		nodeList = nodeList.concat(subList);
	}
	return nodeList;
}

/* 广度遍历查询节点 */
function queryNodeByWFS<T extends Record<string, any>>(trigger: Trigger<T>, treeData: TreeNode<T>[]) {
	for (let i = 0; i < treeData.length; i++) {
		const result = WFSQuery(treeData[i], trigger);
		if (result) return result;
	}
}

/* 根据key查询节点，默认使用深度查询DFS */
function queryNodeByKey<T extends Record<string, any>>(key: Key, treeData: TreeNode<T>[], traverseType?: TraverseType) {
	return traverseType === "wfs" ? queryNodeByDFS((node) => node.key === key, treeData) : queryNodeByWFS((node) => node.key === key, treeData);
}

/* 判断path是否合法 */
function isValidPath(str: string) {
	return /^\d+(-\d+)*$/.test(str);
}

/* 根据path查询节点 */
function queryNodeByPath<T extends Record<string, any>>(path: string, treeData: TreeNode<T>[]) {
	if (!isValidPath) {
		return undefined;
	}
	const indexList = path.split("-");
	if (indexList.length === 0) {
		return undefined;
	}
	if (indexList.length === 1) {
		return treeData[indexList.length - 1];
	}
	return indexList.slice(0, -1).reduce((pos, key) => {
		const index = parseInt(key) as number;
		return pos[index].children;
	}, treeData)[indexList.length - 1];
}

export default {
	queryNodeByKey,
	queryNodeByPath,
	queryAllNode: queryAllNodeByDFS,
};
