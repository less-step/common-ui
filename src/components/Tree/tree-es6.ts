import treeUtils, { Trigger } from "./tree-utils-es6";

export type TreeTitle = JSX.Element | string | null | undefined;
export type FieldNames<T> = {
	title: keyof T;
	key: keyof T;
	children: keyof T;
};
type UpdateHandler<T extends Record<string, any>> = {
	(treeNode: TreeNode<T>): Partial<T>;
};
export class TreeNode<T extends Record<string, any>> {
	children: TreeNode<T>[] = [];
	title: TreeTitle = "";
	key: string = "";
	countIndex: number = 0;
	nativeData: T;
	isLeaf: boolean = false;
	parentNode: TreeNode<T> | undefined = undefined;
	constructor(key: string, title: TreeTitle, countIndex: number, nativeData: T, parenNode: TreeNode<T> | undefined) {
		this.key = key;
		this.title = title;
		this.countIndex = countIndex;
		this.nativeData = nativeData;
		this.parentNode = parenNode;
	}

	update(updateHandler: UpdateHandler<T>) {
		const result = updateHandler(this);
		Object.assign(this, result);
	}

	updateChildrenIndex() {
		this.children.forEach((node, index) => {
			node.countIndex = index;
		});
	}

	deleteChild(node: TreeNode<T>) {
		const index = this.children.findIndex((n) => n.key === node.key);
		this.children.splice(index, 1);
		this.updateChildrenIndex();
	}

	addChildren(data: T[], start: number, fieldNames: FieldNames<T>) {
		const newNodes = data.map((nativeData, index) => {
			return new TreeNode<T>(nativeData[fieldNames.key], nativeData[fieldNames.title], index + start, nativeData, this);
		});
		this.children.splice(start, 0, ...newNodes);
		this.updateChildrenIndex();
	}

	addChild(data: T, start: number, fieldNames: FieldNames<T>) {
		this.addChildren([data], start, fieldNames);
		this.updateChildrenIndex();
	}

	replaceChildren(data: T[], fieldNames: FieldNames<T>) {
		const newNodes = data.map((nativeData, index) => {
			return new TreeNode<T>(nativeData[fieldNames.key], nativeData[fieldNames.title], index, nativeData, this);
		});
		this.children = newNodes;
		this.updateChildrenIndex();
	}

	getPath() {
		const pathList = [];
		let currentNode: TreeNode<T> | undefined = this as TreeNode<T>;
		while (!!currentNode) {
			pathList.unshift(currentNode.countIndex);
			currentNode = currentNode.parentNode;
		}
		return pathList;
	}
}

export class Tree<T extends Record<string, any>, F extends FieldNames<T>> {
	root: TreeNode<T>;
	fieldNames: F;
	constructor(fieldNames: F, treeData?: T[]) {
		this.fieldNames = fieldNames;
		this.root = new TreeNode<T>("root", "root", 0, null as any, undefined);
		if (treeData) {
			const newNodes = treeData.map((data, index) => {
				const key = data[fieldNames.key];
				const title = data[fieldNames.title] || "";
				const node = new TreeNode<T>(key, title, index, data, undefined);
				return node;
			});
			this.root.children = newNodes;
		}
	}
	addNodeOnRoot(nativeData: T[]) {
		this.root.addChildren(nativeData, 0, this.fieldNames);
	}
	addNode(key: string, nativeData: T, start: number) {
		const node = treeUtils.queryNodeByKey<T>(key, this.root.children);
		if (node) {
			node.addChild(nativeData, start, this.fieldNames);
		}
	}
	addNodes(key: string, nativeData: T[], start: number) {
		const node = treeUtils.queryNodeByKey<T>(key, this.root.children);
		if (node) {
			node.addChildren(nativeData, start, this.fieldNames);
		}
	}
	replaceChildren(key: string, nativeData: T[]) {
		const node = treeUtils.queryNodeByKey<T>(key, this.root.children);
		if (node) {
			node.replaceChildren(nativeData, this.fieldNames);
		}
	}
	updateNode(key: string, updateHandler: UpdateHandler<T>) {
		const node = treeUtils.queryNodeByKey<T>(key, this.root.children);
		if (node) {
			node.update(updateHandler);
		}
	}
	updateNodes(trigger: Trigger<T>, updateHandler: UpdateHandler<T>) {
		const nodes = treeUtils.queryAllNode(trigger, this.root.children);
		nodes.forEach((node) => {
			node.update(updateHandler);
		});
	}
	deleteNode(key: string) {
		const node = treeUtils.queryNodeByKey<T>(key, this.root.children);
		if (node) {
			if (node.parentNode) {
				node.parentNode.deleteChild(node);
			} else {
				this.root.deleteChild(node);
			}
		}
	}
	deleteNodes(trigger: Trigger<T>) {
		const nodes = treeUtils.queryAllNode(trigger, this.root.children);
		nodes.forEach((node) => {
			if (node.parentNode) {
				node.parentNode.deleteChild(node);
			} else {
				this.root.deleteChild(node);
			}
		});
	}
}
