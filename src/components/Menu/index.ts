import OriginMenu from "./menu";
import MenuItem from "./menuItem";
import SubMenu from "./subMenu";

type MenuType = typeof OriginMenu & {
	/**菜单子项 */
	Item: typeof MenuItem;
	/**子菜单 */
	SubMenu: typeof SubMenu;
};
/**表单组件 */
const Menu = OriginMenu as MenuType;
Menu.Item = MenuItem;
Menu.SubMenu = SubMenu;
export default Menu;
