# 这是一个通用的 react 组件库（仿 antd4.x）


## 2024/1/3 
* 使用fontawesome新增Icon组件
```
npm i --save @fortawesome/fontawesome-svg-core
### Free icons styles
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
### 安装 react-transition-group 实现动画效果
npm install react-transition-group --save
```
    
---

## 2024/1/14
* 新增Upload组件
* 处理mouseLeave和mouseEnter的操作是比较通用的操作，抽离到了useMouseInOut hook中

## 2024/1/20
* 优化AutoComplete组件，在选择选项以后手动触发input标签的input事件，从而达到调用onChange事件的效果
  * 这里得到一个结论就是input的change事件是在失去焦点以后触发的，所以我使用input来作为onChange的触发实际。
* 新增Form组件
  * Form组件中维护表单数据以及状态的控制部分抽离到useStore中处理。
  * FormItem组件中对于子控件，采用React.cloneElement的方式注入value,onChange属性，从而使子组件完全受控于Form。
  * Form组件使用ref来实现外部控制，使用useImperativeHanlder来强制挂在ref为指定函数

