import React, { Key, MouseEvent, ReactNode, useContext, useMemo, useRef } from "react";
import Icon from "../Icon";
import { useOuter } from "../../hooks/useOuter";
import cls from "classnames";
import DndList from "../Dnd/dnd-list";
import Transition from "../Transition";
type IndentProps = {
	level: number;
};
function Indent(props: IndentProps) {
	return <div className="indent" style={{ width: props.level + "rem" }}></div>;
}

type TreeRef = {};
type TreeNodeType = {
	children: TreeNodeType[];
	[key: string]: any;
};
type FieldNames = {
	key: string;
	title: string;
	children: string;
};
type onExpandHandler = (keys: Key[], info: { node: TreeNodeEntity; expanded: boolean; nativeEvent: React.MouseEvent }) => void;
type onSelectHandler = (keys: Key[], info: { node: TreeNodeEntity; selected: boolean; nativeEvent: React.MouseEvent }) => void;
type onContextMenuHandler = (key: Key, node: TreeNodeType, nativeEvent: React.MouseEvent) => void;
export type TreeProps = {
	treeData: TreeNodeType[];
	expandedKeys?: Key[];
	selectedKeys?: Key[];
	fieldNames?: FieldNames;
	multiple?: boolean;
	columns?: Column[];
	titleRender: ((node: TreeNodeType) => ReactNode | null) | null | undefined;
	onExpand?: onExpandHandler;
	onSelect?: onSelectHandler;
	onContextMenu?: onContextMenuHandler;
};

export interface TreeNodeEntity extends TreeNodeType {
	level: number;
	parentNode: TreeNodeEntity | null;
	path: number;
	expanded: boolean;
	selected: boolean;
	key: Key;
	title: JSX.Element | string | number | null | undefined;
	nativeData: TreeNodeType;
}

function flattenTree(
	treeData: TreeNodeType[],
	expandedKeys: Key[],
	selectedKeys: Key[],
	treeNodeEntityMap: Map<Key, TreeNodeEntity>,
	fieldNames: FieldNames,
	titleRender: ((node: TreeNodeType) => ReactNode | null) | null | undefined,
) {
	treeNodeEntityMap?.clear();
	const flattened: TreeNodeEntity[] = [];
	function helper(node: TreeNodeType, parentNode: TreeNodeEntity | null, level: number, path: number) {
		let entity = {
			level,
			parentNode,
			path,
			expanded: expandedKeys.includes(node.key),
			selected: selectedKeys.includes(node.key),
			key: node[fieldNames.key],
			title: titleRender ? titleRender(node) : node[fieldNames.title],
			children: node[fieldNames.children],
			nativeData: node,
		};
		treeNodeEntityMap?.set(node.key, entity);
		flattened.push(entity);
		node.children.forEach((child, index) => helper(child, entity, level + 1, index));
	}

	treeData.forEach((node, index) => {
		helper(node, null, 0, index);
	});

	return flattened;
}
type Column = {
	key: string;
	title: string;
};
type TreeContextType = {
	updateEntityProperty(nodeEntity: TreeNodeEntity, propertyName: keyof TreeNodeEntity, propertyValue: any): any;
	columns: Column[];
	setColumns(columns: Column[] | ((columns: Column[]) => Column[])): void;
};
const TreeContext = React.createContext<TreeContextType>({
	updateEntityProperty() {},
	columns: [],
	setColumns() {},
});

function isTableMode(columns: Record<string, any>[]) {
	if (columns.length === 0) return false;
	return columns.every((column) => {
		return Boolean(column.key) && Boolean(column.title);
	});
}

