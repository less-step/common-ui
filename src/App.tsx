import React from "react";
import "./styles/index.scss";
import Layout from "./components/Layout/layout";
import Header from "./components/Layout/header";
import Content from "./components/Layout/content";
import Button from "./components/Button/button";
function App() {
	return (
		<div className="App">
			<Layout>
				<Header>Button</Header>
				<Content>
					<Button>Button</Button>
					<Button size="sm">Button</Button>
					<Button size="lg">Button</Button>
					<hr />
					<Button btnType="primary">Button</Button>
					<Button btnType="primary" size="sm">
						Button
					</Button>
					<Button btnType="primary" size="lg">
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
					<Button danger btnType="primary">
						Button
					</Button>
					<Button size="sm" danger btnType="primary">
						Button
					</Button>
					<Button size="lg" danger btnType="primary">
						Button
					</Button>
					<hr />
					<Button danger btnType="primary" disabled>
						禁用
					</Button>
					<Button size="sm" danger btnType="primary" disabled>
						禁用
					</Button>
					<Button size="lg" danger btnType="primary" disabled>
						禁用
					</Button>
					<hr />
					<Button
						btnType="link"
						danger
						size="lg"
						onClick={(e) => {
							console.log("Button");
						}}
						href="http://www.baidu.com"
					>
						Button
					</Button>
					<Button btnType="link" danger size="mid" disabled>
						Button
					</Button>
					<Button btnType="link" danger size="sm">
						Button
					</Button>
				</Content>
			</Layout>
		</div>
	);
}

export default App;
