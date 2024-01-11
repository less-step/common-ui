import React, { useState } from "react";
import "./styles/index.scss";
import Layout from "./components/Layout/layout";
import Header from "./components/Layout/header";
import Content from "./components/Layout/content";
import Button from "./components/Button/button";
import Menu from "./components/Menu/menu";
import SubMenu from "./components/Menu/subMenu";
import Icon from "./components/Icon/icon";
import Transition from "./components/Transition/transition";
function App() {
	const [visible, setVisible] = useState(false);
	return (
		<div className="App">
			<Layout>
				<Header>
					<Icon icon="coffee" theme="dark" />
				</Header>
				<Content>
					<Button>Button</Button>
					<Button size="sm">Button</Button>
					<Button size="lg">Button</Button>
					<hr />
					<Button type="primary">Button</Button>
					<Button type="primary" size="sm">
						Button
					</Button>
					<Button type="primary" size="lg">
						Button
					</Button>
					<hr />
					<Button disabled>Button</Button>
					<Button size="sm" disabled>
						Button
					</Button>
					<Button size="lg" disabled>
						Button
					</Button>
					<hr />
					<Button danger>Button</Button>
					<Button size="sm" danger>
						Button
					</Button>
					<Button size="lg" danger>
						Button
					</Button>
					<hr />
					<Button danger type="primary">
						Button
					</Button>
					<Button size="sm" danger type="primary">
						Button
					</Button>
					<Button size="lg" danger type="primary">
						Button
					</Button>
					<hr />
					<Button danger type="primary" disabled>
						禁用
					</Button>
					<Button size="sm" danger type="primary" disabled>
						禁用
					</Button>
					<Button size="lg" danger type="primary" disabled>
						禁用
					</Button>
					<hr />
					<Button
						type="link"
						danger
						size="lg"
						onClick={(e) => {
							console.log("Button");
						}}
						href="http://www.baidu.com"
					>
						Button
					</Button>
					<Button type="link" danger size="mid" disabled>
						Button
					</Button>
					<Button type="link" danger size="sm">
						Button
					</Button>
					<hr />
					<Menu mode="horizontal">
						<Menu.Item disabled>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<SubMenu title="测试章节">
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
						</SubMenu>
					</Menu>
					<Menu defaultActiveKey="0" mode="vertical">
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<SubMenu title="测试章节" defaultExpanded>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
							<Menu.Item>第二章节</Menu.Item>
						</SubMenu>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
						<Menu.Item>第一章节</Menu.Item>
					</Menu>
				</Content>
			</Layout>
			<Button onClick={() => setVisible(!visible)}>测试姜叔叔</Button>
			<Transition visible={visible} type={"zoom-in-top"} timeout={300}>
				<Button>姜叔叔</Button>
			</Transition>
		</div>
	);
}

export default App;