const Tree = React.forwardRef<TreeRef, TreeProps>((props, ref) => {
	const { treeData, expandedKeys: outerExpandedKeys, selectedKeys: outerSelectedKeys, fieldNames, multiple, columns: outerColumns, onExpand, onSelect, onContextMenu } = props as Required<TreeProps>;
	const [expandedKeys, setExpandedKeys] = useOuter<Key[]>(outerExpandedKeys);
	const [selectedKeys, setSelectedKeys] = useOuter<Key[]>(outerSelectedKeys);
	const [columns, setColumns] = useOuter<Column[]>(outerColumns);
	const treeNodeEntityMap = useRef<Map<Key, TreeNodeEntity>>(new Map());
	const nodeEntityList = useMemo(() => {
		return flattenTree(treeData, expandedKeys, selectedKeys, treeNodeEntityMap.current, fieldNames, props.titleRender);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [treeData, expandedKeys, selectedKeys]);
	function updateEntityProperty(nodeEntity: TreeNodeEntity, propertyName: keyof TreeNodeEntity, propertyValue: any): any {
		switch (propertyName) {
			case "selected":
				if (nodeEntity.selected) {
					const newSelectedKeys = selectedKeys.filter((key) => key !== nodeEntity.key);
					setSelectedKeys(newSelectedKeys);
					return newSelectedKeys;
				} else {
					let newSelectedKeys;
					if (multiple) {
						newSelectedKeys = [...selectedKeys, nodeEntity.key];
					} else {
						newSelectedKeys = [nodeEntity.key];
					}
					setSelectedKeys(newSelectedKeys);
					return selectedKeys;
				}
			case "expanded":
				if (nodeEntity.expanded) {
					const newExpandedKeys = expandedKeys.filter((key) => key !== nodeEntity.key);
					setExpandedKeys(newExpandedKeys);
					return newExpandedKeys;
				} else {
					const newExpandedKeys = [...expandedKeys, nodeEntity.key];
					setExpandedKeys(newExpandedKeys);
					return newExpandedKeys;
				}
			default:
		}
	}
	return (
		<TreeContext.Provider value={{ updateEntityProperty, columns, setColumns }}>
			<ul className="tree">
				<li className={cls("tree-node", "header")} hidden={!isTableMode(columns)}>
					<div className="main">BOM树</div>
					{columns.length > 0 && (
						<div className="detail">
							<div className="item-group">
								<DndList direction={"row"} list={columns} setList={setColumns} titleRender={(column) => <span>{column.title}</span>} className={"item"} />
							</div>
						</div>
					)}
				</li>
				{nodeEntityList.map((nodeEntity) => {
					return <TreeNode nodeEntity={nodeEntity} key={nodeEntity.key} onExpand={onExpand} onSelect={onSelect} onContextMenu={onContextMenu} />;
				})}
			</ul>
		</TreeContext.Provider>
	);
});

/* TreeNode */
type TreeNodeProps = {
	nodeEntity: TreeNodeEntity;
	onExpand?: onExpandHandler;
	onSelect?: onSelectHandler;
	onContextMenu?: onContextMenuHandler;
};
type TreeNodeRef = {};
const TreeNode = React.forwardRef<TreeNodeRef, TreeNodeProps>((props, ref) => {
	const { nodeEntity, onExpand, onSelect, onContextMenu } = props;
	const { updateEntityProperty, columns } = useContext(TreeContext);
	return (
		<Transition visible={nodeEntity.parentNode ? nodeEntity.parentNode.expanded : true} type={"zoom-in-top"} timeout={300}>
			<li
				key={nodeEntity.key}
				className={cls("tree-node", "body", {
					selected: nodeEntity.selected,
				})}
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					const selectedKeys = updateEntityProperty(nodeEntity, "selected", !nodeEntity.selected) as Key[];
					onSelect?.(selectedKeys, {
						node: nodeEntity,
						selected: !nodeEntity.selected,
						nativeEvent: e as MouseEvent,
					});
				}}
				onContextMenu={(e) => {
					e.stopPropagation();
					e.preventDefault();
					onContextMenu?.(nodeEntity.key, nodeEntity.nativeData, e);
				}}
			>
				<div className="main">
					<Indent level={nodeEntity.level} />
					<Icon
						icon={nodeEntity.expanded ? "caret-down" : "caret-right"}
						className="expand-handler"
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							const expandedKeys = updateEntityProperty(nodeEntity, "expanded", !nodeEntity.expanded) as Key[];
							onExpand?.(expandedKeys, {
								node: nodeEntity,
								expanded: !nodeEntity.expanded,
								nativeEvent: e as MouseEvent,
							});
						}}
					/>
					<div className="tree-title-container">{nodeEntity.title}</div>
				</div>
				{isTableMode(columns) && (
					<div className="detail">
						<div className="item-group">
							{columns.map((column) => {
								return (
									<div className="item" key={column.key}>
										{nodeEntity.nativeData[column.key]}
									</div>
								);
							})}
						</div>
					</div>
				)}
			</li>
		</Transition>
	);
});

Tree.defaultProps = {
	selectedKeys: [],
	expandedKeys: [],
	fieldNames: {
		key: "key",
		title: "title",
		children: "children",
	},
	multiple: false,
	columns: [],
};

export default Tree;
