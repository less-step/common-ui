import React from "react";
import "./styles/index.scss";
import Layout from "./components/Layout/layout";
import Header from "./components/Layout/header";
import Content from "./components/Layout/content";
function App() {
  return (
    <div className="App">
      <hr />
      <h1>hello world</h1>
      <h2>hello world</h2>
      <h3>hello world</h3>
      <h4>hello world</h4>
      <h5>hello world</h5>
      <h6>hello world</h6>
      <p>google</p>
      <ul>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>
          <ol>
            <li>2</li>
            <li>2</li>
            <li>2</li>
            <li>2</li>
            <li>2</li>
            <li>2</li>
          </ol>
        </li>
      </ul>
      <div style={{ height: "300px" }}>
        <Layout>
          <Header>123</Header>
          <Content>
            <div style={{ overflow: "auto" }}>
              <hr />
              <h1>hello world</h1>
              <h2>hello world</h2>
              <h3>hello world</h3>
              <h4>hello world</h4>
              <h5>hello world</h5>
              <h6>hello world</h6>
              <p>google</p>
              <ul>
                <li>1</li>
                <li>1</li>
                <li>1</li>
                <li>1</li>
                <li>1</li>
                <li>
                  <ol>
                    <li>2</li>
                    <li>2</li>
                    <li>2</li>
                    <li>2</li>
                    <li>2</li>
                    <li>2</li>
                  </ol>
                </li>
              </ul>
            </div>
          </Content>
        </Layout>
      </div>
    </div>
  );
}

export default App;
