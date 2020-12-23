import { uniqueId } from 'lodash'
/**
 *
/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} indexKey  索引Key
 */
export function elMenuItem(h, menu, indexKey = 'path') {
  let icon = null
  if (menu.icon) icon = <i class={ `ibps-icon ibps-icon-${menu.icon}` }/>
  else if (menu.iconSvg) icon = <ibps-icon-svg name={ menu.iconSvg }/>
  else icon = <i class='ibps-icon ibps-icon-file-o'/>
  const index = menu[indexKey] || uniqueId('ibps-menu-empty-')
  return <el-menu-item
    key={ index }
    index={ index }>
    { icon }
    <span slot='title'>{ menu.name || this.$t('layout.header-aside.menu-item.label-default')}</span>
  </el-menu-item>
}

/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} indexKey  索引Key
 */
export function elSubmenu(h, menu, indexKey = 'path') {
  let icon = null
  if (menu.icon) icon = <i slot='title' class={ `ibps-icon ibps-icon-${menu.icon}` }/>
  else if (menu.iconSvg) icon = <ibps-icon-svg slot='title' name={ menu.iconSvg }/>
  else icon = <i slot='title' class='ibps-icon ibps-icon-folder-o'/>
  const index = menu[indexKey] || uniqueId('ibps-menu-empty-')
  return <el-submenu
    key={ index }
    index={ index }>
    { icon }
    <span slot='title'>{menu.name || this.$t('layout.header-aside.menu-item.label-default') }</span>
    { menu.children.map(child => createMenu.call(this, h, child, indexKey)) }
  </el-submenu>
}

/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} indexKey  索引Key
 */
export function createMenu(h, menu, indexKey = 'path') {
  if (menu.children === undefined || menu.children === null) return elMenuItem.call(this, h, menu, indexKey)
  return elSubmenu.call(this, h, menu, indexKey)
}

